import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoardMemberComponent } from './board-member.component';

describe('BoardMemberComponent', () => {
  let component: BoardMemberComponent;
  let fixture: ComponentFixture<BoardMemberComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BoardMemberComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BoardMemberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
