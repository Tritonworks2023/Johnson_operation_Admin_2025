import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ErrologDetailComponent } from './errolog-detail.component';

describe('ErrologDetailComponent', () => {
  let component: ErrologDetailComponent;
  let fixture: ComponentFixture<ErrologDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ErrologDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ErrologDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
