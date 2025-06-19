import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { CountryOlympicData } from '../models/Olympic';

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
    return this.http.get<CountryOlympicData[]>(this.olympicUrl).pipe(
      tap((value) => this.olympics$.next(value)),
      catchError((error, caught) => {
        // TODO: improve error handling
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

  getMedalsByCountry(): { name: string; totalMedals: number }[] {
    const data = this.olympics$.value;

    if (!data) return [];

    return data.map((country: CountryOlympicData) => ({
      name: country.country,
      totalMedals: country.participations.reduce(
        (sum: number, p: any) => sum + p.medalsCount,
        0
      ),
    }));
  }
}
