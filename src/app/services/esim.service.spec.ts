import { TestBed } from '@angular/core/testing';

import { EsimService } from './esim.service';

describe('EsimService', () => {
  let service: EsimService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EsimService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
