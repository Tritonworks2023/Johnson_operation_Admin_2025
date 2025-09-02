import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JointinspectPdfComponent } from './jointinspect-pdf.component';

describe('JointinspectPdfComponent', () => {
  let component: JointinspectPdfComponent;
  let fixture: ComponentFixture<JointinspectPdfComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JointinspectPdfComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JointinspectPdfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
