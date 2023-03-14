// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { TestBed } from '@angular/core/testing';

import { BoardMemberService } from './board-member.service';

describe('BoardMemberService', () => {
  let service: BoardMemberService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BoardMemberService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

