// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { TestBed } from '@angular/core/testing';

import { InvitationTokenService } from './invitation-token.service';

describe('InvitationTokenService', () => {
  let service: InvitationTokenService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InvitationTokenService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

