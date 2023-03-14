// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { TestBed } from '@angular/core/testing';

import { HtmlContentService } from './html-content.service';

describe('HtmlContentService', () => {
  let service: HtmlContentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HtmlContentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

