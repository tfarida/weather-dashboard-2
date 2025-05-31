import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Coord, WeatherData } from '../models/weather-response.models';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
private baseWeatherURL = 'https://api.openweathermap.org/data/2.5/weather'
  private apiKey = '7495f3a6ce870e7ee84d1efd009bc7fd'
  private baseGeocodingURL = 'https://api.openweathermap.org/geo/1.0/direct'
  
  constructor(private http: HttpClient) {

   }

  getWeatherData(coord: Coord): Observable<WeatherData>{
    return this.http.get<WeatherData>(`${this.baseWeatherURL}?lat=${coord.lat}&lon=${coord.lon}&appid=${this.apiKey}` )
  }

  getCityGeocoding(cityName: string){
    return this.http.get(`${this.baseGeocodingURL}?q=${cityName}&appid=${this.apiKey}`)
  }
}
