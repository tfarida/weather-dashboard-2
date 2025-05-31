import { Injectable } from "@angular/core";
import { SavedCity } from "../models/saved-city.model";
import { Observable, of } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class SavedCitiesService {
    readonly STORAGE_NAME = 'saved_weather';

    addCity(payload: SavedCity): Observable<SavedCity> {
        const rawSavedCities = localStorage.getItem(this.STORAGE_NAME)

        let savedCities: SavedCity[] = []

        if (rawSavedCities) {
            savedCities = JSON.parse(rawSavedCities) as SavedCity[]
        }

        savedCities.push(payload)

        localStorage.setItem(this.STORAGE_NAME, JSON.stringify(savedCities));

        return of(payload)
    }

    removeCity(payload: SavedCity): void {
        const rawSavedCities = localStorage.getItem(this.STORAGE_NAME)

        if (rawSavedCities) {
            const savedCities = JSON.parse(rawSavedCities) as SavedCity[]

            const newSavedCities = savedCities.filter((s) => s.id !== payload.id)
            localStorage.setItem(this.STORAGE_NAME, JSON.stringify(newSavedCities));
        }
    }

    getAllCity(): Observable<SavedCity[]> {
        const rawSavedCities = localStorage.getItem(this.STORAGE_NAME)

        if (!rawSavedCities) return of([]);
        const savedCities = JSON.parse(rawSavedCities) as SavedCity[]
        return of(savedCities)
    }
}