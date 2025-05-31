import { Component, OnDestroy, OnInit } from '@angular/core';
import { WeatherWidgetComponent } from '../weather-widget/weather-widget.component';
import { FormsModule } from '@angular/forms';
import { WeatherService } from '../../services/weather.service';
import { CommonModule } from '@angular/common';
import { SavedCity } from '../../models/saved-city.model';
import { Subject, takeUntil } from 'rxjs';
import { SavedCitiesService } from '../../services/saved-cities.service';

const cityNotFoundMessage = 'City not found';
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [WeatherWidgetComponent, FormsModule, CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit , OnDestroy{
  destroyed = new Subject();
  cityName: string = '';
  geoCodingList: SavedCity[] = [];
  cityNotFoundMessage: string = '';

  constructor(
    private weatherSvc: WeatherService,
    private savedCitiesSvc: SavedCitiesService
  ) {}

  ngOnInit(): void {
    this.getAllCity();
  }

  clearCity() {
    this.cityName = '';
    this.cityNotFoundMessage = '';
  }

  onSubmit() {
    console.log('onSubmit()');
    this.weatherSvc.getCityGeocoding(this.cityName).subscribe({
      next: (resp: any) => {
        console.log(resp);
        if (resp.length > 0) {
          this.cityNotFoundMessage = '';
          const savedId = new Date().getTime().toString();
          this.savedCitiesSvc.addCity({
            id: savedId,
            name: this.cityName,
            lat: resp[0].lat,
            lon: resp[0].lon,
          });
          this.geoCodingList.push({
            id: savedId,
            name: this.cityName,
            lat: resp[0].lat,
            lon: resp[0].lon,
          });
          console.log(this.geoCodingList);
          this.cityName = '';
        } else {
          this.cityNotFoundMessage = cityNotFoundMessage;
        }
      },
      error: (err) => {},
    });
  }

  onRemove(index: number) {
    this.savedCitiesSvc.removeCity(this.geoCodingList[index]);
    this.geoCodingList.splice(index, 1);
  }

  handleInputChange($event: any) {
    if (this.cityNotFoundMessage) {
      this.cityNotFoundMessage = '';
    }
  }

  getAllCity() {
    this.savedCitiesSvc
      .getAllCity()
      .pipe(takeUntil(this.destroyed))
      .subscribe((cities) => {
        this.geoCodingList = cities;
      });
  }

  ngOnDestroy(): void {
    this.destroyed.next(true);
    this.destroyed.complete();
  }
}
