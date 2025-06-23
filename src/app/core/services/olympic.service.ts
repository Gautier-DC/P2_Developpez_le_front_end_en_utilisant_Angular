import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, take } from 'rxjs';
import { catchError, filter, map, tap } from 'rxjs/operators';
import { CountryOlympicData } from '../models/Olympic';
import { Participation } from '../models/Participation';

@Injectable({
  providedIn: 'root',
})
export class OlympicService {
  private olympicUrl = './assets/mock/olympic.json';
  private olympics$ = new BehaviorSubject<
    CountryOlympicData[] | null
  >(null);

  constructor(private http: HttpClient) {}

  loadInitialData() {
    return this.http.get<CountryOlympicData[]>(this.olympicUrl).pipe(
      tap((value) => {
        this.olympics$.next(value);
      }),
      catchError((error, caught) => {
        console.error('Olympic service - Error while charging:', error);
       this.olympics$.next(null);
        return caught;
      })
    );
  }

  getOlympics(): Observable<CountryOlympicData[] | null> {
    // if data has been charged
    if (this.olympics$.value !== null) {
      console.log('Data already cached', this.olympics$.value);
      return this.olympics$.asObservable();
    }

    return this.olympics$.pipe(
      filter((data) => data !== null),
      take(1)
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

  getTotalCountries(): Observable<number> {
    return this.olympics$.pipe(
      filter(
        (olympics): olympics is CountryOlympicData[] =>
          olympics !== null && olympics !== undefined
      ),
      map((olympics: CountryOlympicData[]) => olympics.length)
    );
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
    if (!olympics) return undefined;

    const found = olympics.find(
      (country) => country.country.toLowerCase() === countryName.toLowerCase()
    );

    console.log('getCountryByName - found:', found);
    return found;
  }
}
