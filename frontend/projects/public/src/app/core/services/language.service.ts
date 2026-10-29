import { DOCUMENT, Injectable, computed, effect, inject, signal } from '@angular/core';
import type { SiteLanguage } from '../language/site-language';
import { UI_TEXT } from '../language/ui-text';

const STORAGE_KEY = 'coop.language';

/**
 * The visitor's language (L2-REQ-131): `?lang=` when the address has it, else
 * the choice remembered on this device, else English. The choice is kept in
 * the browser's storage when it can be, and `<html lang>` follows it.
 */
@Injectable({ providedIn: 'root' })
export class LanguageService {
  private readonly document = inject(DOCUMENT);
  private readonly state = signal<SiteLanguage>(initialLanguage());

  readonly language = this.state.asReadonly();
  /** The fixed labels in the visitor's language. */
  readonly labels = computed(() => UI_TEXT[this.state()]);
  /** The language the language button offers. */
  readonly other = computed<SiteLanguage>(() => (this.state() === 'en' ? 'fr' : 'en'));

  constructor() {
    remember(this.state());
    effect(() => {
      this.document.documentElement.lang = this.state();
    });
  }

  toggle(): void {
    this.state.set(this.other());
    remember(this.state());
  }
}

function initialLanguage(): SiteLanguage {
  const asked = new URLSearchParams(window.location.search).get('lang');
  if (asked === 'en' || asked === 'fr') return asked;
  try {
    return localStorage.getItem(STORAGE_KEY) === 'fr' ? 'fr' : 'en';
  } catch {
    return 'en';
  }
}

function remember(language: SiteLanguage): void {
  try {
    localStorage.setItem(STORAGE_KEY, language);
  } catch {
    // The browser cannot keep the choice; the site still switches for this visit.
  }
}
