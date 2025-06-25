import { Component, inject, signal, computed, DestroyRef } from '@angular/core';
import { CountryOlympicData } from 'src/app/core/models/Olympic';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { HighlightComponent } from 'src/components/highlight/highlight.component';
import { MedalsPieChartComponent } from 'src/components/medals-pie-chart/medals-pie-chart.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HighlightComponent, MedalsPieChartComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  private olympicService = inject(OlympicService);
  private destroyRef = inject(DestroyRef);

  olympics = signal<CountryOlympicData[]>([]);
  isLoading = signal<boolean>(true);
  error = signal<string | null>(null);

  totalCountries = computed(() => this.olympics().length);

  totalOlympics = computed(() => {
    const data = this.olympics();
    if (!data.length) return 0;

    const allYears = data
      .flatMap((country) => country.participations)
      .map((participation) => participation.year);

    return new Set(allYears).size;
  });

  totalMedals = computed(() =>
    this.olympics().reduce(
      (total, country) =>
        total +
        country.participations.reduce((sum, p) => sum + p.medalsCount, 0),
      0
    )
  );

  totalAthletes = computed(() =>
    this.olympics().reduce(
      (total, country) =>
        total +
        country.participations.reduce((sum, p) => sum + p.athleteCount, 0),
      0
    )
  );

  hasData = computed(() => this.olympics().length > 0);

  constructor() {
    this.loadData();
  }

  retry(): void {
    this.loadData();
  }

  private loadData(): void {
    this.isLoading.set(true);
    this.error.set(null);

    this.olympicService
      .getOlympics()
      .pipe(takeUntilDestroyed(this.destroyRef)) // 🎯 Passe le DestroyRef
      .subscribe({
        next: (data) => {
          this.olympics.set(data || []);
          this.error.set(null);
          this.isLoading.set(false);
        },
        error: (error) => {
          console.error('Error loading olympics data:', error);
          this.olympics.set([]);
          this.error.set('Erreur lors du chargement des données olympiques');
          this.isLoading.set(false);
        },
      });
  }
}
