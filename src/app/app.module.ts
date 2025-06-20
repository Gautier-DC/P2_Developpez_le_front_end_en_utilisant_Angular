import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { NavComponent } from 'src/components/nav/nav.component';
import { OlympicService } from './core/services/olympic.service';
import { MedalsPieChartComponent } from 'src/components/medals-pie-chart/medals-pie-chart.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgxChartsModule } from '@swimlane/ngx-charts';

@NgModule({
  declarations: [AppComponent, HomeComponent, NotFoundComponent, ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CommonModule,
    RouterModule,
    NgxChartsModule,
    HttpClientModule,
    NavComponent,
    MedalsPieChartComponent,
    NavComponent
  ],
  providers: [OlympicService],
  bootstrap: [AppComponent],
})
export class AppModule {}
