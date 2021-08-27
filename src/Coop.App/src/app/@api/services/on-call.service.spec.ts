import { TestBed } from '@angular/core/testing';

import { OnCallService } from './on-call.service';

describe('OnCallService', () => {
  let service: OnCallService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OnCallService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
