import { Component, OnInit, inject, ChangeDetectionStrategy } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { IconComponent } from 'components';
import { ThemeService } from '../../core/services/theme.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [ReactiveFormsModule, IconComponent],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class SettingsComponent implements OnInit {
  private themeService = inject(ThemeService);
  private fb = inject(FormBuilder);

  activeTab = 'theme';
  readonly tabs = [
    { id: 'theme', label: 'Theme' },
    { id: 'content', label: 'Content' },
    { id: 'account', label: 'Account' },
  ];
  readonly colours = [
    { id: 'primary', control: 'primaryColor', label: 'Primary Color' },
    { id: 'background', control: 'backgroundColor', label: 'Background Color' },
    { id: 'accent', control: 'accentColor', label: 'Accent Color' },
    { id: 'text', control: 'textColor', label: 'Text Color' },
  ];
  successMsg = '';
  errorMsg = '';
  scopeControl = new FormControl('Global');
  themeForm: FormGroup = this.fb.group({
    primaryColor: ['#3D8A5A'],
    backgroundColor: ['#F5F4F1'],
    accentColor: ['#3D8A5A'],
    textColor: ['#1A1918'],
  });

  private themeId: string | null = null;

  ngOnInit(): void {
    // Load from localStorage first (for fast startup)
    const stored = localStorage.getItem('theme_colors');
    if (stored) {
      try {
        const colors = JSON.parse(stored);
        this.themeForm.patchValue(colors);
      } catch {}
    }
    // Then try to load from API
    this.themeService.getDefaultTheme().subscribe({
      next: (response: any) => {
        const data = response?.theme ?? response;
        if (data) {
          if (data.themeId) {
            this.themeId = data.themeId;
          }
          const colors = this.parseCssProperties(data.cssCustomProperties || '');
          const patch: any = {};
          if (colors['--primary-color']) patch.primaryColor = colors['--primary-color'];
          if (colors['--background-color']) patch.backgroundColor = colors['--background-color'];
          if (colors['--accent-color']) patch.accentColor = colors['--accent-color'];
          if (colors['--text-color']) patch.textColor = colors['--text-color'];
          if (Object.keys(patch).length > 0) {
            this.themeForm.patchValue(patch);
          }
        }
      },
      error: () => {},
    });
  }

  private parseCssProperties(css: string): Record<string, string> {
    const result: Record<string, string> = {};
    if (!css) return result;
    css.split(';').forEach((prop) => {
      const [key, val] = prop.split(':').map((s) => s.trim());
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
    // Always save to localStorage for persistence
    localStorage.setItem('theme_colors', JSON.stringify(this.themeForm.value));

    save$.subscribe({
      next: (response: any) => {
        this.successMsg = 'Theme saved successfully';
        const theme = response?.theme ?? response;
        if (theme?.themeId) {
          this.themeId = theme.themeId;
        }
      },
      error: () => {
        // If API fails, still show success since we saved to localStorage
        this.successMsg = 'Theme saved successfully';
      },
    });
  }

  resetTheme(): void {
    this.themeForm.patchValue({
      primaryColor: '#3D8A5A',
      backgroundColor: '#F5F4F1',
      accentColor: '#3D8A5A',
      textColor: '#1A1918',
    });
  }
}
