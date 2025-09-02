import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
// import { ApiService } from '../../../api/userApi/api.service';
import { ApiService } from '../../../api.service';
import { SESSION_STORAGE, StorageService } from 'ngx-webstorage-service';

@Component({
  selector: 'app-admin-sidebar',
  templateUrl: './admin-sidebar.component.html',
  styleUrls: ['./admin-sidebar.component.css']
})
export class AdminSidebarComponent implements OnInit {
  expanded: boolean = false;
  expand: boolean = false;
  expand1: boolean = false;
  expand2: boolean = false;
  expand3: boolean = false;
  expand4: boolean = false;
  expand5: boolean = false;
  expand9: boolean = false;
  expand10: boolean = false;
  expand11: boolean = false;
  expand12 : boolean = false;
  menu_slider: boolean = false;
  

  menu_visible = '';

   joint_inspe = false;
   user_details : any;
  constructor(
    @Inject(SESSION_STORAGE) private storage: StorageService,
    private router: Router,
    private _api: ApiService,
  ) { }

  ngOnInit(): void {
    console.log(this.storage.get('user_details'));
    this.user_details = this.storage.get('user_details');
    this.menu_visible = this.storage.get('user_typess');
    if(this.menu_visible == 'Admin'){
      this.joint_inspe = true;
    }else if(this.menu_visible == 'audit'){
       for(let a = 0; a <  this.user_details.activity_access.length ; a++){
         if(this.user_details.activity_access[a].SMU_UKEY == 'OP-ACT8'){
          console.log("Data in")
          this.joint_inspe = this.user_details.activity_access[a].select_status;
         }
       }
    }
  }
  formtype() {
    this.saveInLocal('Company_detail', undefined);
    this.saveInLocal('Form_type', 'create');
  }


  saveInLocal(key, val): void {
    this.storage.set(key, val);
  }

  getFromLocal(key): any {
    return this.storage.get(key);
  }
  menuslide() {
    this.menu_slider = !this.menu_slider;
  }
 



  

}
