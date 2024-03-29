// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { TestBed } from '@angular/core/testing';

import { DigitalAssetService } from './digital-asset.service';

describe('DigitalAssetService', () => {
  let service: DigitalAssetService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DigitalAssetService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

