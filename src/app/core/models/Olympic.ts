import { Participation } from './Participation';
export class CountryOlympicData {
  constructor(
    public id: number,
    public country: string,
    public participations: Participation[]
  ) {}
}
