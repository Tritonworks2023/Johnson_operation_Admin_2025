import { Component, Inject, OnInit } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { ConfirmationService } from 'primeng/api';
import { ToastrManager } from 'ng6-toastr-notifications';
import { environment } from 'src/environments/environment';
import { ApiService } from 'src/app/api.service';
import { SESSION_STORAGE, StorageService } from 'ngx-webstorage-service';

@Component({
  selector: 'app-adho-access',
  templateUrl: './adho-access.component.html',
  styleUrls: ['./adho-access.component.css']
})
export class ADHOAccessComponent implements OnInit {
  rows: any[] = [];
  searchQR: any = '';

  isLoading = false;
  isSaving = false;
  isEditing = false;

  // Pagination
  totalRecords = 0;
  page = 1;
  limit = 15;
  rowsPerPageOptions = [5, 10, 15, 25, 50];

  // Form fields
  adhoId: any = '';
  branchId: any = '';
  fromDate: any = '';
  toDate: any = '';
  createdBy: any = '';
  updatedBy: any = '';
  branchList: any = [];
  userRole: any;
  userDetails: any;

  constructor(
    private toastr: ToastrManager,
    private api: ApiService,
    private confirmationService: ConfirmationService,
    @Inject(SESSION_STORAGE) private storage: StorageService,
  ) { }

  ngOnInit(): void {
    this.userRole = this.storage.get('user_typess');
    this.userDetails = this.storage.get('user_details');
    if (this.userRole == 'Admin') {
      this.getBranchList();
    } else {
      this.getBranchByuser();
    }
    this.listAdhoAccess();
  }

  getBranchList() {
    this.api.getBranchList().pipe(
      finalize(() => {
        // this.listpettype();
      })
    ).subscribe({
      next: (res: any) => {
        if (res.Status == "Success") {
          this.branchList = res.Data;
        }
      },
      error: (error: any) => { },
    });
  }

  getBranchByuser() {
    this.api.getBranchListByuserId().pipe(
      finalize(() => {
        // this.listpettype();
      })
    ).subscribe({
      next: (res: any) => {
        if (res.Status == "Success") {
          this.branchList = res.Data;
        }
      },
      error: (error: any) => { },
    });
  }

  // Convert API dates to YYYY-MM-DD for HTML date inputs
  private formatDate(value: any): string {
    if (!value) {
      return '';
    }

    const date = new Date(value);

    if (isNaN(date.getTime())) {
      return String(value).substring(0, 10);
    }

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  // LIST API - supports server-side pagination
  listAdhoAccess(event?: any): void {
    if (event) {
      this.page = Math.floor((event.first || 0) / (event.rows || this.limit));
      this.limit = event.rows || this.limit;
    }

    this.isLoading = true;
    this.api.listAdhoAccess(this.page, this.limit).pipe(
      finalize(() => {
        this.isLoading = false;
      })
    ).subscribe({
      next: (response: any) => {
        if (response && response.Code === 200) {
          const result = response.Data?.[0];

          this.rows = (result?.data || []).map((item: any) => ({
            ...item,
            fromDate: this.formatDate(item.fromDate),
            toDate: this.formatDate(item.toDate)
          }));

          this.totalRecords =
            Number(result?.pagination?.[0]?.totalCount) || 0;
        } else {
          this.rows = [];
          this.totalRecords = 0;
          this.showError(response?.Message || 'Unable to load ADHO records');
        }
      },
      error: (error: any) => {
        console.error('ADHO list API error:', error);
        this.rows = [];
        this.totalRecords = 0;
        this.showError(
          error?.error?.Message || 'Failed to load ADHO Access records'
        );
      }
    });
  }

  // CREATE API
  saveAdhoAccess(): void {
    if (!this.branchId || !this.fromDate || !this.toDate) {
      this.showWarning('Please enter Branch ID, From Date and To Date');
      return;
    }

    if (this.fromDate > this.toDate) {
      this.showWarning('From Date cannot be later than To Date');
      return;
    }

    if (this.isEditing) {
      this.updateAdhoAccess();
      return;
    }

    const payload: any = {
      branchId: String(this.branchId).trim(),
      fromDate: this.fromDate,
      toDate: this.toDate,
      createdBy: this.userDetails ? this.userDetails?.user_name : this.userRole
    };

    this.isSaving = true;
    this.api.saveAdhoAccess(payload).pipe(
      finalize(() => {
        this.isSaving = false;
      })
    ).subscribe({
      next: (response: any) => {
        if (response?.Code === 200 || response?.Status === 'Success') {
          this.showSuccess(response?.Message || 'ADHO Access created successfully');
          this.clearForm();
          this.page = 1;
          this.listAdhoAccess();
        } else {
          this.showError(response?.Message || 'Unable to create ADHO Access');
        }
      },
      error: (error: any) => {
        console.error('ADHO create API error:', error);
        this.showError(
          error?.error?.Message || 'Failed to create ADHO Access'
        );
      }
    });
  }

  // GET API - fetch a single record before editing
  getAdhoAccess(id: any): void {
    this.api.getAdhoAccessById(id).subscribe({
      next: (response: any) => {
        if (response?.Code === 200 && response?.Data) {
          let item: any = response.Data;

          // Support either a direct object or a wrapped response.
          if (Array.isArray(item)) {
            item = item[0];
          }

          if (item?.data && Array.isArray(item.data)) {
            item = item.data[0];
          }

          if (!item) {
            this.showWarning('ADHO Access record not found');
            return;
          }

          this.adhoId = item._id || id;
          this.branchId = item.branchId || '';
          this.fromDate = this.formatDate(item.fromDate);
          this.toDate = this.formatDate(item.toDate);
          this.createdBy = item.createdBy || '';
          this.updatedBy = item.updatedBy || '';

          this.isEditing = true;
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
          this.showError(response?.Message || 'Unable to fetch record');
        }
      },
      error: (error: any) => {
        console.error('ADHO get API error:', error);
        this.showError(
          error?.error?.Message || 'Failed to fetch ADHO Access record'
        );
      }
    });
  }

  // UPDATE API
  updateAdhoAccess(): void {
    if (!this.adhoId) {
      this.showWarning('Please select a record to update');
      return;
    }

    const payload: any = {
      branchId: String(this.branchId).trim(),
      fromDate: this.fromDate,
      toDate: this.toDate,
      updatedBy: this.userDetails ? this.userDetails?.user_name : this.userRole
    };

    this.isSaving = true;
    this.api.updateAdhoAccess(this.adhoId, payload).pipe(
      finalize(() => {
        this.isSaving = false;
      })
    ).subscribe({
      next: (response: any) => {
        if (response?.Code === 200 || response?.Status === 'Success') {
          this.showSuccess(response?.Message || 'ADHO Access updated successfully');
          this.clearForm();
          this.listAdhoAccess();
        } else {
          this.showError(response?.Message || 'Unable to update ADHO Access');
        }
      },
      error: (error: any) => {
        console.error('ADHO update API error:', error);
        this.showError(
          error?.error?.Message || 'Failed to update ADHO Access'
        );
      }
    });
  }

  // DELETE API
  deleteConfirm(id: any): void {
    if (!id) {
      this.showWarning('Invalid ADHO Access record');
      return;
    }

    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this ADHO Access record?',
      header: 'Confirm Delete',
      icon: 'pi pi-exclamation-triangle text-danger',
      acceptLabel: 'Delete',
      rejectLabel: 'Cancel',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.deleteAdhoAccess(id);
      }
    });
  }

  deleteAdhoAccess(id: any): void {
    this.api.deleteAdhoAccess(id).subscribe({
      next: (response: any) => {
        if (response?.Code === 200 || response?.Status === 'Success') {
          this.showSuccess(response?.Message || 'ADHO Access deleted successfully');

          // If the current page becomes empty, move back one page.
          if (this.rows.length === 1 && this.page > 1) {
            this.page--;
          }

          this.listAdhoAccess();
        } else {
          this.showError(response?.Message || 'Unable to delete ADHO Access');
        }
      },
      error: (error: any) => {
        console.error('ADHO delete API error:', error);
        this.showError(
          error?.error?.Message || 'Failed to delete ADHO Access'
        );
      }
    });
  }

  // REFRESH
  refersh(): void {
    this.page = 1;
    this.listAdhoAccess();
  }

  // CLEAR FORM
  clearForm(): void {
    this.adhoId = '';
    this.branchId = '';
    this.fromDate = '';
    this.toDate = '';
    this.createdBy = '';
    this.updatedBy = '';
    this.isEditing = false;
  }

  showSuccess(message: any): void {
    this.toastr.successToastr(message);
  }

  showError(message: any): void {
    this.toastr.errorToastr(message);
  }

  showWarning(message: any): void {
    this.toastr.warningToastr(message);
  }
}

