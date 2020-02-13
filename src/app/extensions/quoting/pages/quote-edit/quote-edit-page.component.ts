import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { take, withLatestFrom } from 'rxjs/operators';

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
export class QuoteEditPageComponent implements OnInit {
  quote$: Observable<Quote>;
  quoteLoading$: Observable<boolean>;
  quoteError$: Observable<HttpError>;
  user$: Observable<User>;

  constructor(
    private quotingFacade: QuotingFacade,
    private accountFacade: AccountFacade,
    private appFacade: AppFacade
  ) {}

  ngOnInit() {
    this.quote$ = this.quotingFacade.quote$;
    this.quoteLoading$ = this.quotingFacade.quoteLoading$;
    this.quoteError$ = this.quotingFacade.quoteError$;
    this.user$ = this.accountFacade.user$;

    this.patchBreadcrumbData();
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
        take(1)
      )
      .subscribe(([quote, breadcrumbData]) => {
        this.appFacade.setBreadcrumbData([...breadcrumbData, { text: quote.displayName }]);
      });
  }
}
