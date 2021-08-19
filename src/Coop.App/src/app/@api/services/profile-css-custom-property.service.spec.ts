import { TestBed } from '@angular/core/testing';

import { ProfileCssCustomPropertyService } from './profile-css-custom-property.service';

describe('ProfileCssCustomPropertyService', () => {
  let service: ProfileCssCustomPropertyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProfileCssCustomPropertyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
