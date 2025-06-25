import { OlympicService } from 'src/app/core/services/olympic.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { filter, take, switchMap, takeUntil } from 'rxjs/operators';
import { CountryOlympicData } from 'src/app/core/models/Olympic';
import { Subject } from 'rxjs';
import { ChartDataPoint, ChartSelectEvent } from 'src/app/core/models/Chart';

@Component({
  selector: 'app-medals-pie-chart',
  standalone: true,
  imports: [NgxChartsModule],
  templateUrl: './medals-pie-chart.component.html',
  styleUrls: ['./medals-pie-chart.component.scss'],
})
export class MedalsPieChartComponent implements OnInit {
  chartData: ChartDataPoint[] = []; 
  isLoading: boolean = true;
  error: string | null = null;

  private destroy$ = new Subject<void>();

  gradient: boolean = true;
  showLegend: boolean = false;
  showLabels: boolean = true;
  isDoughnut: boolean = false;
  colorScheme: string = "cool";

  constructor(private olympicService: OlympicService, private router: Router) {}

  ngOnInit(): void {
    this.loadChartData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadChartData(): void {
    this.isLoading = true;
    this.error = null;

    this.olympicService
      .loadInitialData()
      .pipe(
        switchMap(() => this.olympicService.getOlympics()),
        filter((data): data is CountryOlympicData[] => !!data),
        take(1)
      )
      .subscribe({
        next: (data) => {
          try {
            const medalData = this.olympicService.getMedalsByCountry();
            this.chartData = medalData.map((country) => ({
              name: country.name,
              value: country.totalMedals,
            }));

            this.isLoading = false;
          } catch (error) {
            console.error('Error formatting data:', error);
            this.error = 'Error while formatting data';
            this.isLoading = false;
          }
        },
        error: (error) => {
          console.error('Error loading data:', error);
          this.error = 'Error while loading data';
          this.isLoading = false;
        },
      });
  }

  retry(): void {
    this.loadChartData();
  }
  // Format the label for the pie chart
  labelFormatting = (label: string): string => {
    const item = this.chartData.find((data) => data.name === label);
    return item ? `${item.name}` : label;
  };

  onSelect(event: ChartSelectEvent): void {
    if (event?.name) {
      this.olympicService
        .getOlympics()
        .pipe(takeUntil(this.destroy$))
        .subscribe((countries) => {
          const selectedCountry = countries?.find(
            (country) =>
              country.country.toLowerCase() === event.name.toLowerCase()
          );

          if (selectedCountry) {
            this.router.navigate(['/country', selectedCountry.country]);
          }
        });
    }
  }
}
