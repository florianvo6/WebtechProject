import { TestBed } from '@angular/core/testing';

import { MarketitemService } from './marketitem.service';

describe('MarketitemService', () => {
  let service: MarketitemService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MarketitemService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
