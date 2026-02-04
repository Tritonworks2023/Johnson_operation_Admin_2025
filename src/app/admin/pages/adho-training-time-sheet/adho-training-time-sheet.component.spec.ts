import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdhoTrainingTimeSheetComponent } from './adho-training-time-sheet.component';

describe('AdhoTrainingTimeSheetComponent', () => {
  let component: AdhoTrainingTimeSheetComponent;
  let fixture: ComponentFixture<AdhoTrainingTimeSheetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdhoTrainingTimeSheetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdhoTrainingTimeSheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
