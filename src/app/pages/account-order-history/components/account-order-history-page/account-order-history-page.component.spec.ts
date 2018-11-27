import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';

import { MockComponent } from 'ish-core/utils/dev/mock.component';

import { AccountOrderHistoryPageComponent } from './account-order-history-page.component';

describe('Account Order History Page Component', () => {
  let component: AccountOrderHistoryPageComponent;
  let fixture: ComponentFixture<AccountOrderHistoryPageComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AccountOrderHistoryPageComponent,
        MockComponent({
          selector: 'ish-order-list-container',
          template: 'Order List Container Component',
        }),
      ],
      imports: [TranslateModule.forRoot()],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountOrderHistoryPageComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should render order list component on component', () => {
    fixture.detectChanges();
    expect(element.querySelector('ish-order-list-container')).toBeTruthy();
  });
});
