import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AbstractControl,FormBuilder, FormGroup, Validators ,FormArray, FormControl,} from '@angular/forms';
@Component({
  selector: 'app-sevice-addadmin',
  templateUrl: './sevice-addadmin.component.html',
  styleUrls: ['./sevice-addadmin.component.css']
})
export class SeviceAddadminComponent implements OnInit {
  adminForm:FormGroup;
  user=  [ 
    {"name": "HO",}, 
    {"name": "BRANCH",}, 
 , ];
    setAccess=[{"access":"Admin Management","status":true,},
        {"access":"New Agent Creation","status":true,},
        {"access":"Agent Management","status":true,},
        {"access":"New Service Creation","status":true,},
        {"access":"Service Management","status":true,},
        {"access":"Report Management","status":true,},
        {"access":"Agent Wise Report","status":true,},
        {"access":"Document Approval","status":true,},
        {"access":"Settings Management","status":true,},
        {"access":"Location Management","status":true,},
        {"access":"Data Administration","status":true,},
        {"access":"Dashboard","status":true,},];
        setagent=[{"access":"Admin ","status":true,},
        {"access":"New Agent ","status":true,},
        {"access":"Agent ","status":true,},
        {"access":"New Service ","status":true,},
        {"access":"Service ","status":true,},
        {"access":"Report ","status":true,},
        {"access":"Agent  Report","status":true,},
        {"access":"Document ","status":true,},
        {"access":"Settings ","status":true,},
        {"access":"Location ","status":true,},
        {"access":"Data ","status":true,},
        {"access":"Dashboard","status":true,},]
  constructor(private router:Router,private formBuilder: FormBuilder) { 
    this.adminForm = this.formBuilder.group({
      _id:[''],
      first_Name:['',Validators.required,],
      last_name:['',Validators.required,],
      email_id:['',Validators.required,],
      mobile_phone:['',Validators.required,],
      user_name:['',Validators.required,],
      password:['',Validators.required,],
      confirm_password:['',Validators.required,],
      status:['',Validators.required,],

  })
  }

  ngOnInit(): void {
  }
  Insert_Agent(){
    this.router.navigate(['/service-admin'])
  }

}
