import { Injectable } from '@angular/core';

export const COLOR = 'aqua';
export const LINEWIDTH = 2;
export const MIN_CONF_MOVENET = 0.3;

// see the keypoint diagram at https://github.com/tensorflow/tfjs-models/tree/master/pose-detection
export const MOVENET_KEYPOINTS = [
  [0, 1],
  [0, 2],
  [1, 3],
  [2, 4],
  [5, 6],
  [5, 7],
  [6, 8],
  [7, 9],
  [8, 10],
  [5, 11],
  [6, 12],
  [11, 12],
  [11, 13],
  [12, 14],
  [13, 15],
  [14, 16],
];

@Injectable({
  providedIn: 'root',
})
export class DrawingService {
  constructor() {}

  ctx: any;
  video: any;

  public setContext(ctx: any) {
    this.ctx = ctx;
  }

  public setVideo(video: any) {
    this.video = video;
  }

  public drawMovenetBackend(
    keypoints: number[][],
    scale = 1,
    minConfidence = MIN_CONF_MOVENET
  ) {
    this.ctx.canvas.width = this.video.videoWidth;
    this.ctx.canvas.height = this.video.videoHeight;

    // Draw keypoints
    for (let i = 0; i < keypoints.length; i++) {
      const keypoint = keypoints[i];

      if (keypoint[2] < minConfidence) {
        continue;
      }

      const x = keypoint[1] * this.ctx.canvas.width;
      const y = keypoint[0] * this.ctx.canvas.height;

      this.drawPoint(y * scale, x * scale, 3, COLOR);
    }

    // Draw skeleton
    MOVENET_KEYPOINTS.forEach((kp_pair) => {
      if (
        keypoints[kp_pair[0]][2] >= minConfidence &&
        keypoints[kp_pair[1]][2] >= minConfidence
      ) {
        this.drawSegment(
          this.toTuple(
            keypoints[kp_pair[0]][0] * this.ctx.canvas.height,
            keypoints[kp_pair[0]][1] * this.ctx.canvas.width
          ),
          this.toTuple(
            keypoints[kp_pair[1]][0] * this.ctx.canvas.height,
            keypoints[kp_pair[1]][1] * this.ctx.canvas.width
          ),
          COLOR,
          scale
        );
      }
    });
  }

  public drawMovenetFrontend(
    keypoints: any,
    scale = 1,
    minConfidence = MIN_CONF_MOVENET
  ) {
    this.ctx.canvas.width = this.video.videoWidth;
    this.ctx.canvas.height = this.video.videoHeight;

    const kp = keypoints.keypoints;

    // Draw keypoints
    for (let i = 0; i < kp.length; i++) {
      const keypoint = kp[i];

      if (keypoint.score < minConfidence) {
        continue;
      }

      const x = this.ctx.canvas.width - keypoint.x;
      const y = keypoint.y;

      this.drawPoint(y * scale, x * scale, 3, COLOR);
    }

    // Draw skeleton
    MOVENET_KEYPOINTS.forEach((kp_pair) => {
      if (
        kp[kp_pair[0]].score >= minConfidence &&
        kp[kp_pair[1]].score >= minConfidence
      ) {
        this.drawSegment(
          this.toTuple(
            kp[kp_pair[0]].y,
            this.ctx.canvas.width - kp[kp_pair[0]].x
          ),
          this.toTuple(
            kp[kp_pair[1]].y,
            this.ctx.canvas.width - kp[kp_pair[1]].x
          ),
          COLOR,
          scale
        );
      }
    });
  }

  /**
   * Private functions
   */
  private drawPoint(y: number, x: number, r: number, color: string) {
    this.ctx.beginPath();
    this.ctx.arc(x, y, r, 0, 2 * Math.PI);
    this.ctx.fillStyle = color;
    this.ctx.fill();
  }

  private drawSegment(
    [ay, ax]: number[],
    [by, bx]: number[],
    color: string,
    scale: number
  ) {
    this.ctx.beginPath();
    this.ctx.moveTo(ax * scale, ay * scale);
    this.ctx.lineTo(bx * scale, by * scale);
    this.ctx.lineWidth = LINEWIDTH;
    this.ctx.strokeStyle = color;
    this.ctx.stroke();
  }

  private toTuple(y: number, x: number) {
    return [y, x];
  }
}
