import { TestBed } from '@angular/core/testing';

import { ByLawService } from './by-law.service';

describe('ByLawService', () => {
  let service: ByLawService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ByLawService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
