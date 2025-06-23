import { OlympicService } from 'src/app/core/services/olympic.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { filter, take, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-medals-pie-chart',
  standalone: true,
  imports: [NgxChartsModule],
  templateUrl: './medals-pie-chart.component.html',
  styleUrls: ['./medals-pie-chart.component.scss'],
})
export class MedalsPieChartComponent implements OnInit {
  single: any[] = [];
  chartData: any[] = [];
  gradient: boolean = true;
  showLegend: boolean = false;
  showLabels: boolean = true;
  isDoughnut: boolean = false;
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

  constructor(private olympicService: OlympicService, private router: Router) {}

  ngOnInit() {
    this.olympicService
      .loadInitialData()
      .pipe(
        switchMap(() => this.olympicService.getOlympics()),
        filter((data) => data !== undefined && data !== null),
        take(1)
      )
      .subscribe((data) => {
        const medalData = this.olympicService.getMedalsByCountry();

        // formating data for ngx-charts
        this.chartData = medalData.map((country) => ({
          name: country.name,
          value: country.totalMedals,
        }));
      });
  }

  labelFormatting = (label: string) => {
    const item = this.chartData.find((data) => data.name === label);
    return `${item.name}`;
  };

  
  onSelect(event: any) {
    const country = event.name.toLowerCase();
    this.router.navigate([`/country/${country}`]);
  }
}
