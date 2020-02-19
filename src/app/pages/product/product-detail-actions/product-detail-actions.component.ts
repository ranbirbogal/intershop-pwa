import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { ProductContextFacade } from 'ish-core/facades/product-context.facade';
import { ProductHelper } from 'ish-core/models/product/product.model';

@Component({
  selector: 'ish-product-detail-actions',
  templateUrl: './product-detail-actions.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductDetailActionsComponent {
  @Input() currentUrl: string;

  // TODO: to be removed once channelName inforamtion available in system
  channelName = 'inTRONICS';

  isMasterProduct = ProductHelper.isMasterProduct;

  product$ = this.productContext.product$;

  constructor(private productContext: ProductContextFacade) {}

  addToCompare() {
    this.productContext.addToCompare();
  }
}
