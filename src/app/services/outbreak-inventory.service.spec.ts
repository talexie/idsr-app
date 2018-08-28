import { TestBed, inject } from '@angular/core/testing';

import { OutbreakInventoryService } from './outbreak-inventory.service';

describe('OutbreakInventoryService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OutbreakInventoryService]
    });
  });

  it('should ...', inject([OutbreakInventoryService], (service: OutbreakInventoryService) => {
    expect(service).toBeTruthy();
  }));
});
