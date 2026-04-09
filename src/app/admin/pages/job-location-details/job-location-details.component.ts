import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SESSION_STORAGE, StorageService } from 'ngx-webstorage-service';
import { finalize } from 'rxjs/operators';
import { ApiService } from 'src/app/api.service';

@Component({
  selector: 'app-job-location-details',
  templateUrl: './job-location-details.component.html',
  styleUrls: ['./job-location-details.component.css']
})
export class JobLocationDetailsComponent implements OnInit {

  rows:any[] = [];
  searchQR: any;
  branchList: any[] = [];
  isLoading: boolean = false;
  userDetails: any[] = [];
  selectedBranch: string = '';
  userRole = '';
  visible: boolean = false;
  jobForm!: FormGroup;
  isSave: boolean = false;

  constructor(@Inject(SESSION_STORAGE) private storage: StorageService, private service: ApiService, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.jobForm = this.fb.group({
      location: [null],
    });
    this.userRole = this.storage.get('user_typess');
    this.getJobList();
  }

  getJobList() {
    this.isLoading = true
    this.service.getJobsLocationDetails().pipe(
      finalize(() => {
        this.isLoading = false
      })
    ).subscribe({
      next: (res: any) => {
        this.rows = res?.Data;
        this.userDetails = res?.Data;
      },
      error: (error: any) => { },
    });
  }

  save() {
    this.isSave = true
    this.service.updateJobsLocation(this.jobForm.value).pipe(
      finalize(() => {
        this.isSave = false;
      })
    ).subscribe({
      next: (res: any) => {
        this.visible = false;
        this.getJobList();
      },
      error: (error: any) => { },
    });
  }

  onSearch(): void {
    let filtered = [...this.userDetails];

    // Branch filter
    if (this.selectedBranch) {
      filtered = filtered.filter(
        (res: any) => res.location === this.selectedBranch
      );
    }

    // Search filter
    if (this.searchQR && this.searchQR.trim()) {
      const term = this.searchQR.toLowerCase();
      filtered = filtered.filter((u: any) =>
        Object.values(u).some(v =>
          v && v.toString().toLowerCase().includes(term)
        )
      );
    }

    this.rows = filtered;
  }


  showDialog(data:any) {
    this.visible = true;
    this.jobForm.patchValue({
      location : data?.location
    })
  }
}
