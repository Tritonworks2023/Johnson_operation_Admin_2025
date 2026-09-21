import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { AbstractControl, FormBuilder, FormGroup, Validators, FormArray, FormControl, } from '@angular/forms';
import { Observable, interval, Subscription } from 'rxjs';
import { ToastrManager } from 'ng6-toastr-notifications';
import { Table } from "primeng/table";
import { ApiService } from 'src/app/api.service';
import { finalize } from 'rxjs/operators';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-branch',
  templateUrl: './branch.component.html',
  styleUrls: ['./branch.component.css']
})
export class BranchComponent implements OnInit {
  branchForm!: FormGroup;
  submitted: boolean = false;
  update_button: boolean = true;
  searchQR: any;
  rows = [];
  isLoading: boolean = false;

  constructor(private toastr: ToastrManager, private service: ApiService, private formBuilder: FormBuilder, private confirmationService: ConfirmationService) {
  }

  ngOnInit(): void {
    this.branchForm = this.formBuilder.group({
      _id: [''],
      branch_code: ['', Validators.required],
      branch_name: ['', Validators.required],
      branch_lat: ['', Validators.required],
      branch_long: ['', Validators.required],
      updated_at: new Date(),
    })
    this.getBranchList();
  }

  get f(): { [key: string]: AbstractControl } {
    return this.branchForm.controls;
  }

  keyPressAlphanumeric(event: any) {

    var inp = String.fromCharCode(event.keyCode);

    if (/[a-zA-Z0-9]/.test(inp)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }

  getBranchList() {
    this.isLoading = true;
    this.service.getBranch().pipe(
      finalize(() => {
        this.isLoading = false;
      })
    ).subscribe({
      next: (res: any) => {
        this.rows = res.Data;
      },
      error: (error: any) => { },
    });
  }

  addBranch() {
    this.submitted = true;
    if (this.branchForm.invalid) {
      return;
    }
    this.service.addBranch(this.branchForm.value).subscribe({
      next: (res: any) => {
        if (res['Status'] == 'Success') {
          this.submitted = false;
          this.showSuccess("Branch added successfully")
          this.branchForm.reset();
          this.getBranchList();
        }
      },
      error: (error: any) => {
        this.showError(error['Message'])
      },
    })
  }

  editBranch() {
    this.submitted = true;
    if (this.branchForm.invalid) {
      return;
    }
    this.service.editBranch(this.branchForm.value).subscribe({
      next: (res: any) => {
        this.submitted = false;
        this.update_button = true;
        this.showSuccess(res['Message'])
        this.branchForm.reset();
        this.getBranchList();
      },
      error: (error: any) => {
        this.showError(error['Message'])
      },
    })
  }

  deleteBranch(item: any) {
    const data = {
      _id: item?._id,
    }
    this.service.deleteBranch(data).subscribe(
      (response: any) => {
        this.showSuccess("Deleted Successfully")
        this.getBranchList();
      }
    );
  }

  cancel() {
    this.submitted = false;
    this.update_button = true;
    this.branchForm.reset();
  }

  showSuccess(msg: any) {
    this.toastr.successToastr(msg);
  }

  showError(msg: any) {
    this.toastr.errorToastr(msg);
  }

  showWarning(msg: any) {
    this.toastr.warningToastr(msg);
  }

  edit(item: any) {
    this.confirmationService.confirm({
      message: `Are you sure you want to edit this branch (${item?.branch_name} - ${item?.branch_code})?`,
      header: 'Confirm Edit',
      icon: 'pi pi-pencil text-primary',
      acceptLabel: 'Edit',
      rejectLabel: 'Cancel',
      acceptButtonStyleClass: 'p-button-primary',
      accept: () => {
        this.update_button = false;
        this.branchForm.patchValue({
          _id: item._id,
          branch_code: item?.branch_code,
          branch_name: item?.branch_name,
          branch_lat: item?.branch_lat,
          branch_long: item?.branch_long,
        })
      }
    });

  }

  deleteConfirm(item: any) {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete this branch (${item?.branch_name} - ${item?.branch_code})?`,
      header: 'Confirm Delete',
      icon: 'pi pi-exclamation-triangle text-danger',
      acceptLabel: 'Delete',
      rejectLabel: 'Cancel',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.deleteBranch(item)
      }
    });
  }
}