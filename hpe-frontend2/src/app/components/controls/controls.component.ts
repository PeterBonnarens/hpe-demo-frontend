import { Component, OnInit } from '@angular/core';
import { CounterService } from 'src/app/services/counter.service';
import { DrawingService } from 'src/app/services/drawing.service';
import { ModelService } from 'src/app/services/model.service';
import { WebsocketService } from 'src/app/services/websocket.service';

@Component({
  selector: 'app-controls',
  templateUrl: './controls.component.html',
  styleUrls: ['./controls.component.css'],
})
export class ControlsComponent implements OnInit {
  runningFrontendModel: boolean = false;
  runningBackendModel: boolean = false;

  supportedModelsFrontend: string[] = ['movenet_lightning', 'movenet_thunder'];
  selectedModelFrontend: string;

  supportedModelsBackend: string[] = ['movenet_lightning', 'movenet_thunder'];
  selectedModelBackend: string;

  private detector: any;

  constructor(
    public webSocketService: WebsocketService,
    public modelService: ModelService,
    public drawingService: DrawingService,
    public counterService: CounterService
  ) {
    this.selectedModelFrontend = this.supportedModelsFrontend[0];
    this.selectedModelBackend = this.supportedModelsBackend[0];
  }

  ngOnInit(): void {
    this.runningFrontendModel = false;
    this.runningBackendModel = false;
  }

  async runFrontendModel() {
    this.runningFrontendModel = true;
    this.detector = await this.modelService.getDetector(
      this.selectedModelFrontend
    );

    if (this.detector) {
      console.log('Running frontend model...');
      requestAnimationFrame(() => {
        this.run(this.detector);
      });
    }
  }

  stopFrontendModel() {
    this.detector = null;
    this.runningFrontendModel = false;
    console.log('Stopped running frontend model.');
  }

  runBackendModel() {
    this.webSocketService.openWebSocket(this.selectedModelBackend);
    this.runningBackendModel = true;
  }

  stopBackendModel() {
    this.webSocketService.closeWebSocket();
    this.runningBackendModel = false;
  }

  private async run(detector: any) {
    if (this.runningFrontendModel) {
      this.counterService.tick();
      const poses = await this.detector.estimatePoses(
        this.drawingService.video
      );
      if (poses && poses.length > 0) {
        this.drawingService.drawMovenetFrontend(poses[0]);
      }
      requestAnimationFrame(() => {
        this.run(detector);
      });
    }
  }
}
