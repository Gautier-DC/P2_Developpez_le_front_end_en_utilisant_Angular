// core/models/chart.model.ts
export interface ChartDataPoint {
  name: string;
  value: number;
  extra?: string | number | boolean | object;
}

export interface ChartSeries {
  name: string;
  series: ChartDataPoint[];
}

export type ChartData = ChartSeries[];

export interface OlympicChartSeries extends ChartSeries {
  name: string;
  series: Array<{
    name: string;
    value: number;
  }>;
}

export type OlympicChartData = OlympicChartSeries[];


export interface ChartSelectEvent {
  name: string;
  value: number;
  label?: string;
  series?: string;
}