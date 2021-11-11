import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkspacePanelComponent } from './workspace-panel.component';

describe('WorkspacePanelComponent', () => {
  let component: WorkspacePanelComponent;
  let fixture: ComponentFixture<WorkspacePanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkspacePanelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkspacePanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
