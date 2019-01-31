import { TestBed } from '@angular/core/testing';
import { combineReducers } from '@ngrx/store';

import { TestStore, ngrxTesting } from 'ish-core/utils/dev/ngrx-testing';
import { Product } from '../../../models/product/product.model';
import { LoadProductSuccess, SelectProduct } from '../products';
import { shoppingReducers } from '../shopping-store.module';

import { RecentlyEffects } from './recently.effects';
import { getMostRecentlyViewedProducts, getRecentlyProducts, getRecentlyViewedProducts } from './recently.selectors';

describe('Recently Selectors', () => {
  let store$: TestStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: ngrxTesting(
        {
          shopping: combineReducers(shoppingReducers),
        },
        [RecentlyEffects]
      ),
    });

    store$ = TestBed.get(TestStore);
  });

  it('should select nothing for an empty state', () => {
    expect(getRecentlyProducts(store$.state)).toBeEmpty();
    expect(getRecentlyViewedProducts(store$.state)).toBeEmpty();
    expect(getMostRecentlyViewedProducts(store$.state)).toBeEmpty();
  });

  describe('after short shopping spree', () => {
    beforeEach(() => {
      ['A', 'B', 'C', 'D', 'E', 'F', 'G'].forEach(sku =>
        store$.dispatch(new LoadProductSuccess({ product: { sku } as Product }))
      );
      ['A', 'B', 'F', 'C', 'A', 'D', 'E', 'D', 'A', 'B', 'A'].forEach(sku =>
        store$.dispatch(new SelectProduct({ sku }))
      );
    });

    it('should have collected data for display on pages', () => {
      const viewed = ['A', 'B', 'D', 'E', 'C', 'F'];
      expect(getRecentlyProducts(store$.state)).toEqual(viewed);
      expect(getRecentlyViewedProducts(store$.state)).toEqual(viewed.map(sku => ({ sku } as Product)));
      const filtered = ['B', 'D', 'E', 'C'].map(sku => ({ sku } as Product));
      expect(getMostRecentlyViewedProducts(store$.state)).toEqual(filtered);
    });
  });
});
