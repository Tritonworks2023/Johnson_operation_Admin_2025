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
import { finalize } from "rxjs/operators";
import { ConfirmationService } from "primeng/api";

@Component({
  selector: "app-usermanagement",
  templateUrl: "./usermanagement.component.html",
  styleUrls: ["./usermanagement.component.css"],
})
export class UsermanagementComponent implements OnInit {
  apiUrl = environment.apiUrl;
  imgUrl = environment.imageURL;
  rows = [];
  searchQR: any;
  value1: any;
  branchList: any[] = [];

  S_Date: any;
  E_Date: any;
  activedetail_name: string = "";
  user_type_value: string = "";
  date_and_time: string = new Date().toLocaleString("en-US", {
    timeZone: "Asia/Kolkata",
  });
  pet_type_list: any = [];
  pet_type_id: string = "";
  model: string = "";
  remarks: string = "";
  job_location: any[] = [];

  update_button: boolean;
  selectedimgae: any;

  user_id: any;
  user_name: any;
  user_email_id: any;
  user_password: any;
  user_designation: any;
  user_type: any;
  user_status: any;
  user_role: any;
  reg_date_time = "" + new Date();

  imie_code = "";
  agent_code = "";
  location = "";
  delete_status: boolean = true;

  user_type_list = [
    { status: "Mobile" },
    { status: "Desktop" },
    { status: "Mobile & Desktop" },
  ];

  user_status_list = [{ status: "Available" }, { status: "Not Available" }];

  user_designation_list = [
    { status: "Admin" },
    { status: "Manager" },
    { status: "Field Visit" },
    { status: "Operation" },
    { status: "Mobile User" },
    { status: "Oper Tech" },
    { status: "Operation MOD" },
    { status: "Operation Escal" },
    // {status : "JIC Tech"}
  ];

selectedBranch: string = '';

  user_role_list = [{ status: "ESPD" }, { status: "OP" }];

  @ViewChild("imgType", { static: false }) imgType: ElementRef;

  userRole = '';
  isLoading:boolean = false;
  department: string = "";
  isSearching: boolean = false;

  constructor(
    private toastr: ToastrManager,
    private router: Router,
    @Inject(SESSION_STORAGE) private storage: StorageService,
    private http: HttpClient,
    private _api: ApiService,
    private routes: ActivatedRoute,
    private datePipe: DatePipe,
    private excelService: ExcelService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.userRole = this.storage.get('user_typess');
    this.activedetail_name = "";
    this.user_type_value = "0";
    // this.job_location = ' '
    // this.user_type_img = 'http://18.237.123.253:3000/api/uploads/template.jpg';
    this.pet_type_id = "";
    this.update_button = true;
    this.listpettype();
    this.getBranchList();
  }

  listpettype() {
    this.isLoading = true;
    this._api.getlist_userdetail().pipe(
      finalize(()=>{
        this.isLoading = false;
      })
    ).subscribe((response: any) => {
      console.log(response.Data);
      this.rows = response.Data;
      console.log(this.pet_type_list);
    });
  }

  cancel() {
    this.update_button = true;
    this.activedetail_name = undefined;
    this.clear_data();
  }
  ////// Inserting Data

  Insert_pet_type_details() {
    console.log(this.job_location);
    if (this.user_id == "") {
      //alert("Please enter the pet type")
      this.showWarning("Please enter the user id");
    } else {
      let a = {
        user_id: this.user_id,
        user_name: this.user_name,
        user_email_id: this.user_email_id,
        user_password: this.user_password,
        user_designation: this.user_designation.status,
        user_type: "Mobile",
        user_status: "Available",
        user_role: "ESPD",
        reg_date_time:
          "" + new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" }),
        imie_code: this.imie_code,
        agent_code: this.agent_code,
        location: this.location,
        delete_status: this.delete_status,
        remarks: this.remarks,
        model: this.model,
        job_location: this.job_location,
        dept: this.department
      };
      console.log(a);
      this._api.userdetail_insert(a).subscribe((response: any) => {
        console.log(response.Data);
        if (response.Code === 200) {
          //alert('Added Successfully');
          this.showSuccess("Added Successfully");
        } else {
          //alert(response.Message);
          this.showError(response.Message);
        }
        this.ngOnInit();
        this.clear_data();
      });
    }
  }

  Edit_pet_type_details() {
    let a = {
      _id: this.pet_type_id,
      user_id: this.user_id,
      user_name: this.user_name,
      user_email_id: this.user_email_id,
      user_password: this.user_password,
      user_designation: this.user_designation.status,
      user_type: this.user_type.status,
      user_status: this.user_status.status,
      user_role: this.user_role.status,
      imie_code: this.imie_code,
      agent_code: this.agent_code,
      location: this.location,
      delete_status: this.delete_status,
      remarks: this.remarks,
      model: this.model,
      job_location: this.job_location,
      dept: this.department,
    };
    this._api.userdetail_edit(a).subscribe((response: any) => {
      console.log(response.Data);
      //alert("Updated Successfully");
      this.showSuccess("Updated Successfully");
      this.clear_data();
      this.ngOnInit();
    });
  }
    
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
    this._api.userdetail_delete(a).subscribe((response: any) => {
      console.log(response.Data);
      //alert('Deleted Successfully');
      this.showSuccess("Deleted Successfully");
      this.ngOnInit();
    });
  }

  Editcompanydetailsdata(data) {
    console.log(data);

    this.update_button = false;
    this.pet_type_id = data._id;
    this.user_id = data.user_id;
    this.user_name = data.user_name;
    this.imie_code = data.imie_code;
    this.agent_code = data.agent_code;
    this.location = data.location;
    this.delete_status = data?.delete_status;
    this.remarks = data?.remarks;
    this.model = data?.model;
    this.user_email_id = data.user_email_id;
    this.user_password = data.user_password;
    this.user_designation = { status: data.user_designation };
    this.user_type = { status: data.user_type };
    this.user_status = { status: data.user_status };
    this.user_role = { status: data.user_role };
    this.job_location = Array.isArray(data.job_location) ? data.job_location : [];
    this.department = data?.dept;
  }

  getuserDetails() {
    this.isSearching = true;
    const payload = {
      EMPID: this.agent_code
    }
    this._api.getuserdetailInOracle(payload).pipe(
      finalize(()=>{
        this.isSearching = false;
      })
    ).subscribe({
      next: (res:any)=>{
        this.user_name = res?.Data?.ENAME;
        this.delete_status = res?.Data?.STATUS == "A" ? true : false;
        this.location = res?.Data?.BRCODE;
        this.department = res?.Data?.DEPT
      },
      error: (err:any)=>{

      }
    });
  }

  filter_date() {
    if (this.E_Date != undefined && this.S_Date != undefined) {
      // let yourDate = new Date(this.E_Date.getTime() + (1000 * 60 * 60 * 24));
      let yourDate = this.E_Date.setDate(this.E_Date.getDate() + 1);

      let a = {
        fromdate: this.datePipe.transform(new Date(this.S_Date), "yyyy-MM-dd"),
        todate: this.datePipe.transform(new Date(yourDate), "yyyy-MM-dd"),
      };
      console.log(a);
      this._api.userdetail_filter_date(a).subscribe((response: any) => {
        console.log(response.Data);
        this.rows = response.Data;
      });
    } else {
      this.showWarning("Please select the startdate and enddate");
      //alert('Please select the startdate and enddate');
    }
  }
  refersh() {
    this.listpettype();
    this.E_Date = undefined;
    this.S_Date = undefined;
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

  clear_data() {
    this.user_id = "";
    this.user_name = "";
    this.user_email_id = "";
    this.user_password = "";
    this.imie_code = "";
    this.agent_code = "";
    this.location = "";
    this.user_designation = {};
    this.job_location = [];
    this.remarks = '';
    this.model = '';
    this.user_type = {};
    this.user_status = {};
    this.user_role = {};
    this.delete_status = true;
    this.department = "";
  }

  clear_device_id_by_number(data) {
    let userData = {
      user_id: data,
    };
    this._api.clear_device_id_by_number(userData).subscribe((response: any) => {
      this.showSuccess("Device id Cleard successfully");
      this.ngOnInit();
    });
  }

  clearDeviceId() {
    this._api.clear_employee_deviceId().subscribe(() => {
      this.showSuccess("All Device id Cleard successfully");
      this.ngOnInit();
    });
  }
  excelDownload() {
    const excelData = [];
    const value = this.rows;
    value.map((d) => {
      excelData.push({
        "User Id": d.user_id,
        Name: d.user_name,
        Email: d.user_email_id,
        "Device ID": d.device_id,
        Designation: d.user_designation,
        "Imei Code": d.imie_code,
        "Agent code": d.agent_code,
        Location: d.location,
      });
    });
    this.excelService.exportAsExcelFile(excelData, "User Details");
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

  onJobLocationChange(event: any, id: string) {
    if (event.target.checked) {
      if (!this.job_location.includes(id)) {
        this.job_location.push(id);
      }
    } else {
      this.job_location = this.job_location.filter((loc: string) => loc !== id);
    }
  }


  /** BRANCH CHANGE EVENT */
onBranchChange() {
  console.log('Selected Branch:', this.selectedBranch);

  // Example: filter API / table data
  this.refersh();
}
}