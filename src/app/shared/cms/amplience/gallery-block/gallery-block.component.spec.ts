import { ComponentFixture, TestBed, async } from '@angular/core/testing';

import { GalleryBlockComponent } from './gallery-block.component';

describe('GalleryBlockComponent', () => {
  let component: GalleryBlockComponent;
  let fixture: ComponentFixture<GalleryBlockComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [GalleryBlockComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GalleryBlockComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
