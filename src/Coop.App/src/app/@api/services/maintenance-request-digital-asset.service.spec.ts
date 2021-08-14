import { TestBed } from '@angular/core/testing';

import { MaintenanceRequestDigitalAssetService } from './maintenance-request-digital-asset.service';

describe('MaintenanceRequestDigitalAssetService', () => {
  let service: MaintenanceRequestDigitalAssetService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MaintenanceRequestDigitalAssetService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
