import { Component, OnInit } from '@angular/core';
import { DrawingService } from 'src/app/services/drawing.service';

@Component({
  selector: 'app-canvas-view',
  templateUrl: './canvas-view.component.html',
  styleUrls: ['./canvas-view.component.css'],
})
export class CanvasViewComponent implements OnInit {
  constructor(public drawingService: DrawingService) {}

  video: any;
  canvas: any;
  ctx: any;
  cameraOn: boolean = false;

  ngOnInit(): void {
    this.video = document.getElementById('webcam');
    this.canvas = document.getElementById('canvas');
    this.ctx = this.canvas.getContext('2d');
    this.drawingService.setContext(this.ctx);
    this.drawingService.setVideo(this.video);
  }

  startCamera() {
    navigator.mediaDevices
      .getUserMedia({
        video: { width: 640, height: 480 },
        audio: false,
      })
      .then((stream) => {
        this.video.srcObject = stream;
        this.cameraOn = true;
      });
  }

  stopCamera() {
    this.video.srcObject
      .getTracks()
      .forEach((track: { stop: () => any }) => track.stop());
    this.cameraOn = false;
  }
}
