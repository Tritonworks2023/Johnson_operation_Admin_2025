import { Component, Inject, OnInit } from "@angular/core";
import { ApiService } from "src/app/api.service";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { Router } from "@angular/router";
import { ToastrManager } from "ng6-toastr-notifications";
import { DatePipe } from "@angular/common";
import { ExcelService } from "src/app/excel.service";
import { SESSION_STORAGE, StorageService } from "ngx-webstorage-service";
import { finalize } from 'rxjs/operators';

@Component({
  selector: "app-time-sheet",
  templateUrl: "./time-sheet.component.html",
  styleUrls: ["./time-sheet.component.css"],
})
export class TimeSheetComponent implements OnInit {
  apiUrl = environment.apiUrl;
  searchQR: any;
  rows = [];
  userType: any;
  S_Date: any;
  E_Date: any;
  isLoading: boolean = false;
  branchList: any[] = [];
  job_location: any = "";
  selectedBranch: string = '';
  constructor(
    private _api: ApiService,
    private router: Router,
    private toastr: ToastrManager,
    private datePipe: DatePipe,
    private excelService: ExcelService,
    @Inject(SESSION_STORAGE) private storage: StorageService
  ) {}
  user_list = [];
  activity_list = [];
  ngOnInit(): void {
    this.userType = this.storage.get("user_typess");
    this.getBranchList();
  }

  filter_date() {
    if (this.E_Date != undefined && this.S_Date != undefined) {
      // let yourDate = new Date(this.E_Date.getTime() + (1000 * 60 * 60 * 24));
      let yourDate = this.E_Date.setDate(this.E_Date.getDate() + 1);
      this.isLoading = true;
      this.rows = [];

      let a = {
        fromdate: this.datePipe.transform(new Date(this.S_Date), "yyyy-MM-dd"),
        todate: this.datePipe.transform(new Date(this.E_Date), "yyyy-MM-dd"),
      };
      console.log(a);
      this._api.jobdetail_filter_date(a).pipe(
        finalize(()=>{
          this.isLoading = false;
        })
      ).subscribe((response: any) => {
        console.log(response.Data);
        this.rows = response.Data;
      });
    } else {
      this.showWarning("Please select the startdate and enddate");
      //alert('Please select the startdate and enddate');
    }
  }

  list_data() {
    if (
      this.E_Date != undefined &&
      this.S_Date != undefined &&
      this.S_Date <= this.E_Date
    ) {
      this.isLoading = true;
      this.rows = [];
      let a = {
        from_date: this.datePipe.transform(new Date(this.S_Date), "yyyy-MM-dd"),
        to_date: this.datePipe.transform(new Date(this.E_Date), "yyyy-MM-dd"),
        brno: this.job_location || "TN01",
      };
      this._api.time_sheet(a).pipe(
        finalize(()=>{
          this.isLoading = false;
        })
      ).subscribe((response: any) => {
        console.log("response.Data");
        console.log(response.Data);
        this.rows = response.Data;
      });
    } else {
      this.toastr.warningToastr("Please provide a valid date.");
    }
  }

  showSuccess(msg) {
    this.toastr.successToastr(msg);
  }

  showError(msg) {
    this.toastr.errorToastr(msg);
  }

  showWarning(msg) {
    this.toastr.warningToastr(msg);
  }
  excelDownload() {
    const excelData = [];
    const value = this.rows;
    console.log(value);
    value.map((d) => {
      excelData.push({
        "Branch Code": d.JLS_EWD_BRCODE,
        "EMP No": d.JLS_EWD_EMPNO,
        "work Date": d.JLS_EWD_WKDATE,
        "Job No": d.JLS_EWD_JOBNO,
        "Activity": d.JLS_EWD_ACTIVITY,
        "Work Hours": d.JLS_EWD_WRKHOUR,
        "Submitted By": d.JLS_EWD_PREPBY,
        "Submitted Date": d.JLS_EWD_CREATEDDATE,
        "Approved Date": d.APPROVED_DATE
      });
    });
    this.excelService.exportAsExcelFile(excelData, "User Details");
  }

  move_to_next(data) {
    console.log(data);
    this.router.navigate(["/admin/singledataentry_detail/" + data._id]);
  }

  Deletecompanydetails(data) {
    let a = {
      _id: data,
    };
    console.log(a);
    this._api.entry_detail_delete(a).subscribe((response: any) => {
      console.log(response.Data);
      //alert('Deleted Successfully');
      this.showSuccess("Deleted Successfully");
      this.ngOnInit();
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

  /** BRANCH CHANGE EVENT */
onBranchChange() {
  console.log('Selected Branch:', this.selectedBranch);
  this.list_data();
}

  
}
