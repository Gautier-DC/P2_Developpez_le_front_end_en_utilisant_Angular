import { Component, OnInit, inject, signal, computed} from '@angular/core';
import { CountryOlympicData } from 'src/app/core/models/Olympic';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { HighlightComponent } from 'src/components/highlight/highlight.component';
import { MedalsPieChartComponent } from 'src/components/medals-pie-chart/medals-pie-chart.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HighlightComponent, MedalsPieChartComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  private olympicService = inject(OlympicService);

  olympics = signal<CountryOlympicData[]>([]);
  
  totalOlympics = computed(() => this.olympics().length);
  totalCountries = computed(() => this.olympics().length);

  ngOnInit(): void {
    this.olympicService.getOlympics().subscribe(data => {
      this.olympics.set(data || []);
    });
  }
}
