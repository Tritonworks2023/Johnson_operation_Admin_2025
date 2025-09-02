import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LiftwellresubmitComponent } from './liftwellresubmit.component';

describe('LiftwellresubmitComponent', () => {
  let component: LiftwellresubmitComponent;
  let fixture: ComponentFixture<LiftwellresubmitComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LiftwellresubmitComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LiftwellresubmitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
