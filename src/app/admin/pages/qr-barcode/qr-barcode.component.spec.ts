import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QrBarcodeComponent } from './qr-barcode.component';

describe('QrBarcodeComponent', () => {
  let component: QrBarcodeComponent;
  let fixture: ComponentFixture<QrBarcodeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QrBarcodeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QrBarcodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
