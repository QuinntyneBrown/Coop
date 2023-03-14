// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { TestBed } from '@angular/core/testing';

import { ImageContentService } from './image-content.service';

describe('ImageContentService', () => {
  let service: ImageContentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ImageContentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

