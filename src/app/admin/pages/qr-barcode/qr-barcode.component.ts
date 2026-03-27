import { Component, OnInit } from '@angular/core';
import { ToastrManager } from 'ng6-toastr-notifications';
import { ConfirmationService } from 'primeng/api';
import { finalize } from 'rxjs/operators';
import { ApiService } from 'src/app/api.service';


@Component({
  selector: 'app-qr-barcode',
  templateUrl: './qr-barcode.component.html',
  styleUrls: ['./qr-barcode.component.css']
})
export class QrBarcodeComponent implements OnInit {
  isLoading: boolean = false;
  rows: any[] = [];
  selectedItems: any[] = [];
  searchData = '';
  dataKey = "MATL_ID"
  removedSearchData = '';
  isRemoveLoading: boolean = false;
  removedMaterials: any[] = [];

  constructor(private toastr: ToastrManager, private service: ApiService, private confirmationService: ConfirmationService) { }

  ngOnInit(): void {
  }

  getList() {
    this.isLoading = true;
    this.rows = [];
    const data = { job_id: this.searchData };
    this.service.materialByJobNo(data)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (response: any) => {
          this.rows = response?.Data || [];
        },
        error: (err) => {
          this.rows = [];
          this.toastr.errorToastr('Failed to load data');
        }
      });
  }

  onSubmit() {
    const data = {
      job_no: this.searchData,
      material_to_hide: this.selectedItems,
      created_by: 'Super Admin',
    }
    this.service.removeMaterial(data).subscribe({
      next: (response: any) => {
        this.toastr.successToastr('Material data removed successfully.');
        this.getList();  
      },
      error: (err) => {
        this.toastr.errorToastr('Failed to remove material data.');
      }
    });
  }

  getRemovedList() {
    this.isRemoveLoading = true;
    this.removedMaterials = [];
    const data = { job_no: this.removedSearchData };
    this.service.getRemovedMaterial(data)
      .pipe(finalize(() => this.isRemoveLoading = false))
      .subscribe({
        next: (response: any) => {
          this.removedMaterials = response?.Data || [];
        },
        error: (err) => {
          this.removedMaterials = [];
          this.toastr.errorToastr('Failed to get the removed Materials list.');
        }
      });
  }
}
