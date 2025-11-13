import { TestBed } from '@angular/core/testing';

import { MobilePostService } from './mobile-post';

describe('MobilePostService', () => {
  let service: MobilePostService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MobilePostService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
