import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  signal,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { CountryOlympicData } from 'src/app/core/models/Olympic';
import { ChartData } from 'src/app/core/models/Chart';
@Component({
  selector: 'app-country-line-chart',
  standalone: true,
  imports: [NgxChartsModule, RouterModule],
  templateUrl: './country-line-chart.component.html',
  styleUrls: ['./country-line-chart.component.scss'],
})
export class CountryLineChartComponent implements OnChanges {
  @Input() country!: CountryOlympicData | null;

  chartData = signal<ChartData>([]);
  isLoading = signal<boolean>(false);
  chartError = signal<string | null>(null);

  showXAxis: boolean = true;
  showYAxis: boolean = true;
  gradient: boolean = false;
  showLegend: boolean = false;
  showXAxisLabel: boolean = true;
  xAxisLabel: string = 'Dates';
  showYAxisLabel: boolean = true;
  timeline: boolean = false;
  colorScheme: string = 'cool';

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['country'] && this.country) {
      this.generateChartData();
    }
  }

  retry(): void {
    if (this.country) {
      this.generateChartData();
    }
  }

  private generateChartData(): void {
    this.isLoading.set(true);
    this.chartError.set(null);

    try {
      if (!this.country) {
        this.chartError.set('No country set');
        this.isLoading.set(false);
        return;
      }

      if (!this.country.participations?.length) {
        this.chartError.set('No data for this country');
        this.chartData.set([]);
        this.isLoading.set(false);
        return;
      }

      const data = this.transformToChartData(this.country);
      this.chartData.set(data);
      this.isLoading.set(false);
    } catch (error) {
      console.error('Chart generation error:', error);
      this.chartError.set('Can not load the chart');
      this.isLoading.set(false);
    }
  }

  private transformToChartData(country: CountryOlympicData): ChartData {
    return [
      {
        name: country.country,
        series: country.participations.map((p) => ({
          name: p.year.toString(),
          value: p.medalsCount,
        })),
      },
    ];
  }
}
