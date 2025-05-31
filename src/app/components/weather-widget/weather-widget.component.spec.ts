import { ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { WeatherWidgetComponent } from './weather-widget.component';
import { WeatherService } from '../../services/weather.service';
import { MockWeatherService } from '../dashboard/dashboard.component.spec';

describe('WeatherWidgetComponent', () => {
  let component: WeatherWidgetComponent;
  let fixture: ComponentFixture<WeatherWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WeatherWidgetComponent],
      providers: [
        { provide: WeatherService, useClass: MockWeatherService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(WeatherWidgetComponent);
    component = fixture.componentInstance;
    component.cityName = 'Jakarta';
    component.latitude = -6.2;
    component.longitude = 106.8;
    component.isLoading = false
    fixture.detectChanges();
  });

  it('should render city name, temperature, min/max, feels like, and weather description', fakeAsync(() => {
    component.isLoading = false
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;

    // Assert city name
    expect(compiled.querySelector('[data-testid="city_name"]')?.textContent).toContain('Jakarta');
    // Assert temperature
    expect(compiled.querySelector('[data-testid="temp"]')?.textContent).toContain('29°C');
    // Assert min/max temperature
    expect(compiled.querySelector('[data-testid="temp_min_max"]')?.textContent).toContain('28°C / 30°C');
    // Assert feels like
    expect(compiled.querySelector('[data-testid="feels_like"]')?.textContent).toContain('Feels like: 35°C');
    // Assert weather description
    expect(compiled.querySelector('[data-testid="weather_description"]')?.textContent?.toLowerCase()).toContain('haze');
  }));
});