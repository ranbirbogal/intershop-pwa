import { isPlatformBrowser } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject, OnInit, PLATFORM_ID, ViewChild } from '@angular/core';
import { CookieLawContainerComponent } from 'angular2-cookie-law';
import { Observable } from 'rxjs';

import { AppFacade } from 'ish-core/facades/app.facade';
import { DeviceType } from 'ish-core/models/viewtype/viewtype.types';
import { ActivatedRoute } from '@angular/router';

/**
 * The App Component provides the application frame for the single page application.
 * In addition to the page structure (header, main section, footer)
 * it holds the global functionality to present a cookie acceptance banner.
 */
@Component({
  selector: 'ish-root',
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
// tslint:disable-next-line:ccp-no-intelligence-in-components
export class AppComponent implements OnInit {
  @ViewChild('cookieLaw', { static: false }) private cookieLaw: CookieLawContainerComponent;

  isBrowser: boolean;
  wrapperClasses$: Observable<string[]>;
  deviceType$: Observable<DeviceType>;

  ampliencePreview = false;
  constructor(private appFacade: AppFacade, @Inject(PLATFORM_ID) platformId: string, private route: ActivatedRoute) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit() {
    this.deviceType$ = this.appFacade.deviceType$;
    this.wrapperClasses$ = this.appFacade.appWrapperClasses$;
    this.route.queryParamMap.subscribe(params => {
      let amplienceid = params.get('amplienceid');
      if (amplienceid) {
        this.ampliencePreview = true;
      }

      console.log('amplienceid', this.ampliencePreview);
    });
  }

  dismiss() {
    this.cookieLaw.dismiss();
  }
}
