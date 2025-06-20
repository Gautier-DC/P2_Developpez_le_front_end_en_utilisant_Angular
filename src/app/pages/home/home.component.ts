import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { CountryOlympicData } from 'src/app/core/models/Olympic';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { MedalsPieChartComponent } from 'src/components/medals-pie-chart/medals-pie-chart.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  public olympics$: Observable<CountryOlympicData[] | null | undefined > = of([]);
  totalOlympics$ = this.olympicService.getTotalOlympics();
  totalCountries$ = this.olympicService.getTotalCountries();
  
  constructor(private olympicService: OlympicService) {}
  
  ngOnInit(): void {
    this.olympics$ = this.olympicService.getOlympics();
    console.log('olympics', this.olympics$);
  }
}
