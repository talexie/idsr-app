import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppNoContentComponent } from './app-no-content.component';

describe('AppNoContentComponent', () => {
  let component: AppNoContentComponent;
  let fixture: ComponentFixture<AppNoContentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppNoContentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppNoContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
