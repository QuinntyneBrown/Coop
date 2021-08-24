import { TestBed } from '@angular/core/testing';

import { JsonContentTypeService } from './json-content-type.service';

describe('JsonContentTypeService', () => {
  let service: JsonContentTypeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JsonContentTypeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
