import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { PreviewService } from './preview.service';

/** The reads a preview token applies to (L2-REQ-125 AC2, AC3). */
const PREVIEW_PATHS = /\/api\/(site-content|pages)(\/|$)/;

/** Adds the preview token to the site content and page reads while preview mode is active (ADR 0019). */
export const previewInterceptor: HttpInterceptorFn = (request, next) => {
  const preview = inject(PreviewService);
  if (!preview.active || request.method !== 'GET' || !PREVIEW_PATHS.test(request.url)) {
    return next(request);
  }
  return next(request.clone({ setParams: { preview: preview.token! } }));
};
