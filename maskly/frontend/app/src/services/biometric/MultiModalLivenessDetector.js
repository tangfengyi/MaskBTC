import { IntelRealSense } from './sensors/IntelRealSense';
import { FLIRLepton3 } from './sensors/FLIRLepton3';
import { DeepPhysModel } from './models/DeepPhysModel';
import { AWR1843Boost } from './sensors/AWR1843Boost';

class MultiModalLivenessDetector {
  constructor() {
    this.modalities = {
      '3d_face': new IntelRealSense(),
      'thermal': new FLIRLepton3(),
      'micro_exp': new DeepPhysModel(),
      'mmWave': new AWR1843Boost(60)
    };
  }

  async verify(frame) {
    const scores = {};
    for (const [modName, sensor] of Object.entries(this.modalities)) {
      scores[modName] = await sensor.analyze(frame);
    }
    
    const weights = this.calculateThreatWeights(scores);
    const finalScore = Object.keys(scores).reduce(
      (sum, mod) => sum + scores[mod] * weights[mod], 0);
    
    return finalScore > 0.92;
  }

  calculateThreatWeights(scores) {
    // 动态调整权重以应对特定攻击模式
    const baseWeights = { '3d_face': 0.4, 'thermal': 0.3, 
                        'micro_exp': 0.2, 'mmWave': 0.1 };
    const anomalyDetected = Object.values(scores).some(s => s < 0.5);
    
    return anomalyDetected ? 
      { '3d_face': 0.3, 'thermal': 0.3, 'micro_exp': 0.2, 'mmWave': 0.2 } :
      baseWeights;
  }
}

export default MultiModalLivenessDetector;
