import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ErrologListComponent } from './errolog-list.component';

describe('ErrologListComponent', () => {
  let component: ErrologListComponent;
  let fixture: ComponentFixture<ErrologListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ErrologListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ErrologListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
