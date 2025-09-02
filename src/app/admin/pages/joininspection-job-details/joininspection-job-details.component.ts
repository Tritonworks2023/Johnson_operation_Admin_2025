import { Component, OnInit, Inject,  ViewChild, AfterViewInit, ElementRef } from '@angular/core';import { Router } from '@angular/router';
import { ApiService } from '../../../api.service';
import { HttpClient, HttpRequest } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { SESSION_STORAGE, StorageService } from 'ngx-webstorage-service';
import { DatePipe } from '@angular/common';
import { environment } from '../../../../environments/environment';
import { ToastrManager } from 'ng6-toastr-notifications';

@Component({
  selector: 'app-joininspection-job-details',
  templateUrl: './joininspection-job-details.component.html',
  styleUrls: ['./joininspection-job-details.component.css']
})
export class JoininspectionJobDetailsComponent implements OnInit {

 
  public loader_view :boolean = true;

  final_datas = [];
  getSpecInfo:any[] = [];
  public specInfoVisible: boolean = false;
  eachSpecData:any;
  job_count = 0; 
  job_detail : any;

  job_list_detail : any;
 table_data : any;

 timeLeft: number = 2;
 interval;

  constructor(
    private toastr:ToastrManager,
    private router: Router,
    @Inject(SESSION_STORAGE) private storage: StorageService,
    private http: HttpClient,
    private _api: ApiService,
    private routes: ActivatedRoute,
    private datePipe: DatePipe,
  ) {


    var datas = this.storage.get('joint_inspection_detail');
    console.log(datas);
    this.job_detail = datas;


   }

  ngOnInit(): void {
    let job_id = {
      job_id :  this.job_detail.job_id,
      group_id : this.job_detail.group_id,
      sub_group_id : this.job_detail.sub_group_id._id
    }
    console.log(job_id);
    this._api.Joint_inspection_jobdetail_fetch_by_id(job_id).subscribe(
     (response: any) => {
        this.loader_view = true;
        console.log("response.Data");
        console.log(response.Data);
        this.job_list_detail = response.Data;
        
        this.job_list_detail.forEach(elements => {
        let count_value = 0;
        elements.data_store.forEach(element => {
          element.count_value = count_value + 1;
          count_value = count_value + 1 ;
        });
      });
      debugger
        this.job_count = (this.job_list_detail.length / 2) - 1;
        this.table_data = this.job_list_detail[this.job_list_detail.length - 1].data_store;
        // this.getSpecInfo = this.job_list_detail[0].getSpecInfo;
        this.eachSpecData  = this.job_list_detail[0].getSpecInfo[0];
        const specInfo:any[] = this.job_list_detail[0].getSpecInfo;
        if(specInfo.length > 0) {
          this.specInfoVisible = true;
        }else {
          this.specInfoVisible = false;
        }
        console.log('*****Data*********',this.job_list_detail);
        this.startTimer2();
      }
    );
  }


  recall(index,count){
    console.log("================index,count===",index,count);
    if(index < this.job_list_detail.length){ 
     var check_value_data = this.job_list_detail[0].data_store;
     var value_data = this.job_list_detail[index].data_store; 
     for(let a = 0; a < check_value_data.length ; a++) {
          var temp_data = value_data;
          var check_status = 0;
          for(let b = 0 ; b < temp_data.length; b++){
                if(check_value_data[a]._id == temp_data[b]._id){
                  this.job_list_detail[index].data_store[b].count_value = check_value_data[a].count_value;
                  check_status = 1;
                }
                if(b == temp_data.length - 1){
                  if(check_status == 0){
                    this.job_list_detail[index].data_store.push(check_value_data[a])
                  }
                }
          }
          if(a == check_value_data.length - 1){
            this.job_list_detail[index].data_store = this.job_list_detail[index].data_store.sort((a, b) => a.count_value > b.count_value ? 1 : -1);
            index = index + 1;
            this.recall(index,count);
          }
     }
    } else {
      this.loader_view = false;
    
    }


  }


  startTimer2() {
  this.interval = setInterval(() => {
    console.log(this.timeLeft);
    if(this.timeLeft > 0) {
      this.timeLeft--;
    } else {
      this.recall(1,0);
      this.pauseTimer();
    }
  },1000)
}

pauseTimer() {
  clearInterval(this.interval);
}


print_pdf(){
  this.storage.set('joint_pdf_detail',this.job_list_detail);
  this.router.navigateByUrl('/admin/joininspection_details_pdf');
}

goBack() {
  this._api.backNavigation();
}








      




}
