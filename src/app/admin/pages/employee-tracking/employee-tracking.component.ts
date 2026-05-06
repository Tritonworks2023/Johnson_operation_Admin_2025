import { Component, OnInit } from '@angular/core';
import { MouseEvent } from '@agm/core';
import { ToastrManager } from 'ng6-toastr-notifications';
import { MatDialog } from '@angular/material/dialog';
import FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { finalize } from 'rxjs/operators';
import { GeocodeService } from 'src/app/geocode.service';
import { ApiService } from 'src/app/api.service';

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Component({
  selector: 'app-employee-tracking',
  templateUrl: './employee-tracking.component.html',
  styleUrls: ['./employee-tracking.component.css']
})
export class EmployeeTrackingComponent implements OnInit {
  origin:any;
  destination:any;
  waypoints:any = [];
  zoom: number = 8;
  markers: marker[] = []
  // initial center position for the map
  lat: number = 51.673858;
  lng: number = 7.815982;
  rows: any;
  employeeId: any = '';
  jobno: any;
  employeetable:any;
  lat1!: number;
  lng1!: number;
  lat2!: number;
  lng2!: number;
  km!: number;
  comparekmvalue = [];
  calckmValue = [];
  removecalvalue = [];

  total_km = 0;

  renderOptions = {
    suppressMarkers: true,
  }
  fromDate = new Date();
  toDate = new Date();
  loading: boolean = false;

  constructor( private geocode: GeocodeService, private toastr: ToastrManager, private _api: ApiService, public dialog: MatDialog) { }

  ngOnInit() {

  }

  summaryExport() {
    let a = {
      "user_mobile_no": this.employeeId,
      "fromDate": this.fromDate,
      "toDate": this.toDate
    }
    this._api.location_calculate_employee(a).subscribe((response: any) => {
      let exportData = [];
      let totalKm = 0;

      response.Data.forEach((value:any) => {
        exportData.push({
          "Date": value.date,
          "Employee ID": value.empNo,
          "Employee Name": value.empName,
          "Branch": value.branch,
          "empType": value.empType,
          "Total KM": value.distance,
        });

        totalKm += value.distance;
      });

      const summaryRow = {
        "Date": "",
        "Employee ID": "",
        "Employee Name": "",
        "Branch": "",
        "empType": "Summary Km",
        "Total KM": totalKm
      };

      // Add Summary Km row
      exportData.push(summaryRow);

      const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData);

      const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
      const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      const data: Blob = new Blob([excelBuffer], { type: EXCEL_TYPE });
      FileSaver.saveAs(data, 'Employee Tracking Excel_export_' + new Date().getTime() + EXCEL_EXTENSION);
    });
  }

  employee_search(requestValue: string) {
    this.employeetable = true;
    this.loading = true;
    let a = {
      "user_mobile_no": this.employeeId,
      "fromDate": this.fromDate,
      "toDate": this.toDate
    }

    this.calckmValue = [];
    this.comparekmvalue = [];
    this.markers = [];
    this.waypoints = [];

    this.total_km = 0;

    this._api.employee_tracking(a).pipe(
      finalize(() => {
        this.loading = false;
      })
    ).subscribe(
      (response: any) => {
        this.rows = [];
        var index_value = 0;
        response.Data.forEach((element:any, idx:any) => {
          if (+element.loc_lat !== 0) {
            element.lat_value = +element.loc_lat;
            element.long_value = +element.loc_long;
            element.index = index_value;
            element.kmss = 0;
            element.address = +element.location_text;
            this.rows.push(element);
            this.markers.push({
              lat: element.loc_lat,
              lng: element.loc_long,
              label: "" + index_value,
              job_no: element.job_no,
              location_text: element.location_text,
              user_mobile_no: element.user_mobile_no,
              kms: 0,
              index: index_value,
            });
            index_value = index_value + 1;
          }
        });

        if (this.markers.length > 1) {
          this.origin = { lat: Number(this.markers[0].lat), lng: Number(this.markers[0].lng) };
          this.destination = { lat: Number(this.markers[0].lat), lng: Number(this.markers[0].lng) };
          console.log(this.origin);
          console.log(this.destination);
        }

        console.log(this.markers);
        console.log(this.waypoints);
        this.total_km = 0;
        this.recall(0).then((totalKm) => {
          console.log('Total KM:', totalKm, this.total_km);
          if (requestValue == "export") {
            let exportData:any[] = [];
            this.rows.forEach((value:any)=> {
              exportData.push({
                "Job No": value.job_no,
                "Service Type": value.km,
                "Complaint No": value.complaint_no,
                "User Mobile No": value.user_mobile_no,
                "Location Text": value.location_text,
                "Latitude": value.loc_lat,
                "Longitude": value.loc_long,
                "Date": value.date,
                "Remarks": value.remarks
              })
            });
            exportData[0]['Total KM'] = totalKm;
            const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData);
            const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
            const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
            const data: Blob = new Blob([excelBuffer], { type: EXCEL_TYPE });
            FileSaver.saveAs(data, 'Employee Tracking Excel_export_' + new Date().getTime() + EXCEL_EXTENSION);
          }
        });
      });
  }

  calculateDistance(lat1:any, lon1:any, lat2:any, lon2:any) {
    const deg2rad = (deg:any) => deg * (Math.PI / 180);
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in kilometers
    const roundedDistance = Number(distance.toFixed(2));
    return roundedDistance;
  };


  recall(index:any): Promise<number> {
    return new Promise<number>((resolve) => {
      let i = index;
      if (index < this.markers.length - 1) {
        let aa = this.markers[i];
        let bb = this.markers[i + 1];
        this.lat1 = +aa.lat;
        this.lng1 = +aa.lng;
        this.lat2 = +bb.lat;
        this.lng2 = +bb.lng;

        const distance = this.calculateDistance(this.lat1, this.lng1, this.lat2, this.lng2);
        this.km = distance;

        if (this.km !== 0) {
          this.origin = { lat: Number(this.lat1), lng: Number(this.lng1) };
          this.destination = { lat: Number(this.lat2), lng: Number(this.lng2) };
          this.waypoints.push({ location: { lat: Number(this.lat1), lng: Number(this.lng1) } });
        }

        this.total_km = this.total_km + this.km;
        this.markers[i + 1].kms = this.km / 1000;
        this.rows[i + 1].kms = this.km / 1000;
        console.log("====this.total_km", this.total_km, "===", this.km)
        index = index + 1;
        this.recall(index).then((totalKm) => {
          console.log("===totalKm", totalKm);
          resolve(totalKm);
        });
      } else {
        this.total_km = this.total_km / 1000;
        this.total_km = Math.round(this.total_km);
        resolve(this.total_km);
      }
    });
  }

  clickedMarker(label: string, index: number) {
  }

  mapClicked($event: MouseEvent) {
  }

  markerDragEnd(m: marker, $event: MouseEvent) {
  }

  getDistanceFromLatLonInKm() {

    var deg2Rad = (deg:any) => {
      return deg * Math.PI / 180;
    }

    this.lat1 = 8.186086238957166; this.lng1 = 77.4093668863787; this.lat2 = 8.188438713980196; this.lng2 = 77.42146405971492;
    var r = 6371;
    var dLat = deg2Rad(this.lat2 - this.lat1);
    var dLon = deg2Rad(this.lng2 - this.lng1);
    var a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2Rad(this.lat1)) * Math.cos(deg2Rad(this.lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    this.km = r * c; // Distance in km

  }

  employeepopup(item:any) {
    // const dialogRef = this.dialog.open(EmployeeTrackingeditComponent, {
    //   width: '300px',
    //   data: item,
    // });

    // dialogRef.afterClosed().subscribe(password => {




    // });
  }

  locationmap(e: any) {
    this.geocode.geocodeAddress(e.location_text)
      .subscribe((location: any) => {
        let a = {
          "_id": e._id,
          "loc_long": location.lng,
          "loc_lat": location.lat,
        }
        this._api.employee_jobwise(a)
          .subscribe((data: any) => {

            this.employee_search('search');
          })

      })
  }
}

// just an interface for type safety.
interface marker {
  lat: number;
  lng: number;
  job_no?: string;
  location_text?: string;
  user_mobile_no: number;
  index: number;
  label: String;
  kms: number;
}