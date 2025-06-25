import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { catchError, filter, map, tap } from 'rxjs/operators';
import { CountryOlympicData } from '../models/Olympic';
import { Participation } from '../models/Participation';

@Injectable({
  providedIn: 'root',
})
export class OlympicService {
  private olympicUrl = './assets/mock/olympic.json';
  private olympics$ = new BehaviorSubject<CountryOlympicData[] | null>(null);

  constructor(private http: HttpClient) {}

  loadInitialData() {
    return this.http.get<CountryOlympicData[]>(this.olympicUrl).pipe(
      tap((value) => {
        this.olympics$.next(value);
      }),
      catchError((error) => {
        console.error('Olympic service - Error while charging:', error);
        this.olympics$.next(null);
        return of(null);
      })
    );
  }

  getOlympics(): Observable<CountryOlympicData[]> {
    return this.olympics$.pipe(
      filter((data): data is CountryOlympicData[] => data !== null)
    );
  }

  getTotalOlympics(): Observable<number> {
    return this.olympics$.pipe(
      filter(
        (olympics): olympics is CountryOlympicData[] =>
          olympics !== null && olympics !== undefined
      ),
      map((olympics: CountryOlympicData[]) => {
        if (olympics.length === 0) return 0;

        const allYears = new Set<number>();
        olympics.forEach((country) => {
          country.participations.forEach((participation) => {
            allYears.add(participation.year);
          });
        });

        return allYears.size;
      })
    );
  }

  getTotalCountries(): number {
    const data = this.olympics$.value;
    return data ? data.length : 0;
  }

  getMedalsByCountry(): { name: string; totalMedals: number }[] {
    const data = this.olympics$.value;

    if (!data) return [];

    return data.map((country: CountryOlympicData) => ({
      name: country.country,
      totalMedals: country.participations.reduce(
        (sum: number, p: Participation) => sum + p.medalsCount,
        0
      ),
    }));
  }

  getCountryByName(countryName: string): CountryOlympicData | undefined {
    const olympics = this.olympics$.value;
    if (!olympics) {
      console.warn('Olympic service - No data loaded yet');
      return undefined;
    }

    const found = olympics.find(
      (country) => country.country.toLowerCase() === countryName.toLowerCase()
    );

    if (!found) {
      console.warn(`Country '${countryName}' not found`);
    }
    return found;
  }

  isDataLoaded(): boolean {
    return this.olympics$.value !== null;
  }

  refreshData(): Observable<CountryOlympicData[] | null> {
    this.olympics$.next(null); // Reset du cache
    return this.loadInitialData();
  }
}
