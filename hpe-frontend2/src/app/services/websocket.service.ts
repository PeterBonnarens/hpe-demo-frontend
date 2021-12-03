import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { CounterService } from './counter.service';
import { DrawingService } from './drawing.service';

@Injectable({
  providedIn: 'root',
})
export class WebsocketService {
  webSocket!: WebSocket;

  constructor(
    public drawingService: DrawingService,
    public counterService: CounterService
  ) {}

  public openWebSocket(model_name: string) {
    console.log('Opening WebSocket...');
    var url: string = environment.wsURL + model_name;
    this.webSocket = new WebSocket(url);

    this.webSocket.onopen = (event) => {
      console.log('WebSocket opened.');
    };

    this.webSocket.onmessage = (event) => {
      this.counterService.tick();
      switch (model_name) {
        case 'movenet_lightning':
          this.drawingService.drawMovenetBackend(JSON.parse(event.data)[0]);
      }
    };

    this.webSocket.onclose = (event) => {
      console.log('WebSocket closed.');
    };
  }

  public closeWebSocket() {
    console.log('Closing WebSocket...');
    this.webSocket.close();
  }
}
