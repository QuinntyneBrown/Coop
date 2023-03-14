// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

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

