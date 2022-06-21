import { FeatureType } from '../shared/feature-type.enum';
import { UserType } from '../shared/user-type.enum';
import { MessageModel } from './message.model';

/**
 * Feature model is to dynamcically provide new features in app
 * for new IOT devices features like battery status, signal strength
 */
export interface SensorFeatureModel {
  /**
   * id will be available only in receiving values
   */
  _id: string;
  name: string;
  syncfield:string;
  /**
   * Type of feature will be
   * Status : read only messages
   * Toggle : send and receive a message
   * Dropdown : send multiple messages, receive single message only
   * Timer : recevie and send messages
   * All above can features can receive messages
   * except status otheres can send message
   */
  featureType: FeatureType;
  messages: MessageModel[];
  /**
   * If editable that means user can enable/disable feature from mobile app
   * except status other fields are editable
   */
  isEditable: boolean;
  isEmergencyFeature: boolean;
  userType: UserType;
  hasValue: boolean;
  dropDownValue: string;
}
