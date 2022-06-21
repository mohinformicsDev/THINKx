// TODO: Replace this with your own data model type
export interface SensorModel {
  _id: number;
  name: string;
  syncfield: string;
  imageUrl: string;
  features: string[];
  armMessageToRead: string;
  armMessageToSend: string;
  disArmMessageToRead: string;
  disArmMessageToSend: string;
  setTimerMessageToRead: string;
  setTimerMessageToSend: string;
  getTimerMessageToRead: string;
  getTimerMessageToSend: string;
}
