import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoardMemberListComponent } from './board-member-list.component';

describe('BoardMemberListComponent', () => {
  let component: BoardMemberListComponent;
  let fixture: ComponentFixture<BoardMemberListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BoardMemberListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BoardMemberListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
