import { ComponentFixture, TestBed, async } from '@angular/core/testing';

import { EditorialBlockComponent } from './editorial-block.component';

describe('EditorialBlockComponent', () => {
  let component: EditorialBlockComponent;
  let fixture: ComponentFixture<EditorialBlockComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EditorialBlockComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditorialBlockComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
