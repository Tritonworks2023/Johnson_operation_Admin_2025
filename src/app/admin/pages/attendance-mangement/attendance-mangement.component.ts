import {
  Component,
  OnInit,
  Inject,
  ViewChild,
  AfterViewInit,
  ElementRef,
} from "@angular/core";
import { Router } from "@angular/router";
import { ApiService } from "../../../api.service";
import { HttpClient, HttpRequest } from "@angular/common/http";
import { ActivatedRoute } from "@angular/router";
import { SESSION_STORAGE, StorageService } from "ngx-webstorage-service";
import { DatePipe } from "@angular/common";
import { environment } from "../../../../environments/environment";
import { ToastrManager } from "ng6-toastr-notifications";
import { ExcelService } from "src/app/excel.service";
import { ConfirmationService } from "primeng/api";

@Component({
  selector: "app-attendance-mangement",
  templateUrl: "./attendance-mangement.component.html",
  styleUrls: ["./attendance-mangement.component.css"],
})
export class AttendanceMangementComponent implements OnInit {
  apiUrl = environment.apiUrl;
  imgUrl = environment.imageURL;
  rows = [];
  isLoading: boolean = true;
  searchQR: any;
  value1: any;

  S_Date: any = new Date();
  E_Date: any = new Date();
  job_detail_no: string = "";
  user_type_value: string = "";
  date_and_time: string = new Date().toLocaleString("en-US", {
    timeZone: "Asia/Kolkata",
  });
  pet_type_list: any = [];
  pet_type_id: string = "";

  update_button: boolean;
  selectedimgae: any;
selectedBranch: string = '';
  rows1: any;
  activity_name: any;
  userType:any;
branchList = [];
  @ViewChild("imgType", { static: false }) imgType: ElementRef;

  constructor(
    private toastr: ToastrManager,
    private router: Router,
    @Inject(SESSION_STORAGE) private storage: StorageService,
    private http: HttpClient,
    private _api: ApiService,
    private routes: ActivatedRoute,
    private datePipe: DatePipe,
    private excelService:ExcelService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.job_detail_no = "";
    this.user_type_value = "0";
    this.userType = this.storage.get('user_typess');
    // this.user_type_img = 'http://18.237.123.253:3000/api/uploads/template.jpg';
    this.pet_type_id = "";
    this.update_button = true;
    this.getAttendanceList();
    this.getBranchList();
  }

  cancel() {
    this.update_button = true;
    this.job_detail_no = undefined;
  }
  ////// Inserting Data

  deleteConfirm(item: any) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this record?',
      header: 'Confirm Delete',
      icon: 'pi pi-exclamation-triangle text-danger',
      acceptLabel: 'Delete',
      rejectLabel: 'Cancel',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.Deletecompanydetails(item)
      }
    });
  }

  Deletecompanydetails(data) {
    let a = {
      _id: data,
    };
    console.log(a);
    this._api.attendance_delete(a).subscribe((response: any) => {
      console.log(response.Data);
      //alert('Deleted Successfully');
      this.showSuccess("Deleted Successfully");
      this.ngOnInit();
    });
  }

  Editcompanydetailsdata(data) {
    this.update_button = false;
    this.pet_type_id = data._id;
    this.job_detail_no = data.job_detail_no;
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
      this._api.jobdetail_filter_date(a).subscribe((response: any) => {
        console.log(response.Data);
        this.rows = response.Data;
        this.isLoading = false;
      });
    } else {
      this.showWarning("Please select the startdate and enddate");
      //alert('Please select the startdate and enddate');
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

  saverange() {}
  excelDownload(){
      const excelData = [];
      const value=this.rows;
      console.log(value);
      value.map(d =>{
        excelData.push({
          'Branch Code':d.firstRecord.BRCODE,
          'EMP No':d.firstRecord.EMPNO,
          'User Name':d.firstRecord.EMPNAME,
          'Date':this.datePipe.transform(new Date(d.firstRecord.ENTRYDT), "DD-MM-YYYY"),
          'Check-in Time': d.firstRecord.CHECKINTIME,
          'Check-in  Location':d.firstRecord.CHECKINADDRESS,
          'Check-out Time':d.firstRecord.CHECKOUTTIME,
          'Check-out Location':d.firstRecord.CHECKOUTADDRESS
       });  
       });
    this.excelService.exportAsExcelFile(excelData, 'User Details')
}

  getAttendanceList() {
    if (
      this.E_Date != undefined &&
      this.S_Date != undefined &&
      this.S_Date <= this.E_Date
    ) {
      this.isLoading = true;
      this.rows = [];
      let a = {
        fromDate: this.datePipe.transform(new Date(this.S_Date), "yyyy-MM-dd"),
        toDate: this.datePipe.transform(new Date(this.E_Date), "yyyy-MM-dd"),
        BRCODE : this.selectedBranch || ''
      };
      this._api.attendance_list(a).subscribe((response: any) => {
        console.log("response.Data");
        console.log(response.Data);
        this.rows = response.Data;
        this.isLoading = false;
      });
    } else {
      this.toastr.warningToastr("Please provide a valid date.");
    }
  }

  getGoogleMapsLink(startLat: number, startLong: number): string {
    return `https://www.google.com/maps/place/${startLat},${startLong}`;
  }


    /** BRANCH CHANGE EVENT */
onBranchChange() {
  console.log('Selected Branch:', this.selectedBranch);
  this.getAttendanceList();

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
}
