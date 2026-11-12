import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ADHOAccessComponent } from './adho-access.component';

describe('ADHOAccessComponent', () => {
  let component: ADHOAccessComponent;
  let fixture: ComponentFixture<ADHOAccessComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ADHOAccessComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ADHOAccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
