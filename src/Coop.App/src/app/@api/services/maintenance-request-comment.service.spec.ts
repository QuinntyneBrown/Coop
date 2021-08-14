import { TestBed } from '@angular/core/testing';

import { MaintenanceRequestCommentService } from './maintenance-request-comment.service';

describe('MaintenanceRequestCommentService', () => {
  let service: MaintenanceRequestCommentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MaintenanceRequestCommentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
