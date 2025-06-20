import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { catchError, filter, map, tap } from 'rxjs/operators';
import { CountryOlympicData } from '../models/Olympic';
import { Participation } from '../models/Participation';

@Injectable({
  providedIn: 'root',
})
export class OlympicService {
  private olympicUrl = './assets/mock/olympic.json';
  private olympics$ = new BehaviorSubject<
    CountryOlympicData[] | null | undefined
  >(undefined);

  constructor(private http: HttpClient) {}

  loadInitialData() {
      console.log('Olympic service - Tentative de chargement des données...');

    return this.http.get<CountryOlympicData[]>(this.olympicUrl).pipe(
      tap((value) => {console.log('Olympics service données reçues:', value);this.olympics$.next(value)}),
      catchError((error, caught) => {
        // TODO: improve error handling
        console.error('Olympic service - Erreur lors du chargement:', error);
        console.error(error);
        // can be useful to end loading state and let the user know something went wrong
        this.olympics$.next(null);
        return caught;
      })
    );
  }

  getOlympics(): Observable<CountryOlympicData[] | null | undefined> {
    return this.olympics$.asObservable();
  }

getTotalOlympics(): Observable<number> {
  return this.olympics$.pipe(
    filter((olympics): olympics is CountryOlympicData[] => olympics !== null && olympics !== undefined),
    map((olympics: CountryOlympicData[]) => {
      if (olympics.length === 0) return 0;
      
      const allYears = new Set<number>();
      olympics.forEach(country => {
        country.participations.forEach(participation => {
          allYears.add(participation.year);
        });
      });
      
      return allYears.size;
    })
  );
}

getTotalCountries(): Observable<number> {
  return this.olympics$.pipe(
    filter((olympics): olympics is CountryOlympicData[] => olympics !== null && olympics !== undefined),
    map((olympics: CountryOlympicData[]) => olympics.length)
  );
}


  getMedalsByCountry(): { name: string; totalMedals: number }[] {
    const data = this.olympics$.value;
    console.log('getMedalsByCountry', data);

    if (!data) return [];

    return data.map((country: CountryOlympicData) => ({
      name: country.country,
      totalMedals: country.participations.reduce(
        (sum: number, p: Participation) => sum + p.medalsCount,
        0
      ),
    }));
  }
}
