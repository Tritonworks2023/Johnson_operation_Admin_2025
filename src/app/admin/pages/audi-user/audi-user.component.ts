import { Component, OnInit, Inject,  ViewChild, AfterViewInit, ElementRef } from '@angular/core';import { Router } from '@angular/router';
import { ApiService } from '../../../api.service';
import { HttpClient, HttpRequest } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { SESSION_STORAGE, StorageService } from 'ngx-webstorage-service';
import { DatePipe } from '@angular/common';
import { environment } from '../../../../environments/environment';
import { ToastrManager } from 'ng6-toastr-notifications';
import { ConfirmationService } from 'primeng/api';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-audi-user',
  templateUrl: './audi-user.component.html',
  styleUrls: ['./audi-user.component.css']
})
export class AudiUserComponent implements OnInit {

  apiUrl = environment.apiUrl;
  imgUrl = environment.imageURL;
  rows = [];
  searchQR:any;
  value1:any;

  S_Date: any;
  E_Date: any;
  activedetail_name : string = '';
  user_type_value : string = '';
  date_and_time : string = new Date().toLocaleString("en-US", {timeZone: "Asia/Kolkata"});
  pet_type_list : any = [];
  pet_type_id : string = '';

  update_button : boolean;
  selectedimgae : any;

  user_id :any;
  user_name :any;
  user_email_id :any;
  user_password :any;
  branch_code:any;
  emp_id:any;
  user_designation :any;
  user_type :any;
  user_status :any;
  user_role : any;
  reg_date_time = ""+new Date();

  imie_code = '';
  agent_code = '';
  location = '';




  user_type_list = [
    {status : "Mobile"},
    {status : "Desktop"},
    {status : "Mobile & Desktop"},
   ];

   user_status_list = [
    {status : "Available"},
    {status : "Not Available"}
   ];

   user_designation_list  =
   [
    {status : "Audit"}
   ];

    user_role_list  =
   [
    {status : "ESPD"},
    {status : "OP"}
   ];



   activity_list = [];
   isLoading:boolean = false;


  @ViewChild('imgType', { static: false }) imgType: ElementRef;

  constructor(
    private toastr:ToastrManager,
    private router: Router,
    @Inject(SESSION_STORAGE) private storage: StorageService,
    private http: HttpClient,
    private _api: ApiService,
    private routes: ActivatedRoute,
    private datePipe: DatePipe,
    private confirmationService: ConfirmationService
  ) { }

  ngOnInit(): void {

    this.activedetail_name = '';
    this.user_type_value = '0';
    // this.user_type_img = 'http://18.237.123.253:3000/api/uploads/template.jpg';
    this.pet_type_id = '';
    this.update_button = true;
    this.branch_code = '';
    this.emp_id = ''
    this.listpettype();
    this.list_actity_type();
  }



  listpettype() {
    this.isLoading = true;
    this._api.audit_getlist_userdetail().pipe(
      finalize(()=>{
        this.isLoading = false;
      })
    ).subscribe(
      (response: any) => {
        this.rows = response.Data;
      }
    );
  }



  list_actity_type() {
    this._api.new_groupdetail_list().subscribe(
      (response: any) => {
        this.activity_list = response.Data;


        // products.sort(function (a, b) {
        //   return a.title.rendered - b.title.rendered;
        // });

        this.activity_list.forEach(element => {
          element.select_status = false;
        });


        this.activity_list.sort((a, b) => (a.SMU_UKEY > b.SMU_UKEY) ? 1 : -1);

        // this.list_data();
      }
    );
  }


  click_action(index,data){
    this.activity_list[index].select_status = data;
  }



  cancel() {
    this.update_button = true;
    this.activedetail_name= undefined;
    this.clear_data();
  }
  ////// Inserting Data

  Insert_pet_type_details() {
    if(this.user_id == ''){
      //alert("Please enter the pet type")
      this.showWarning("Please enter the user id")
    }else{
      console.log()
    let a = {
      'user_id'  : this.user_id,
      'user_name'  : this.user_name,
      'user_email_id'  : this.user_email_id,
      'emp_id'  : this.emp_id,
      'branch_code'  : this.branch_code,
      'user_password'  : this.user_password,
      'user_designation' : "Admin User",
      'user_type'  : "Mobile",
      'user_status'  : "Available",
      'user_role' : "ESPD",
      'reg_date_time'  : ''+new Date().toLocaleString("en-US", {timeZone: "Asia/Kolkata"}),
      'imie_code' : this.imie_code,
      'agent_code' : this.agent_code,
      'location' : this.location,
      'activity_access':this.activity_list
      };
    console.log(a);
    this._api.audit_userdetail_insert(a).subscribe(
    (response: any) => {
      console.log(response.Data);
      if ( response.Code === 200 ) {
        //alert('Added Successfully');
        this.showSuccess("Added Successfully");
        this.ngOnInit();
        this.clear_data();
      }else {
        //alert(response.Message);
        this.showError(response.Message)
      }

    }
  );
    }
  }


  Edit_pet_type_details(){
    let a = {
      '_id' : this.pet_type_id,
      'user_id'  : this.user_id,
      'user_name'  : this.user_name,
      'user_email_id'  : this.user_email_id,
      'emp_id'  : this.emp_id,
      'branch_code'  : this.branch_code,
      'user_password'  : this.user_password,
      'user_designation' : "Admin User",
      'user_type'  : this.user_type.status,
      'user_status'  : this.user_status.status,
      'user_role' : this.user_role.status,
      'imie_code' : this.imie_code,
      'agent_code' : this.agent_code,
      'location' : this.location,
      'activity_access':this.activity_list
     };
    this._api.audit_userdetail_edit(a).subscribe(
    (response: any) => {
      console.log(response.Data);
      //alert("Updated Successfully");
      this.showSuccess("Updated Successfully");
      this.clear_data();
      this.ngOnInit();
    }
  );
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
      '_id' : data
     };
    console.log(a);
    this._api.audit_userdetail_delete(a).subscribe(
    (response: any) => {
      console.log(response.Data);
      //alert('Deleted Successfully');
      this.showSuccess("Deleted Successfully")
      this.ngOnInit();
    }
  );
  }


  Editcompanydetailsdata(data) {
    console.log(data);
    this.update_button = false;
    this.pet_type_id = data._id;
    this.user_id = data.user_id ;
    this.user_name = data.user_name ;
    this.imie_code = data.imie_code ;
    this.agent_code = data.agent_code ;
    this.location = data.location ;
    this.user_email_id = data.user_email_id ;
    this.emp_id = data.emp_id? data.emp_id :'' ;
    this.branch_code = data.branch_code ? data.branch_code :'' ;
    this.user_password = data.user_password ;
    this.user_designation =  {status : data.user_designation};
    this.user_type = {status : data.user_type};
    this.user_status =  {status : data.user_status};
    this.user_role =  {status : data.user_role};
    this.activity_list = data.activity_access;
  }

    filter_date() {
      if ( this.E_Date != undefined && this.S_Date != undefined) {
        // let yourDate = new Date(this.E_Date.getTime() + (1000 * 60 * 60 * 24));
        let yourDate= this.E_Date.setDate(this.E_Date.getDate() + 1);

        let a = {
          "fromdate":this.datePipe.transform(new Date(this.S_Date),'yyyy-MM-dd'),
          "todate" : this.datePipe.transform(new Date(yourDate),'yyyy-MM-dd')
          }
        console.log(a);
        this._api.audit_userdetail_filter_date(a).subscribe(
          (response: any) => {
            console.log(response.Data);
            this.rows = response.Data;
          }
        );
      }
      else{
        this.showWarning("Please select the startdate and enddate");
        //alert('Please select the startdate and enddate');
      }

    }
    refersh(){
      this.listpettype();this.E_Date = undefined ; this.S_Date = undefined;
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

    clear_data(){
      this.user_id = "";
      this.user_name =  "";
      this.user_email_id ="";
      this.user_password = "";
      this.imie_code  = "";
      this.agent_code = "";
      this.location = "";
      this.user_designation = {}
    }

}
