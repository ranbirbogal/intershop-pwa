import { Injectable } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { AccountLoginService } from '../account-login/account-login.service';
import { GlobalStateAwareService } from '../base-services/global-state-aware.service';
import { WishListModel } from './wishlists.model';

@Injectable()
export class WishListService extends GlobalStateAwareService<WishListModel> {

  baseUrl = 'customers/-/wishlists/';

  constructor(
    private apiService: ApiService,
    private accountLoginService: AccountLoginService
  ) {
    super('wishListStatus', true, false);
    accountLoginService.subscribe(() => this.updateState(accountLoginService));
  }

  update() {
    this.updateState(this.accountLoginService);
  }

  private updateState(service: AccountLoginService) {
    if (service.isAuthorized()) {
      this.retrieveWishListFromServer();
    } else {
      this.next(null);
    }
  }

  private retrieveWishListFromServer() {
    this.apiService.get(this.baseUrl).subscribe(data => {
      const preferredWishListUrl = (!!data.elements && data.elements.length > 0) ?
        data.elements[0].uri.substring(data.elements[0].uri.lastIndexOf('/') + 1) : null;
      if (!!preferredWishListUrl) {
        this.apiService.get(this.baseUrl + preferredWishListUrl).subscribe((data2) => {
          this.next(data2);
        });
      }
    });
  }
}

