import { TestBed } from '@angular/core/testing';

import { CssCustomPropertyService } from './css-custom-property.service';

describe('CssCustomPropertyService', () => {
  let service: CssCustomPropertyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CssCustomPropertyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
