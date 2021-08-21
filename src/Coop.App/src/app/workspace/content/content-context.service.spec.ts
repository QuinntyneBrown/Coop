import { TestBed } from '@angular/core/testing';

import { ContentContextService } from './content-context.service';

describe('ContentContextService', () => {
  let service: ContentContextService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ContentContextService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
