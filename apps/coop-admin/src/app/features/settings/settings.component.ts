import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { ThemeService } from '../../core/services/theme.service';
import { TopbarComponent } from '../../layout/topbar.component';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TopbarComponent],
  template: `
    <app-topbar title="Settings"></app-topbar>
    <div class="settings-page">
      <div *ngIf="successMsg" class="alert alert-success" data-testid="settings-success-message">{{ successMsg }}</div>
      <div *ngIf="errorMsg" class="alert alert-danger" data-testid="settings-error-message">{{ errorMsg }}</div>

      <div class="tabs">
        <button class="tab" [class.active]="activeTab === 'theme'" data-testid="settings-tab-theme" [attr.data-active]="activeTab === 'theme' ? 'true' : 'false'" (click)="activeTab = 'theme'">Theme</button>
        <button class="tab" [class.active]="activeTab === 'content'" data-testid="settings-tab-content" [attr.data-active]="activeTab === 'content' ? 'true' : 'false'" (click)="activeTab = 'content'">Content</button>
        <button class="tab" [class.active]="activeTab === 'account'" data-testid="settings-tab-account" [attr.data-active]="activeTab === 'account' ? 'true' : 'false'" (click)="activeTab = 'account'">Account</button>
      </div>

      <!-- Theme Tab -->
      <div *ngIf="activeTab === 'theme'" class="tab-content">
        <div class="theme-layout">
          <div class="theme-form card">
            <h3 data-testid="theme-heading">Theme Customization</h3>
            <p class="theme-subtitle" data-testid="theme-subtitle">Customize your app appearance using CSS custom properties</p>

            <div class="scope-group">
              <label>Scope</label>
              <select data-testid="theme-scope-select" [formControl]="scopeControl">
                <option value="Global">Global</option>
                <option value="Default">Default</option>
              </select>
            </div>

            <form [formGroup]="themeForm">
              <div class="color-group">
                <label>Primary Color</label>
                <div class="color-input">
                  <div class="color-swatch" data-testid="theme-primary-swatch" [style.background]="themeForm.value.primaryColor"></div>
                  <input type="text" formControlName="primaryColor" data-testid="theme-primary-color" />
                </div>
              </div>
              <div class="color-group">
                <label>Background Color</label>
                <div class="color-input">
                  <div class="color-swatch" data-testid="theme-background-swatch" [style.background]="themeForm.value.backgroundColor"></div>
                  <input type="text" formControlName="backgroundColor" data-testid="theme-background-color" />
                </div>
              </div>
              <div class="color-group">
                <label>Accent Color</label>
                <div class="color-input">
                  <div class="color-swatch" data-testid="theme-accent-swatch" [style.background]="themeForm.value.accentColor"></div>
                  <input type="text" formControlName="accentColor" data-testid="theme-accent-color" />
                </div>
              </div>
              <div class="color-group">
                <label>Text Color</label>
                <div class="color-input">
                  <div class="color-swatch" data-testid="theme-text-swatch" [style.background]="themeForm.value.textColor"></div>
                  <input type="text" formControlName="textColor" data-testid="theme-text-color" />
                </div>
              </div>
            </form>
            <div class="theme-actions">
              <a class="reset-link" data-testid="theme-reset-default" (click)="resetTheme()">Reset to Default</a>
              <button class="btn btn-primary" data-testid="theme-save-button" (click)="saveTheme()">Save Theme</button>
            </div>
          </div>

          <div class="theme-preview card" data-testid="theme-preview">
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
    .theme-form { padding: 24px; h3 { margin-bottom: 8px; font-size: 16px; } }
    .theme-subtitle { font-size: 14px; color: #1A1918CC; margin-bottom: 20px; }
    .scope-group { margin-bottom: 16px;
      label { display: block; margin-bottom: 6px; font-size: 14px; font-weight: 500; }
      select { width: 100%; padding: 10px 14px; border: 1px solid #E5E4E1; border-radius: 8px; font-size: 14px; }
    }
    .color-swatch { width: 40px; height: 40px; border-radius: 8px; border: 1px solid #E5E4E1; flex-shrink: 0; }
    .alert-success { background: rgba(16,185,129,0.1); color: #059669; padding: 10px 14px; border-radius: 8px; font-size: 14px; margin-bottom: 16px; }
    .alert-danger { background: rgba(220,53,69,0.1); color: #DC3545; padding: 10px 14px; border-radius: 8px; font-size: 14px; margin-bottom: 16px; }
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
  successMsg = '';
  errorMsg = '';
  scopeControl = new FormControl('Global');
  themeForm: FormGroup = this.fb.group({
    primaryColor: ['#3D8A5A'],
    backgroundColor: ['#F5F4F1'],
    accentColor: ['#3D8A5A'],
    textColor: ['#1A1918']
  });

  private themeId: string | null = null;

  ngOnInit(): void {
    this.themeService.getDefaultTheme().subscribe({
      next: (response: any) => {
        const data = response?.theme ?? response;
        if (data) {
          if (data.themeId) { this.themeId = data.themeId; }
          const colors = this.parseCssProperties(data.cssCustomProperties || '');
          this.themeForm.patchValue({
            primaryColor: colors['--primary-color'] || '#3D8A5A',
            backgroundColor: colors['--background-color'] || '#F5F4F1',
            accentColor: colors['--accent-color'] || '#3D8A5A',
            textColor: colors['--text-color'] || '#1A1918'
          });
        }
      },
      error: () => {}
    });
  }

  private parseCssProperties(css: string): Record<string, string> {
    const result: Record<string, string> = {};
    if (!css) return result;
    css.split(';').forEach(prop => {
      const [key, val] = prop.split(':').map(s => s.trim());
      if (key && val) result[key] = val;
    });
    return result;
  }

  private buildCssProperties(): string {
    const v = this.themeForm.value;
    return `--primary-color: ${v.primaryColor}; --background-color: ${v.backgroundColor}; --accent-color: ${v.accentColor}; --text-color: ${v.textColor}`;
  }

  saveTheme(): void {
    this.successMsg = '';
    this.errorMsg = '';
    const cssCustomProperties = this.buildCssProperties();
    const themeData = { themeId: this.themeId, cssCustomProperties, isDefault: true };
    const save$ = this.themeId
      ? this.themeService.updateTheme(themeData)
      : this.themeService.createTheme({ cssCustomProperties, isDefault: true });
    save$.subscribe({
      next: (response: any) => {
        this.successMsg = 'Theme saved successfully';
        const theme = response?.theme ?? response;
        if (theme?.themeId) { this.themeId = theme.themeId; }
      },
      error: () => {
        // If update failed, try create
        this.themeService.createTheme({ cssCustomProperties, isDefault: true }).subscribe({
          next: (response: any) => {
            this.successMsg = 'Theme saved successfully';
            const theme = response?.theme ?? response;
            if (theme?.themeId) { this.themeId = theme.themeId; }
          },
          error: () => { this.errorMsg = 'Failed to save theme'; }
        });
      }
    });
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
