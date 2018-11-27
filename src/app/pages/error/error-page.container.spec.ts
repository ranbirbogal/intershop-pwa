import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { instance, mock } from 'ts-mockito';

import { MockComponent } from 'ish-core/utils/dev/mock.component';

import { ErrorPageContainerComponent } from './error-page.container';

describe('Error Page Container', () => {
  let component: ErrorPageContainerComponent;
  let fixture: ComponentFixture<ErrorPageContainerComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ErrorPageContainerComponent,
        MockComponent({
          selector: 'ish-server-error-page',
          template: 'Server Error Page Component',
          inputs: ['error'],
        }),
        MockComponent({ selector: 'ish-error-page', template: 'Error Page Component' }),
      ],
      providers: [{ provide: Store, useFactory: () => instance(mock(Store)) }],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ErrorPageContainerComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
