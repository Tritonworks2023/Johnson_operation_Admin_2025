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
    });
  }
  onSubmit() {
    console.log(this.flashMessageForm.value);
    if (this.flashMessageForm.invalid) {
      this.toastr.warningToastr("Please enter a valid input");
      return;
    } else {
      this._api.flashMessageCreate(this.flashMessageForm.value).subscribe({
        next: (res: any) => {
          if (res["Status"] == "Success") {
            this.toastr.successToastr(res.Message);
            this.flashMessageForm.reset();
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
}
