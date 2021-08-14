import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ByLawListComponent } from './by-law-list.component';

describe('ByLawListComponent', () => {
  let component: ByLawListComponent;
  let fixture: ComponentFixture<ByLawListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ByLawListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ByLawListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
