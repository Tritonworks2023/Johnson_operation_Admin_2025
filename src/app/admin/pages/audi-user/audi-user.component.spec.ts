import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AudiUserComponent } from './audi-user.component';

describe('AudiUserComponent', () => {
  let component: AudiUserComponent;
  let fixture: ComponentFixture<AudiUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AudiUserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AudiUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
