import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; // ✅ Ajouter

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { OlympicService } from './core/services/olympic.service';
import { MedalsPieChartComponent } from 'src/components/medals-pie-chart/medals-pie-chart.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { HighlightComponent } from '../components/highlight/highlight.component';

@NgModule({
  declarations: [AppComponent, NotFoundComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    CommonModule,
    RouterModule,
    NgxChartsModule,
    HttpClientModule,
    MedalsPieChartComponent,
    HighlightComponent,
    HomeComponent,
  ],
  providers: [OlympicService],
  bootstrap: [AppComponent],
})
export class AppModule {}
