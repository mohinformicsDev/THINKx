export interface DeviceModel {
  _id: string;
  deviceId: string;
  customerId?: string;
  name: string;
  warrantyDays: number;
  devicePassword: string;
  manufactureDate: string;
  status: boolean;
  active: boolean;
  soldTo: string;
  productType: string;
  enrollmentDate: string;
}
