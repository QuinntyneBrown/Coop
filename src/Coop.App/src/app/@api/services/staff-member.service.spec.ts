import { TestBed } from '@angular/core/testing';

import { StaffMemberService } from './staff-member.service';

describe('StaffMemberService', () => {
  let service: StaffMemberService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StaffMemberService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
