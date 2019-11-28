import { at } from '../../framework';
import { HomePage } from '../../pages/home.page';
import { SearchResultPage } from '../../pages/shopping/search-result.page';

const _ = {
  suggestTerm: 'k',
  searchTerm: 'kodak',
  suggestItemText: 'Kodak',
  product: '7912057',
  results: 23,
  filter: {
    name: 'Price',
    entryName: 'ProductSalePriceGross_100_-_250',
    results: 16,
  },
};

describe('Searching User', () => {
  before(() => HomePage.navigateTo());

  it('should enter search term and wait for displayed suggestions', () => {
    at(HomePage, page => page.header.getSearchSuggestions(_.suggestTerm).should('contain', _.suggestItemText));
  });

  it('should perform search and land on search result page', () => {
    at(HomePage, page => page.header.doProductSearch(_.searchTerm));
    at(SearchResultPage);
  });

  it('should see results on search result page', () => {
    at(SearchResultPage, page => page.productList.visibleProducts.should('have.length.gte', 1));
  });

  it('should see the correct filter', () => {
    at(SearchResultPage, page => {
      page.filterNavigation
        .filter('Color')
        .getFilter('Colour_of_product_Red')
        .should('be.visible');

      page.filterNavigation
        .filter(_.filter.name)
        .getFilter(_.filter.entryName)
        .should('contain', `(${_.filter.results})`);
    });
  });

  it('should filter products by price', () => {
    at(SearchResultPage, page => page.filterNavigation.filter(_.filter.name).filterClick(_.filter.entryName));
  });

  it(`should see other results in search result page`, () => {
    at(SearchResultPage, page => page.productList.numberOfItems.should('equal', _.filter.results));
  });

  it('should deselect filter', () => {
    at(SearchResultPage, page => page.filterNavigation.filter(_.filter.name).filterClick(_.filter.entryName));
  });

  it(`should see other results in search result page`, () => {
    at(SearchResultPage, page => page.productList.numberOfItems.should('equal', _.results));
  });
});