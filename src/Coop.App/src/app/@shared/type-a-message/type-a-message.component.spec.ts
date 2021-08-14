import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TypeAMessageComponent } from './type-a-message.component';

describe('TypeAMessageComponent', () => {
  let component: TypeAMessageComponent;
  let fixture: ComponentFixture<TypeAMessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TypeAMessageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TypeAMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
