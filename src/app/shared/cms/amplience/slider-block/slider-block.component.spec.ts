import { ComponentFixture, TestBed, async } from '@angular/core/testing';

import { SliderBlockComponent } from './slider-block.component';

describe('SliderBlockComponent', () => {
  let component: SliderBlockComponent;
  let fixture: ComponentFixture<SliderBlockComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SliderBlockComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SliderBlockComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
