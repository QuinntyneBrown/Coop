import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DigitalAssetUploadComponent } from './digital-asset-upload.component';

describe('DigitalAssetUploadComponent', () => {
  let component: DigitalAssetUploadComponent;
  let fixture: ComponentFixture<DigitalAssetUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DigitalAssetUploadComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DigitalAssetUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
