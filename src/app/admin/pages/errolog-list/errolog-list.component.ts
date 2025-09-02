import { Component, OnInit, Inject,  ViewChild, AfterViewInit, ElementRef } from '@angular/core';import { Router } from '@angular/router';
import { ApiService } from '../../../api.service';
import { HttpClient, HttpRequest } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { SESSION_STORAGE, StorageService } from 'ngx-webstorage-service';
import { DatePipe } from '@angular/common';
import { environment } from '../../../../environments/environment';
import { ToastrManager } from 'ng6-toastr-notifications';

@Component({
  selector: 'app-errolog-list',
  templateUrl: './errolog-list.component.html',
  styleUrls: ['./errolog-list.component.css']
})
export class ErrologListComponent implements OnInit {

  searchQR:any;
  response_data :any;

  @ViewChild('imgType', { static: false }) imgType: ElementRef;

  constructor(
    private toastr:ToastrManager,
    private router: Router,
    @Inject(SESSION_STORAGE) private storage: StorageService,
    private http: HttpClient,
    private _api: ApiService,
    private routes: ActivatedRoute,
    private datePipe: DatePipe,
  ) { }

  ngOnInit(): void {
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


    search_job_no() {
      console.log(this.searchQR);
      let a  = {
        job_no : this.searchQR
      }
      this._api.error_log_with_job_no(a).subscribe(
        (response: any) => {
          console.log("response.Data");
          console.log(response.Data);
          this.response_data = [];
          this.response_data = response.Data;
        }
      );
    }

    
  

      view_field(data){
         this.storage.set('sub_group_detail',data);
        this.router.navigateByUrl('/admin/sub_field_management');
       }


    delete_espd_act1(data,_id){
      console.log(data)
      let a  = {
        job_id : data
      }
      this._api.liftwell_data_delete(a).subscribe(
        (response: any) => {
          console.log(response);  
          alert('Deleted  Lift Well Data');
        }
      );

      this._api.liftwell_data_delete_error_log({
        _id: _id
      }).subscribe(
        (response: any) => {
          console.log(response);  
          alert('Deleted  Lift Well Data Error Log');
          this.search_job_no();
        }
      );

      
    }
}
