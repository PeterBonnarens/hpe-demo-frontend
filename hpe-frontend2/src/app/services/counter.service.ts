import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CounterService {
  counter = new BehaviorSubject<number>(0);
  decimalPlaces = 2;
  updateEachSecond = 1;
  decimalPlacesRatio: number = Math.pow(10, this.decimalPlaces);
  timeMeasurements: number[] = [];

  constructor() {}

  public tick() {
    this.timeMeasurements.push(performance.now());
    let msPassed =
      this.timeMeasurements[this.timeMeasurements.length - 1] -
      this.timeMeasurements[0];
    if (msPassed >= this.updateEachSecond * 1000) {
      this.counter.next(
        Math.round(
          (this.timeMeasurements.length / msPassed) *
            1000 *
            this.decimalPlacesRatio
        ) / this.decimalPlacesRatio
      );
      this.timeMeasurements = [];
    }
  }
}
