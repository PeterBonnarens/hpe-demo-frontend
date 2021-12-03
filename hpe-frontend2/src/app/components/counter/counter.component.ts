import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { CounterService } from 'src/app/services/counter.service';

@Component({
  selector: 'app-counter',
  templateUrl: './counter.component.html',
  styleUrls: ['./counter.component.css'],
})
export class CounterComponent implements OnInit {
  counter: number = 0;

  subscription!: Subscription;

  constructor(public counterService: CounterService) {}

  ngOnInit(): void {
    this.subscription = this.counterService.counter.subscribe((ctr) => {
      this.counter = ctr;
    });
  }
}
