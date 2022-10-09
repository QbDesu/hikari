declare global {
  interface Window {
    mqtt: typeof import('mqtt');
  }
}
