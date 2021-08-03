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
