import { TestBed } from '@angular/core/testing';

import { JsonContentModelService } from './json-content-model.service';

describe('JsonContentModelService', () => {
  let service: JsonContentModelService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JsonContentModelService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
