import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ApiService } from "src/app/api.service";
import { ToastrManager } from "ng6-toastr-notifications";

@Component({
  selector: "app-notification",
  templateUrl: "./notification.component.html",
  styleUrls: ["./notification.component.css"],
})
export class NotificationComponent implements OnInit {
  rows: any[] = [];
isLoading = false;
designationOptions = [
  { label: 'Mobile User', value: 'Mobile User' },
  { label: 'Oper Tech', value: 'Oper Tech' }
];
  constructor(
    private fb: FormBuilder,
    private _api: ApiService,
    private toastr: ToastrManager
  ) {}
  flashMessageForm: FormGroup;
  ngOnInit(): void {
    this.flashMessageForm = this.fb.group({
      message: [null, Validators.required],
      description: [null],
      department: ["OPR", Validators.required],
      designation: [null, Validators.required],
    });

    const data = {
      department : "OPR",
    }

    this._api.getmessage(data).subscribe((res: any) => {
      this.rows = res.Data;   // 🔴 IMPORTANT
    this.isLoading = false;
    });
  }

    showSuccess(msg) {
    this.toastr.successToastr(msg);
  }

  showError(msg) {
    this.toastr.errorToastr(msg);
  }
  onSubmit() {
    console.log(this.flashMessageForm.value);
    if (this.flashMessageForm.invalid) {
      this.toastr.warningToastr("Please enter a valid input");
      return;
    } else {

        const payload = {
    ...this.flashMessageForm.value,
    designation:
      this.flashMessageForm.value.designation?.value ??
      this.flashMessageForm.value.designation
  };

  console.log(payload);
      this._api.flashMessageCreate(payload).subscribe({
        next: (res: any) => {
          if (res["Status"] == "Success") {
            this.toastr.successToastr(res.Message);
            this.flashMessageForm.reset();
            this.ngOnInit();
          } else {
            this.toastr.warningToastr(res.Message);
          }
        },
        error: (error: any) => {
          this.toastr.errorToastr(error.Message);
        },
      });
    }
  }


    Deletecompanydetails(data) {
    let a = {
      id: data,
    };
    console.log(a);
    this._api.note_delete(a).subscribe((response: any) => {
      console.log(response.Data);
      //alert('Deleted Successfully');
      this.showSuccess("Deleted Successfully");
      this.ngOnInit();
    });
  }
}
