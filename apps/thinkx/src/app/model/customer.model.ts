import { DeviceModel } from './device.model';

export interface CustomerModel {
  _id: string;
  name: string;
  email: string;
  mobile: string;
  oemId: string;
  devices: DeviceModel[];
  city: string;
  state: string;
  country: string;
  armSync: string;
  disArmSync: string;
  lockSync: string;
  unlockSync: string;
}
