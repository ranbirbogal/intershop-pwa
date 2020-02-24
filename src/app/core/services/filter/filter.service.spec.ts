import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { anything, instance, mock, verify, when } from 'ts-mockito';

import { FilterNavigationData } from 'ish-core/models/filter-navigation/filter-navigation.interface';
import { ApiService } from 'ish-core/services/api/api.service';
import { ngrxTesting } from 'ish-core/utils/dev/ngrx-testing';

import { FilterService } from './filter.service';

describe('Filter Service', () => {
  let apiService: ApiService;
  let filterService;
  const productsMock = {
    elements: [{ uri: 'products/123' }, { uri: 'products/234' }],
    total: 2,
  };
  const filterMock = {
    elements: [
      {
        name: 'blubb',
        id: 'test',
        displayType: 'text_clear',
        selectionType: 'single',
        filterEntries: [
          { name: 'a', link: { uri: 'domain/productfilters/dahinter?SearchParameter=' } },
          { name: 'b', link: { uri: 'domain/productfilters/dahinter?SearchParameter=' } },
        ],
      },
    ],
  } as FilterNavigationData;

  beforeEach(() => {
    apiService = mock(ApiService);

    TestBed.configureTestingModule({
      imports: [ngrxTesting({})],
      providers: [FilterService, { provide: ApiService, useFactory: () => instance(apiService) }],
    });
    filterService = TestBed.get(FilterService);
  });

  it('should be created', () => {
    expect(filterService).toBeTruthy();
  });

  it("should get Filter data when 'getFilterForCategory' is called", done => {
    when(apiService.get('categories/A/B/productfilters', anything())).thenReturn(of(filterMock));
    filterService.getFilterForCategory('A.B').subscribe(data => {
      expect(data.filter).toHaveLength(1);
      expect(data.filter[0].facets).toHaveLength(2);
      expect(data.filter[0].facets[0].name).toEqual('a');
      expect(data.filter[0].facets[1].name).toEqual('b');
      verify(apiService.get('categories/A/B/productfilters', anything())).once();
      done();
    });
  });

  it("should get Filter data when 'applyFilter' is called", done => {
    when(apiService.get('productfilters?SearchParameter=b')).thenReturn(of(filterMock));
    filterService.applyFilter('SearchParameter=b').subscribe(data => {
      expect(data.filter).toHaveLength(1);
      expect(data.filter[0].facets).toHaveLength(2);
      expect(data.filter[0].facets[0].name).toEqual('a');
      expect(data.filter[0].facets[1].name).toEqual('b');
      verify(apiService.get('productfilters?SearchParameter=b')).once();
      done();
    });
  });

  it("should get Product SKUs when 'getFilteredProducts' is called", done => {
    when(apiService.get('products?SearchParameter=b&returnSortKeys=true')).thenReturn(of(productsMock));
    filterService.getFilteredProducts('SearchParameter=b').subscribe(data => {
      expect(data).toEqual({
        productSKUs: ['123', '234'],
        total: 2,
      });
      verify(apiService.get('products?SearchParameter=b&returnSortKeys=true')).once();
      done();
    });
  });
});
