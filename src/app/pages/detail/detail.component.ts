import { Component, inject, signal, computed } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { map, switchMap } from 'rxjs';
import { TitleCasePipe } from '@angular/common';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { CountryOlympicData } from 'src/app/core/models/Olympic';
import { HighlightComponent } from 'src/components/highlight/highlight.component';
import { CountryLineChartComponent } from 'src/components/country-line-chart/country-line-chart.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-detail',
  standalone: true,
  imports: [
    HighlightComponent,
    CountryLineChartComponent,
    TitleCasePipe,
    RouterModule,
  ],
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss'],
})
export class DetailComponent {
  private route = inject(ActivatedRoute);
  private olympicService = inject(OlympicService);

  country = signal<CountryOlympicData | null>(null);
  isLoading = signal<boolean>(true);
  error = signal<string | null>(null);

  countryName = computed(() => this.country()?.country || '');

  totalMedals = computed(
    () =>
      this.country()?.participations.reduce(
        (sum, p) => sum + p.medalsCount,
        0
      ) || 0
  );

  totalAthletes = computed(
    () =>
      this.country()?.participations.reduce(
        (sum, p) => sum + p.athleteCount,
        0
      ) || 0
  );

  totalParticipations = computed(
    () => this.country()?.participations.length || 0
  );

  constructor() {
    this.route.params.pipe(
      switchMap(params => {
        const countryName = params['country'];
        return this.olympicService.getOlympics().pipe(
          map(olympics => ({ countryName, olympics }))
        );
      }),
      takeUntilDestroyed()
    ).subscribe({
      next: ({ countryName, olympics }) => {
        this.loadCountryData(countryName, olympics);
      },
      error: (error) => {
        console.error('Error loading data:', error);
        this.error.set('Error while loading data');
        this.isLoading.set(false);
      }
    });
  }

  private loadCountryData(
    countryName: string,
    olympics: CountryOlympicData[]
  ): void {
    const countryData = olympics.find(
      (country) => country.country.toLowerCase() === countryName.toLowerCase()
    );

    if (countryData) {
      this.country.set(countryData);
      this.error.set(null);
    } else {
      this.country.set(null);
      this.error.set(`Country "${countryName}" not found`);
      console.warn('Country not found:', countryName);
    }

    this.isLoading.set(false);
  }
}
