export class DeviceHelper {
  static isTouchDevice(): boolean {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  }

  static isOldIosVersion(): boolean {
    return /iPhone OS (8|9|10|11|12|13)_/.test(navigator.userAgent);
  }
}
