import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrgUnitComponent } from './org-unit.component';

describe('OrgUnitComponent', () => {
  let component: OrgUnitComponent;
  let fixture: ComponentFixture<OrgUnitComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrgUnitComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrgUnitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
