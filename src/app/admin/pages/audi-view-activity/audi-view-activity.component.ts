import { Component, OnInit, Inject,  ViewChild, AfterViewInit, ElementRef } from '@angular/core';import { Router } from '@angular/router';
import { ApiService } from '../../../api.service';
import { HttpClient, HttpRequest } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { SESSION_STORAGE, StorageService } from 'ngx-webstorage-service';
import { DatePipe } from '@angular/common';
import { environment } from '../../../../environments/environment';
import { ToastrManager } from 'ng6-toastr-notifications';

@Component({
  selector: 'app-audi-view-activity',
  templateUrl: './audi-view-activity.component.html',
  styleUrls: ['./audi-view-activity.component.css']
})
export class AudiViewActivityComponent implements OnInit {
  apiUrl = environment.apiUrl;
  imgUrl = environment.imageURL;
  rows = [];
  searchQR:any;
  value1:any;

  S_Date: any;
  E_Date: any;
  Diagnosis : string = '';
  user_type_value : string = '';
  date_and_time : string = new Date().toLocaleString("en-US", {timeZone: "Asia/Kolkata"});
  pet_type_list : any = [];
  pet_type_id : string = '';

  update_button : boolean;
  selectedimgae : any;
  submitted_date = '';
  datas : any;
  title = '';
  count_value = "0";

  lift_value = false;
  showCustomerDetail: boolean = false;
  isLoading: boolean = false;

  @ViewChild('imgType', { static: false }) imgType: ElementRef;

  table_value = '1';

  grouplist = [];

  activity_list = [];

   job_no = '';
   activity:any;

   user_designation_list  = [{status : "Audit",value:''}];
  user_details : any;
  address : any;
  entry_user = '';

    rows2 = [];

  constructor(
    private toastr:ToastrManager,
    private router: Router,
    @Inject(SESSION_STORAGE) private storage: StorageService,
    private http: HttpClient,
    private _api: ApiService,
    private routes: ActivatedRoute,
    private datePipe: DatePipe,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.activity_list = [];
    this.user_details = this.storage.get('user_details');
    this.user_designation_list = [];
    this.user_details?.activity_access.forEach(element => {
      if(element.select_status == true){
        this.user_designation_list.push({status:element.SMU_UKEY_DESCRIPTION,value:`${this.fullForm(element?.SMU_DEPT)} -${element.SMU_UKEY_DESCRIPTION}`});
      }
    });


      // this._api.new_groupdetail_list().subscribe(
      //   (response: any) => {
      //     console.log(response.Data);`
      //     this.grouplist = response.Data;
      //   }
      // );

      this._api.new_groupdetail_list().subscribe(
        (response: any) => {
          this.activity_list = response.Data;
        }
      );
  }


  fetch_detail(data,title,type){
    this.title = title;
    this.table_value = ""+type;
    // if(title == "PLUMB CHART READING"){
    //   this.table_value = '2';
    // }else if(title == "Plan of Lift Wall"){
    //   this.table_value = '3';
    // }else if(title == "RM Forms "){
    //   this.table_value = '4';
    // }
    // else{
    //   this.table_value = '1';
    // }

    this.grouplist.forEach(elements => {
      console.log(elements._id,data)
      if(elements._id == data){
        this.rows = elements.data_store;
        this.count_value = ""+this.rows.length;
      }
    });







  }


  search_value(){

    this.isLoading = true;
    this.lift_value = false;
    this.showCustomerDetail = true;
    if(this.job_no == ''){
     alert('Enter Job No');
     this.isLoading = false;
     this.showCustomerDetail = false;
     return;
    }else if (this.activity == undefined){
      alert('Select Any Acitivty');
      this.isLoading = false;
      this.showCustomerDetail = false;
      return;
    }else {
      this.activity_list.forEach(element => {
        if(element.SMU_UKEY_DESCRIPTION == this.activity.status){
          this.table_value = element.SMU_FORMTYPE;
          let ac = {
            job_id : this.job_no,
            group_id : element._id
          }
          this._api.fetch_data_admin(ac).subscribe(
            (response: any) => {
              if(response.Data == null){
                alert("No Record Found");
                  this.isLoading = false;
              }else {
              this.rows = response.Data.data_store;
              this.submitted_date = response.Data.start_time;
              let ct = {
                user_id :  response.Data.user_id
              }
              this._api.fetch_userdetail(ct).subscribe(
                (response: any) => {
                  this.entry_user = response.Data.user_name;
                  this.isLoading = false;
                }, (error: any)=> {
                  this.isLoading = false;
                }
              );
              if(this.activity.status == ' Lift Well Details Entry(Site details upload)'){
                let ct = {
                  job_id : this.job_no
                }
                this._api.fetch_data_admin_form2(ct).subscribe(
                  (response: any) => {
                    console.log(response.Data);
                    this.rows2 = response.Data.data_store;
                    this.lift_value = true;
                  }
                );
              }
            }
            }, (error: any)=> {
              this.isLoading = false;
            }
          );
          let d = {
            job_no :  this.job_no,
          }
          this._api.fetch_address(d).subscribe(
            (response: any) => {
              this.address = response.Data
            }
          );
        }
      });
    }
  }


  refresh() {
    this.isLoading = false;
    // window.location.reload();
    this.job_no = '';
    this.activity = undefined;
    this.lift_value = false;
    this.showCustomerDetail = false;
    this.rows = [];
    this.rows2 = [];
    this.submitted_date = null;
    this.entry_user = '';
    this.address = null;
    this.table_value = '1';
  }




  print_page(cmpName) {
    let printContents = document.getElementById(cmpName).innerHTML;
    let originalContents = document.body.innerHTML;
    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents;
    window.location.reload();
}
fullForm(item:string) {
  if(item == 'ESPD'){
    return 'LIFT'
  }else  if(item == 'SERV '){
    return 'SERVICE'
  }else  if(item == 'OP'){
    return 'OPERATION'
  }else  {
    return 'ESCALATOR'
  }
}


}
