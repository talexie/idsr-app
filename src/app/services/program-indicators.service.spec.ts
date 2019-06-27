import { TestBed, inject } from '@angular/core/testing';

import { ProgramIndicatorsService } from './program-indicators.service';

describe('ProgramIndicatorsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProgramIndicatorsService]
    });
  });

  it('should ...', inject([ProgramIndicatorsService], (service: ProgramIndicatorsService) => {
    expect(service).toBeTruthy();
  }));
});
