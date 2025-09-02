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
    console.log(this.storage.get('user_details'));
    this.user_details = this.storage.get('user_details');
    this.user_designation_list = [];
    this.user_details.activity_access.forEach(element => {
      console.log(element);
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
          console.log(response.Data);
          this.activity_list = response.Data;
        }
      );


  
  
  }


  fetch_detail(data,title,type){
    console.log(type);
    this.title = title;
    this.table_value = ""+type;
    console.log(title+"0000");
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
    console.log(this.table_value);

    this.grouplist.forEach(elements => {
      console.log(elements._id,data)
      if(elements._id == data){
        console.log(elements.data_store);
        this.rows = elements.data_store;
        console.log(this.rows);
        this.count_value = ""+this.rows.length;
        console.log(this.rows);
      }
    });







  }


  search_value(){
    this.lift_value = false;
    this.showCustomerDetail = true;
    console.log(this.job_no);
    console.log(this.activity);
    if(this.job_no == ''){
     alert('Enter Job No');
    }else if (this.activity == undefined){
      alert('Select Any Acitivty');
    }else {
      this.activity_list.forEach(element => {
        if(element.SMU_UKEY_DESCRIPTION == this.activity.status){
          console.log(element._id);
          console.log(element.SMU_FORMTYPE);
          this.table_value = element.SMU_FORMTYPE;
          let ac = {
            job_id : this.job_no,
            group_id : element._id
          }
          this._api.fetch_data_admin(ac).subscribe(
            (response: any) => {
              console.log(response.Data);
              if(response.Data == null){
                alert("No Record Found");
              }else {
              this.rows = response.Data.data_store;
              this.submitted_date = response.Data.start_time;
              let ct = {
                user_id :  response.Data.user_id
              }
              this._api.fetch_userdetail(ct).subscribe(
                (response: any) => {
                  console.log(response.Data);
                  this.entry_user = response.Data.user_name;
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
            }
          );
          let d = {
            job_no :  this.job_no,
          }
          this._api.fetch_address(d).subscribe(
            (response: any) => {
              console.log(response.Data);
              this.address = response.Data
            }
          );
        }
      });
    }
  }


  refresh(){
    window.location.reload();
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
