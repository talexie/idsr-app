import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OutbreakInventoryComponent } from './outbreak-inventory.component';

describe('OutbreakInventoryComponent', () => {
  let component: OutbreakInventoryComponent;
  let fixture: ComponentFixture<OutbreakInventoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OutbreakInventoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OutbreakInventoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
