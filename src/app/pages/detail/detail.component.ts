import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { TitleCasePipe } from '@angular/common';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { CountryOlympicData } from 'src/app/core/models/Olympic';
import { HighlightComponent } from 'src/components/highlight/highlight.component';
import { CountryLineChartComponent } from 'src/components/country-line-chart/country-line-chart.component';

@Component({
  selector: 'app-detail',
  standalone: true,
  imports: [HighlightComponent, CountryLineChartComponent, TitleCasePipe],
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss'],
})
export class DetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private olympicService = inject(OlympicService);

  country = signal<CountryOlympicData | null>(null);
  isLoading = signal<boolean>(true);

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

  async ngOnInit(): Promise<void> {
    try {
      const params = await firstValueFrom(this.route.params);
      const countryName = params['country'];

      console.log('Searching for country:', countryName);

      const olympics = await firstValueFrom(this.olympicService.getOlympics());
      console.log('Olympics data loaded:', olympics);

      if (olympics) {
        const countryData = this.olympicService.getCountryByName(countryName);
        console.log('Found country:', countryData);
        this.country.set(countryData || null);
      }
    } catch (error) {
      console.error('Error loading country data:', error);
      this.country.set(null);
    } finally {
      this.isLoading.set(false);
    }
  }
}
