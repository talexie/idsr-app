import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrgUnitLimitedComponent } from './org-unit-limited.component';

describe('OrgUnitLimitedComponent', () => {
  let component: OrgUnitLimitedComponent;
  let fixture: ComponentFixture<OrgUnitLimitedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrgUnitLimitedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrgUnitLimitedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
