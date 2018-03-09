import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { CoreState } from '../../../core/store/user';
import { Product } from '../../../models/product/product.model';
import { getCompareProducts } from '../../store/compare';

@Component({
  selector: 'ish-compare-page-container',
  templateUrl: './compare-page.container.html'
})
export class ComparePageContainerComponent implements OnInit {

  compareProducts$: Observable<Product[]>;

  constructor(
    private store: Store<CoreState>
  ) { }

  ngOnInit() {
    this.compareProducts$ = this.store.pipe(select(getCompareProducts));
  }
}
