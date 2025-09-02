import { Component, OnInit, Inject,  ViewChild, AfterViewInit, ElementRef } from '@angular/core';import { Router } from '@angular/router';
import { ApiService } from '../../../api.service';
import { HttpClient, HttpRequest } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { SESSION_STORAGE, StorageService } from 'ngx-webstorage-service';
import { DatePipe } from '@angular/common';
import { environment } from '../../../../environments/environment';
import { ToastrManager } from 'ng6-toastr-notifications';
@Component({
  selector: 'app-jointinspect-pdf',
  templateUrl: './jointinspect-pdf.component.html',
  styleUrls: ['./jointinspect-pdf.component.css']
})
export class JointinspectPdfComponent implements OnInit {

  // loader_view = true;

 job_count = 0; 
 job_detail : any;
 job_list_detail : any;
 table_data : any;
 timeLeft: number = 2;
 interval;
 final_datas = [];

 eachSpecData:any;
 getSpecInfo:any[] = [];
 public specInfoVisible: boolean = false;

  constructor(
    private toastr:ToastrManager,
    private router: Router,
    @Inject(SESSION_STORAGE) private storage: StorageService,
    private http: HttpClient,
    private _api: ApiService,
    private routes: ActivatedRoute,
    private datePipe: DatePipe,
  ){

    var datas = this.storage.get('joint_inspection_detail');
    console.log(datas);
    this.job_detail = datas;



    var datas = this.storage.get('joint_pdf_detail');
    console.log(datas);
    this.job_list_detail = datas;
    this.job_count = (this.job_list_detail.length / 2) - 1;
    this.table_data = this.job_list_detail[this.job_list_detail.length - 1].data_store;
    //this.table_data =  this.job_list_detail[0].data_store;


    this.final_datas = [];

    this.final_datas.push(this.job_list_detail[0]);
    this.final_datas.push(this.job_list_detail[this.job_list_detail.length - 1]);
    console.log("************",this.final_datas);

    this.job_list_detail = this.final_datas;


    this.eachSpecData  = this.job_list_detail[0].getSpecInfo[0];
    const specInfo:any[] = this.job_list_detail[0].getSpecInfo;
    if(specInfo.length > 0) {
      this.specInfoVisible = true;
    }else {
      this.specInfoVisible = false;
    }

   }

  ngOnInit(): void {


  }


  printComponent(cmpName) {
    let printContents = document.getElementById(cmpName).innerHTML;
    let originalContents = document.body.innerHTML;
    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents;
    window.location.reload();

}
goBack() {
  this._api.backNavigation();
}

}
