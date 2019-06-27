import { TestBed, inject } from '@angular/core/testing';

import { ConstantService } from './constant.service';

describe('ConstantService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ConstantService]
    });
  });

  it('should ...', inject([ConstantService], (service: ConstantService) => {
    expect(service).toBeTruthy();
  }));
});
