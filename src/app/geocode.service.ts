import { Injectable } from '@angular/core';
import { MapsAPILoader } from '@agm/core';
import { from, Observable } from 'rxjs';
import { of } from 'rxjs';
import { tap, map, switchMap } from 'rxjs/operators';

// import { Location } from './location-model';
export interface Location {
  lat: number;
  long: number;
}
declare var google: any;

@Injectable({
  providedIn: 'root'
})
export class GeocodeService {
  private geocoder: any;

  constructor(private mapLoader: MapsAPILoader) { }

  private initGeocoder() {
    this.geocoder = new google.maps.Geocoder();
  }

  private waitForMapsToLoad(): Observable<boolean> {
    if (!this.geocoder) {
      return from(this.mapLoader.load())
        .pipe(
          tap(() => this.initGeocoder()),
          map(() => true)
        );
    }
    return of(true);
  }

  geocodeAddress(location: string) {
    return this.waitForMapsToLoad().pipe(
      // filter(loaded => loaded),
      switchMap(() => {
        return new Observable(observer => {
          this.geocoder.geocode({ 'address': location }, (results: any, status: any) => {
            if (status == google.maps.GeocoderStatus.OK) {
              observer.next({
                lat: results[0].geometry.location.lat(),
                lng: results[0].geometry.location.lng()
              });
            } else {
              observer.next({ lat: 0, lng: 0 });
            }
            observer.complete();
          });
        })
      })
    )
  }
}