// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { TestBed } from '@angular/core/testing';

import { NoticeService } from './notice.service';

describe('NoticeService', () => {
  let service: NoticeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NoticeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

