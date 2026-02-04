import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { ToastrManager } from 'ng6-toastr-notifications';
import { SESSION_STORAGE, StorageService } from 'ngx-webstorage-service';
import { ConfirmationService } from 'primeng';
import { finalize } from 'rxjs/operators';
import { ApiService } from 'src/app/api.service';

@Component({
  selector: 'app-adho-training-time-sheet',
  templateUrl: './adho-training-time-sheet.component.html',
  styleUrls: ['./adho-training-time-sheet.component.css']
})
export class AdhoTrainingTimeSheetComponent implements OnInit {

  searchQR: any;
  rows = [];
  isLoading:boolean = false;
  branchList: any = [];
  startDate: any = new Date();
  endDate: any = new Date();
  branchCode: any = "MH04";

  constructor( private _api: ApiService, private toastr: ToastrManager, @Inject(SESSION_STORAGE) private storage: StorageService, private datePipe: DatePipe, private confirmationService: ConfirmationService ) {}

  ngOnInit(): void {
    this.getBranchList();
    this.getAdhoTrainingTimeSheet()
  }

  getAdhoTrainingTimeSheet(){
    this.isLoading = true;
    const data = {
      from_date: this.datePipe.transform(new Date(this.startDate), "yyyy-MM-dd"),
      to_date: this.datePipe.transform(new Date(this.endDate), "yyyy-MM-dd"),
      brno: this.branchCode,
      activity:["ADHO","Training"]
    };
    this._api.time_sheet(data).pipe(
      finalize(()=>{
        this.isLoading = false;
      })
    ).subscribe({
      next: (res: any) => {
        if (res.Status == "Success") {
          this.rows = res?.Data;
        }
      },
      error: (error: any) => {},
    });
  }

  getBranchList() {
    this._api.getBranchList().subscribe({
      next: (res: any) => {
        if (res.Status == "Success") {
          this.branchList = res.Data;
        }
      },
      error: (error: any) => {},
    });
  }

  confirmApprove(item: any) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to approve this?',
      header: 'Confirm Approval',
      icon: 'pi pi-check-circle',
      acceptLabel: 'Yes',
      rejectLabel: 'No',
      accept: () => {
        // approve logic here
        console.log('Approved', item);
      },
      reject: () => {
        console.log('Rejected');
      }
    });
  }

  confirmReject(item: any) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to reject this?',
      header: 'Confirm Rejection',
      icon: 'pi pi-times-circle',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        // reject logic
      }
    });
  }

  updateStatus() {
    this._api.getBranchList().subscribe({
      next: (res: any) => {
        if (res.Status == "Success") {
          this.branchList = res.Data;
        }
      },
      error: (error: any) => {},
    });
  }


}
