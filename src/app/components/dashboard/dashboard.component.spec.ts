import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { DashboardComponent } from './dashboard.component';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Component, Input } from '@angular/core';
import { of } from 'rxjs';
import { WeatherService } from '../../services/weather.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-weather-widget',
  template: '<div></div>',
  standalone: true
})
class MockWeatherWidgetComponent {
  @Input() cityName: string = '';
  @Input() latitude: number = 0;
  @Input() longitude: number = 0;
}

export const mockWeatherData = { "coord": { "lon": 106.8272, "lat": -6.1754 }, "weather": [{ "id": 721, "main": "Haze", "description": "haze", "icon": "50d" }], "base": "stations", "main": { "temp": 302.4, "feels_like": 308.6, "temp_min": 300.96, "temp_max": 303.39, "pressure": 1013, "humidity": 80, "sea_level": 1013, "grnd_level": 1010 }, "visibility": 5000, "wind": { "speed": 2.57, "deg": 220 }, "clouds": { "all": 20 }, "dt": 1748653874, "sys": { "type": 1, "id": 9383, "country": "ID", "sunrise": 1748645813, "sunset": 1748688249 }, "timezone": 25200, "id": 1631845, "name": "Jakarta", "cod": 200 }

export class MockWeatherService {
  getWeatherData(params: {lat: number, lon: number}) {
    return of({ "coord": { "lon": 106.8272, "lat": -6.1754 }, "weather": [{ "id": 721, "main": "Haze", "description": "haze", "icon": "50d" }], "base": "stations", "main": { "temp": 302.4, "feels_like": 308.6, "temp_min": 300.96, "temp_max": 303.39, "pressure": 1013, "humidity": 80, "sea_level": 1013, "grnd_level": 1010 }, "visibility": 5000, "wind": { "speed": 2.57, "deg": 220 }, "clouds": { "all": 20 }, "dt": 1748653874, "sys": { "type": 1, "id": 9383, "country": "ID", "sunrise": 1748645813, "sunset": 1748688249 }, "timezone": 25200, "id": 1631845, "name": "Jakarta", "cod": 200 });
  }
  getCityGeocoding() {
    return of([{ name: 'Jakarta', lat: 51.5074, lon: -0.1278 }]);
  }
}


describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        FormsModule,
        DashboardComponent,
        MockWeatherWidgetComponent,
      ],
      providers: [
        { provide: WeatherService, useClass: MockWeatherService }
      ]
    })
    .overrideComponent(DashboardComponent, {
      set: {
        imports: [MockWeatherWidgetComponent, FormsModule, CommonModule]
      }
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should add city and render app-weather-widget-main', fakeAsync(() => {
    const mockInput = {
      city: 'Jakarta'
    }

    const input = fixture.debugElement.query(By.css('input[name="city"]')).nativeElement;
    input.value = mockInput.city;
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    const form = fixture.debugElement.query(By.css('form'));
    component.geoCodingList = [];
    component.cityName = mockInput.city;
    spyOn(component, 'onSubmit').and.callFake(() => {
      component.geoCodingList.push({ id: new Date().getTime().toString(), name: mockInput.city, lat: 51.5074, lon: -0.1278 });
    });
    form.triggerEventHandler('submit', null);
    fixture.detectChanges();
    tick();

    const widgets = fixture.debugElement.queryAll(By.directive(MockWeatherWidgetComponent));
    expect(widgets.length).toBe(1);
    expect(widgets[0].componentInstance.cityName).toBe(mockInput.city);
  }));
});