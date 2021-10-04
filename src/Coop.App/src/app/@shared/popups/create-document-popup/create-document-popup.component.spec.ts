import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateDocumentPopupComponent } from './create-document-popup.component';

describe('CreateDocumentPopupComponent', () => {
  let component: CreateDocumentPopupComponent;
  let fixture: ComponentFixture<CreateDocumentPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateDocumentPopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateDocumentPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
