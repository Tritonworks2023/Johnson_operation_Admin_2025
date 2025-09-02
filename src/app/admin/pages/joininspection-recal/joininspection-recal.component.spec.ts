import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JoininspectionRecalComponent } from './joininspection-recal.component';

describe('JoininspectionRecalComponent', () => {
  let component: JoininspectionRecalComponent;
  let fixture: ComponentFixture<JoininspectionRecalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JoininspectionRecalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JoininspectionRecalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
