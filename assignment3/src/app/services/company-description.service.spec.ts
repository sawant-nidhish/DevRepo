import { TestBed } from '@angular/core/testing';

import { CompanyDescriptionService } from './company-description.service';

describe('CompanyDescriptionService', () => {
  let service: CompanyDescriptionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CompanyDescriptionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
