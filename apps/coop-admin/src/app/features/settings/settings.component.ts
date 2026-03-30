import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { ThemeService } from '../../core/services/theme.service';
import { TopbarComponent } from '../../layout/topbar.component';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TopbarComponent],
  template: `
    <app-topbar title="Settings"></app-topbar>
    <div class="settings-page">
      <div class="tabs">
        <button class="tab" [class.active]="activeTab === 'theme'" (click)="activeTab = 'theme'">Theme</button>
        <button class="tab" [class.active]="activeTab === 'content'" (click)="activeTab = 'content'">Content</button>
        <button class="tab" [class.active]="activeTab === 'account'" (click)="activeTab = 'account'">Account</button>
      </div>

      <!-- Theme Tab -->
      <div *ngIf="activeTab === 'theme'" class="tab-content">
        <div class="theme-layout">
          <div class="theme-form card">
            <h3>Theme Customization</h3>
            <form [formGroup]="themeForm">
              <div class="color-group">
                <label>Primary Color</label>
                <div class="color-input">
                  <input type="color" formControlName="primaryColor" />
                  <input type="text" formControlName="primaryColor" />
                </div>
              </div>
              <div class="color-group">
                <label>Background Color</label>
                <div class="color-input">
                  <input type="color" formControlName="backgroundColor" />
                  <input type="text" formControlName="backgroundColor" />
                </div>
              </div>
              <div class="color-group">
                <label>Accent Color</label>
                <div class="color-input">
                  <input type="color" formControlName="accentColor" />
                  <input type="text" formControlName="accentColor" />
                </div>
              </div>
              <div class="color-group">
                <label>Text Color</label>
                <div class="color-input">
                  <input type="color" formControlName="textColor" />
                  <input type="text" formControlName="textColor" />
                </div>
              </div>
            </form>
            <div class="theme-actions">
              <a class="reset-link" (click)="resetTheme()">Reset to Default</a>
              <button class="btn btn-primary" (click)="saveTheme()">Save Theme</button>
            </div>
          </div>

          <div class="theme-preview card">
            <h3>Preview</h3>
            <div class="preview-content" [style.background]="themeForm.value.backgroundColor">
              <div class="preview-header" [style.background]="themeForm.value.primaryColor">
                <span style="color: #fff; font-weight: 600;">Coop Manager</span>
              </div>
              <div class="preview-card" style="background: #fff; padding: 16px; border-radius: 10px; margin: 12px;">
                <span [style.color]="themeForm.value.textColor">Sample content</span>
                <button [style.background]="themeForm.value.accentColor"
                  style="color: #fff; border: none; padding: 6px 12px; border-radius: 6px; margin-top: 8px; display: block;">
                  Button
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Content Tab -->
      <div *ngIf="activeTab === 'content'" class="tab-content">
        <div class="card" style="padding: 24px;">
          <h3>Content Management</h3>
          <p style="color: #1A1918CC; margin-top: 8px;">Manage your cooperative's content and CMS settings.</p>
        </div>
      </div>

      <!-- Account Tab -->
      <div *ngIf="activeTab === 'account'" class="tab-content">
        <div class="card" style="padding: 24px;">
          <h3>Account Settings</h3>
          <p style="color: #1A1918CC; margin-top: 8px;">Manage your account preferences and security settings.</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .settings-page { padding: 24px; }
    .tabs { display: flex; gap: 4px; margin-bottom: 20px; }
    .tab {
      padding: 8px 20px; border: 1px solid #E5E4E1; border-radius: 10px;
      background: #fff; font-size: 14px; cursor: pointer;
      &.active { background: #3D8A5A; color: #fff; border-color: #3D8A5A; }
    }
    .tab-content { }
    .theme-layout { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
    .theme-form { padding: 24px; h3 { margin-bottom: 20px; font-size: 16px; } }
    .color-group { margin-bottom: 16px;
      label { display: block; margin-bottom: 6px; font-size: 14px; font-weight: 500; }
    }
    .color-input { display: flex; gap: 8px;
      input[type="color"] { width: 40px; height: 40px; border: 1px solid #E5E4E1; border-radius: 8px; cursor: pointer; padding: 2px; }
      input[type="text"] { flex: 1; padding: 8px 12px; border: 1px solid #E5E4E1; border-radius: 8px; font-size: 14px; font-family: monospace; }
    }
    .theme-actions { display: flex; justify-content: space-between; align-items: center; margin-top: 24px; }
    .reset-link { color: #3D8A5A; cursor: pointer; font-size: 14px; }
    .theme-preview { padding: 24px; h3 { margin-bottom: 16px; font-size: 16px; } }
    .preview-content { border-radius: 10px; overflow: hidden; border: 1px solid #E5E4E1; }
    .preview-header { padding: 12px 16px; }
    @media (max-width: 768px) {
      .theme-layout { grid-template-columns: 1fr; }
    }
  `]
})
export class SettingsComponent implements OnInit {
  private themeService = inject(ThemeService);
  private fb = inject(FormBuilder);

  activeTab = 'theme';
  themeForm: FormGroup = this.fb.group({
    primaryColor: ['#3D8A5A'],
    backgroundColor: ['#F5F4F1'],
    accentColor: ['#3D8A5A'],
    textColor: ['#1A1918']
  });

  ngOnInit(): void {
    this.themeService.getDefaultTheme().subscribe({
      next: (data: any) => {
        if (data) {
          this.themeForm.patchValue({
            primaryColor: data.primaryColor || '#3D8A5A',
            backgroundColor: data.backgroundColor || '#F5F4F1',
            accentColor: data.accentColor || '#3D8A5A',
            textColor: data.textColor || '#1A1918'
          });
        }
      },
      error: () => {}
    });
  }

  saveTheme(): void {
    this.themeService.updateTheme(this.themeForm.value).subscribe({ error: () => {} });
  }

  resetTheme(): void {
    this.themeForm.patchValue({
      primaryColor: '#3D8A5A',
      backgroundColor: '#F5F4F1',
      accentColor: '#3D8A5A',
      textColor: '#1A1918'
    });
  }
}
