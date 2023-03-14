// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { TestBed } from '@angular/core/testing';

import { ContentContextService } from './content-context.service';

describe('ContentContextService', () => {
  let service: ContentContextService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ContentContextService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

