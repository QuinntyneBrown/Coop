// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { TestBed } from '@angular/core/testing';

import { JsonContentService } from './json-content.service';

describe('JsonContentService', () => {
  let service: JsonContentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JsonContentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

