import { Component, OnInit ,Inject} from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialogRef } from '@angular/material/dialog';
import { ApiService } from '../../../api.service';
import { SESSION_STORAGE, StorageService } from 'ngx-webstorage-service';


@Component({
  selector: 'app-current-login',
  templateUrl: './current-login.component.html',
  styleUrls: ['./current-login.component.css']
})
export class CurrentLoginComponent implements OnInit {
  rows=[];
  time:any;
  status:any;
  datas : any;
  constructor(  @Inject(MAT_DIALOG_DATA) data,private _api: ApiService, @Inject(SESSION_STORAGE) private storage: StorageService) {
    console.log('{ -----', data);
 this.time="03-04-1995";
 this.status="Active";


   this.datas = this.storage.get('employee_id_data');
   console.log(this.datas);


   }

  ngOnInit(): void {
console.log(this.status)



this._api.agent_attendence().subscribe((data:any)=>{
  this.rows=data['Data']
   console.log(this.rows)
    });





  }
}
