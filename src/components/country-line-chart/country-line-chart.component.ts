import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  signal,
} from '@angular/core';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { CountryOlympicData } from 'src/app/core/models/Olympic';

@Component({
  selector: 'app-country-line-chart',
  standalone: true,
  imports: [NgxChartsModule],
  templateUrl: './country-line-chart.component.html',
  styleUrls: ['./country-line-chart.component.scss'],
})
export class CountryLineChartComponent implements OnChanges {
  @Input() country!: CountryOlympicData | null;

  isLoading = signal<boolean>(true);
  chartData: any[] = [];

  showXAxis: boolean = true;
  showYAxis: boolean = true;
  gradient: boolean = false;
  showLegend: boolean = false;
  showXAxisLabel: boolean = true;
  xAxisLabel: string = 'Dates';
  showYAxisLabel: boolean = true;
  timeline: boolean = false;
  colorScheme = {
    domain: [
      '#956065', // Bordeaux
      '#793D52', // Violet foncé
      '#9780A1', // Violet moyen
      '#89A1DB', // Bleu-violet
      '#B8CCE8', // Bleu clair
      '#9DC3E6', // Bleu très clair
      '#A67C8A',
      '#8B7BA8',
      '#A5B8E1',
      '#C8D5F0',
      '#B3A5C7',
      '#D0C2E0',
    ],
  };

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['country']) {
      this.isLoading.set(true);

      if (this.country) {
        this.prepareChartData();
      } else {
        this.isLoading.set(false);
      }
    }
  }

  private prepareChartData(): void {
    if (!this.country) {
      this.isLoading.set(false);
      return;
    }

    // formating data for ngx-charts
    const series = this.country.participations.map((participation) => ({
      name: participation.year.toString(),
      value: participation.medalsCount,
    }));

    // Format attendu par ngx-charts pour line chart
    this.chartData = [
      {
        name: this.country.country,
        series: series,
      },
    ];
    this.isLoading.set(false);
  }

  onSelect(event: any): void {
    console.log('Point sélectionné:', event);
  }
}
