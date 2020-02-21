import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable, Subject } from 'rxjs';
import { take, takeUntil, withLatestFrom } from 'rxjs/operators';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { AppFacade } from 'ish-core/facades/app.facade';
import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { User } from 'ish-core/models/user/user.model';
import { whenTruthy } from 'ish-core/utils/operators';

import { QuotingFacade } from '../../facades/quoting.facade';
import { Quote } from '../../models/quote/quote.model';

@Component({
  selector: 'ish-quote-edit-page',
  templateUrl: './quote-edit-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuoteEditPageComponent implements OnInit, OnDestroy {
  quote$: Observable<Quote>;
  quoteLoading$: Observable<boolean>;
  quoteError$: Observable<HttpError>;
  user$: Observable<User>;

  private destroy$ = new Subject();

  constructor(
    private quotingFacade: QuotingFacade,
    private accountFacade: AccountFacade,
    private appFacade: AppFacade,
    private translateService: TranslateService
  ) {}

  ngOnInit() {
    this.quote$ = this.quotingFacade.quote$;
    this.quoteLoading$ = this.quotingFacade.quoteLoading$;
    this.quoteError$ = this.quotingFacade.quoteError$;
    this.user$ = this.accountFacade.user$;

    this.patchBreadcrumbData();
  }

  ngOnDestroy() {
    this.destroy$.next();
  }

  copyQuote() {
    this.quotingFacade.createQuoteRequestFromQuote();
  }

  rejectQuote() {
    this.quotingFacade.rejectQuote();
  }

  addQuoteToBasket(quoteId: string) {
    this.quotingFacade.addQuoteToBasket(quoteId);
  }

  private patchBreadcrumbData() {
    this.quote$
      .pipe(
        whenTruthy(),
        withLatestFrom(this.appFacade.breadcrumbData$),
        takeUntil(this.destroy$)
      )
      .subscribe(([quote, breadcrumbData]) => {
        this.translateService
          .get(
            quote.state === 'Responded'
              ? 'quote.edit.responded.quote_details.text'
              : 'quote.edit.unsubmitted.quote_request_details.text'
          )
          .pipe(take(1))
          .subscribe(x => {
            this.appFacade.setBreadcrumbData([...breadcrumbData.slice(0, -1), { text: `${x} - ${quote.displayName}` }]);
          });
      });
  }
}
