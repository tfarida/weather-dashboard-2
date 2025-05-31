import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { Main, WeatherData } from '../../models/weather-response.models';
import { WeatherService } from '../../services/weather.service';

@Component({
  selector: 'app-weather-widget',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './weather-widget.component.html',
  styleUrl: './weather-widget.component.css'
})
export class WeatherWidgetComponent implements OnInit{
 @Input()
  cityName: string = ''
  @Input()
  latitude: number = 0
  @Input()
  longitude: number = 0

  weatherData: WeatherData = {} as WeatherData
  isLoading = false;

  constructor(private weatherSvc: WeatherService){

  }
  ngOnInit(): void {
    this.weatherData = {
      main: {} as Main,
    } as WeatherData
    this.getWeatherData()
    console.log(this.weatherData);
  }

  getWeatherData(){
    this.isLoading = true;
    this.weatherSvc.getWeatherData({lat: this.latitude, lon: this.longitude})
    .subscribe((response) =>{
      this.setWeatherData(response)
      setTimeout(() => {
        this.isLoading = false
      }, 2000)
    })
  }

  setWeatherData(data: any){
    this.weatherData = data;
    this.weatherData.temp_celcius = (this.weatherData.main.temp - 273.15).toFixed(0);
    this.weatherData.temp_min = (this.weatherData.main.temp_min - 273.15).toFixed(0);
    this.weatherData.temp_max = (this.weatherData.main.temp_max - 273.15).toFixed(0);
    this.weatherData.temp_feels_like = (this.weatherData.main.feels_like - 273.15).toFixed(0);   
  }

  getWeatherIcon(){
    var iconcode = this.weatherData.weather[0].icon;
    var iconurl = "http://openweathermap.org/img/w/" + iconcode + ".png";
    return iconurl;
  }
}
