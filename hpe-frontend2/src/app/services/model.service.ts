import { Injectable } from '@angular/core';
import * as poseDetection from '@tensorflow-models/pose-detection';
// Register one of the TF.js backends.
import '@tensorflow/tfjs-backend-webgl';

@Injectable({
  providedIn: 'root',
})
export class ModelService {
  constructor() {}

  public async getDetector(model_name: string) {
    console.log('Loading detector...');
    var modelType: any;
    var model: any;

    switch (model_name) {
      case 'movenet_lightning':
        modelType = poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING;
        model = poseDetection.SupportedModels.MoveNet;
        break;
      case 'movenet_thunder':
        modelType = poseDetection.movenet.modelType.SINGLEPOSE_THUNDER;
        model = poseDetection.SupportedModels.MoveNet;
        break;
      default:
        modelType = poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING;
        model = poseDetection.SupportedModels.MoveNet;
    }

    return await poseDetection.createDetector(model, { modelType: modelType });
    // poseDetection
    //   .createDetector(model, { modelType: modelType })
    //   .then((detector) => {
    //     console.log(detector);
    //     return detector;
    //   })
    //   .catch((err) => {
    //     console.log('Error while creating detector: ', err);
    //   });
  }
}
