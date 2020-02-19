import { ApplicationRef, ChangeDetectionStrategy, Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, ReplaySubject, Subject, of } from 'rxjs';
import { filter, first, map, switchMap, takeUntil } from 'rxjs/operators';

import { AppFacade } from 'ish-core/facades/app.facade';
import { ProductContextFacade } from 'ish-core/facades/product-context.facade';
import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { FeatureToggleService } from 'ish-core/feature-toggle.module';
import { CategoryView } from 'ish-core/models/category-view/category-view.model';
import { ProductVariationHelper } from 'ish-core/models/product-variation/product-variation.helper';
import { VariationOptionGroup } from 'ish-core/models/product-variation/variation-option-group.model';
import { VariationSelection } from 'ish-core/models/product-variation/variation-selection.model';
import {
  ProductView,
  VariationProductMasterView,
  VariationProductView,
} from 'ish-core/models/product-view/product-view.model';
import {
  ProductCompletenessLevel,
  ProductHelper,
  ProductPrices,
  SkuQuantityType,
} from 'ish-core/models/product/product.model';
import { ProductRoutePipe } from 'ish-core/pipes/product-route.pipe';
import { whenTruthy } from 'ish-core/utils/operators';

@Component({
  selector: 'ish-product-page',
  templateUrl: './product-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ProductContextFacade],
})
export class ProductPageComponent implements OnInit, OnDestroy {
  product$: Observable<ProductView | VariationProductView | VariationProductMasterView>;
  productVariationOptions$: Observable<VariationOptionGroup[]>;
  productLoading$: Observable<boolean>;
  category$: Observable<CategoryView>;

  price$: Observable<ProductPrices>;

  currentUrl$: Observable<string>;

  isProductBundle = ProductHelper.isProductBundle;
  isRetailSet = ProductHelper.isRetailSet;
  isMasterProduct = ProductHelper.isMasterProduct;

  private destroy$ = new Subject();
  retailSetParts$ = new ReplaySubject<SkuQuantityType[]>(1);

  constructor(
    private appFacade: AppFacade,
    private shoppingFacade: ShoppingFacade,
    private router: Router,
    private prodRoutePipe: ProductRoutePipe,
    private featureToggleService: FeatureToggleService,
    private appRef: ApplicationRef,
    private ngZone: NgZone,
    productContext: ProductContextFacade,
    activatedRoute: ActivatedRoute
  ) {
    productContext.setCompletenessLevel(ProductCompletenessLevel.Detail);
    productContext.connectSKU(activatedRoute.paramMap.pipe(map(params => params.get('sku'))));
    this.product$ = productContext.product$;
    this.productLoading$ = productContext.loading$;
    this.productVariationOptions$ = productContext.productVariationOptions$;
  }

  ngOnInit() {
    this.category$ = this.shoppingFacade.selectedCategory$;
    this.currentUrl$ = this.appFacade.currentUrl$;

    this.product$
      .pipe(
        whenTruthy(),
        takeUntil(this.destroy$)
      )
      .subscribe(product => {
        if (
          ProductHelper.isMasterProduct(product) &&
          ProductVariationHelper.hasDefaultVariation(product) &&
          !this.featureToggleService.enabled('advancedVariationHandling')
        ) {
          this.redirectToVariation(product.defaultVariation(), true);
        }
        if (ProductHelper.isMasterProduct(product) && this.featureToggleService.enabled('advancedVariationHandling')) {
          this.shoppingFacade.loadMoreProducts({ type: 'master', value: product.sku }, 1);
        }
        if (ProductHelper.isRetailSet(product)) {
          this.retailSetParts$.next(product.partSKUs.map(sku => ({ sku, quantity: 1 })));
        }
      });

    this.price$ = this.product$.pipe(
      switchMap(product => {
        if (ProductHelper.isRetailSet(product)) {
          return this.retailSetParts$.pipe(
            filter(parts => !!parts && !!parts.length),
            switchMap(parts =>
              this.shoppingFacade.products$(parts.map(part => part.sku)).pipe(
                filter(products =>
                  products.every(p => ProductHelper.isSufficientlyLoaded(p, ProductCompletenessLevel.List))
                ),
                map(ProductHelper.calculatePriceRange)
              )
            )
          );
        } else {
          return of(undefined);
        }
      })
    );
  }

  // addToBasket() {
  //   this.product$
  //     .pipe(
  //       take(1),
  //       whenTruthy()
  //     )
  //     .subscribe(product => {
  //       if (ProductHelper.isRetailSet(product)) {
  //         this.retailSetParts$.pipe(take(1)).subscribe(parts =>
  //           parts
  //             .filter(({ quantity }) => !!quantity)
  //             .forEach(({ sku, quantity }) => {
  //               this.shoppingFacade.addProductToBasket(sku, quantity);
  //             })
  //         );
  //       } else {
  //         this.shoppingFacade.addProductToBasket(product.sku, this.quantity);
  //       }
  //     });
  // }

  variationSelected(selection: VariationSelection, product: VariationProductView) {
    const variation = ProductVariationHelper.findPossibleVariationForSelection(selection, product);
    this.redirectToVariation(variation);
  }

  redirectToVariation(variation: VariationProductView, replaceUrl = false) {
    const route = variation && this.prodRoutePipe.transform(variation);
    if (route) {
      this.appRef.isStable
        .pipe(
          whenTruthy(),
          first()
        )
        .subscribe(() => {
          this.ngZone.run(() => {
            this.router.navigateByUrl(route, { replaceUrl });
          });
        });
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
  }
}
