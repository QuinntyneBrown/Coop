import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageHeadingSubheadingPopupComponent } from './image-heading-subheading-popup.component';

describe('ImageHeadingSubheadingPopupComponent', () => {
  let component: ImageHeadingSubheadingPopupComponent;
  let fixture: ComponentFixture<ImageHeadingSubheadingPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImageHeadingSubheadingPopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImageHeadingSubheadingPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
