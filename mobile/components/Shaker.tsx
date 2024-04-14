import {Accelerometer} from 'expo-sensors';
//this is shake sensitivity - lowering this will give high sensitivity and increasing this will give lower sensitivity
const THRESHOLD = 150;

export default class ShakeEventExpo {
  static addListener(handler) {
    let last_x: number, last_y: number, last_z: number;
    let lastUpdate = 0;
    Accelerometer.addListener(accelerometerData => {
      const {x, y, z} = accelerometerData;
      const currTime = Date.now();
      if (currTime - lastUpdate > 100) {
        const diffTime = currTime - lastUpdate;
        lastUpdate = currTime;
        const speed =
          (Math.abs(x + y + z - last_x - last_y - last_z) / diffTime) * 10000;
        if (speed > THRESHOLD) handler();

        last_x = x;
        last_y = y;
        last_z = z;
      }
    });
  }
  static removeListener() {
    Accelerometer.removeAllListeners();
  }
}
