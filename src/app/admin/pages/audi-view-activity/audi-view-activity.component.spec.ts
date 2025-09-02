import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AudiViewActivityComponent } from './audi-view-activity.component';

describe('AudiViewActivityComponent', () => {
  let component: AudiViewActivityComponent;
  let fixture: ComponentFixture<AudiViewActivityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AudiViewActivityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AudiViewActivityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
