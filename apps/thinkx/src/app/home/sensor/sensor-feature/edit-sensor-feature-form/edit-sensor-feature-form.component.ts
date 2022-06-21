import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ɵɵtrustConstantResourceUrl } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from 'apps/thinkx/src/app/shared/service/common.service';
// import { CommonService } from '../../../../home/common.service';
import { MessageModel } from '../../../../model/message.model';
import { SensorFeatureModel } from '../../../../model/sensor-feature.model';
import { FeatureType } from '../../../../shared/feature-type.enum';
import { HttpService } from '../../../../shared/http-service.service';
import { LoadingOption } from '../../../../shared/loading-options.enum';

export interface Action {
  name: string; // action 1, action 2, action 3,
  value: string; // read/get status, send/update status, textvalue
}

@Component({
  selector: 'thinkx-edit-sensor-feature-form',
  templateUrl: './edit-sensor-feature-form.component.html',
  styleUrls: ['./edit-sensor-feature-form.component.scss'],
})
export class EditSensorFeatureFormComponent implements OnInit {
  submitted = false;
  id: string | null = null;
  isLoading = true;
  isLoadingType: LoadingOption = LoadingOption.NEW;

  editSensorFeatureForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    syncfield: new FormControl('', [Validators.required]),
    featureType: new FormControl('', [Validators.required]),
    isEditable: new FormControl(false, [Validators.required]),
    isEmergencyFeature: new FormControl(false, [Validators.required]),
    hasValue: new FormControl(false, [Validators.required]),
    dropDownValue: new FormControl('', [])
  });
  hasValue:boolean;
  enableDropDownValue: boolean;

  options: string[] = [];
  types: FeatureType[] = [];

  // dynamic messages
  itemArray: FormArray;
  messageGroupForm: FormGroup;

  // options for actions
  actions: Action[] = [];

  constructor(
    private _fb: FormBuilder,
    private _commonService: CommonService,
    private _httpService: HttpService,
    private _activatedRoute: ActivatedRoute,
    private _router: Router
  ) {
    this._commonService.setTitle('Sensor');
    this.itemArray = new FormArray([]);
    this.messageGroupForm = this._fb.group({
      items: this._fb.array([this.createItem()]),
    });
    this.hasValue = false;
    this.enableDropDownValue= false;
  }

  ngOnInit(): void {
    this.id = this._activatedRoute.snapshot.paramMap.get('id');
    this.editSensorFeatureForm.addControl('messages', this.messageGroupForm);
    const features = Object(FeatureType);
    for (const key in features) {
      if (Object.prototype.hasOwnProperty.call(features, key)) {
        if(features[key] == FeatureType.STATUS || features[key] == FeatureType.TOGGLE || features[key] == FeatureType.DROPDOWN){
          this.options.push(features[key]);
        }
      }
    }

    if (this.id !== null) {
      this.getResponse(this.id);
    }
  }

  get loadingOption() {
    return LoadingOption;
  }

  get f() {
    return this.editSensorFeatureForm.controls;
  }

  get items(): FormArray {
    return this.messageGroupForm.get('items') as FormArray;
  }

  // getter Function for Individual Dynamic Group
  getGroup(i: number) {
    const temp = this.messageGroupForm.get('items') as FormArray;
    return temp.controls[i] as FormGroup;
  }

  getControlProperty(i: number) {
    const formGroup = this.getGroup(i) as FormGroup;
    return formGroup.controls.messageToRead as FormControl;
  }

  getControlValue(i: number) {
    const formGroup = this.getGroup(i) as FormGroup;
    return formGroup.controls.actionToPerform as FormControl;
  }

  async getResponse(id: string) {
    try {
      const data = await this._httpService.get<SensorFeatureModel[]>(`/sensor-feature/${id}`);

      const element = data[0];
      this.editSensorFeatureForm.patchValue({
        name: element.name,
        syncfield: element.syncfield,
        featureType: element.featureType,
        isEditable: element.isEditable,
        isEmergencyFeature: element.isEmergencyFeature,
        hasValue: element.hasValue,
        dropDownValue: element.dropDownValue
      });
      this.hasValue = element.hasValue;

      if(element.featureType == FeatureType.DROPDOWN)
        this.enableDropDownValue = true;

      const temp = element.messages as MessageModel[];
      const message = this.getControlProperty(0);
      message.setValue(temp[0].messageToRead);
      const action = this.getControlValue(0);
      action.setValue(temp[0].actionToPerform);
      temp.shift();
      if (temp.length >= 1) {
        temp.forEach((data: MessageModel) => {
          this.addItem(data.messageToRead, data.actionToPerform);
        });
      }
    } catch (error) {
      console.log(error);
      this._commonService.openSnackBar(error?.message, 'close');
    } finally {
      this.isLoading = false;
    }
  }

  addItem(message?: string, action?: string): void {
    this.itemArray = this.messageGroupForm.get('items') as FormArray;
    this.itemArray.push(this.createItem(message, action));
  }
  // add new dynamic value
  createItem(message: string = '', action: string = ''): FormGroup {
    const temp: FormGroup = this._fb.group({
      messageToRead: this._fb.control(message, Validators.required),
      actionToPerform: this._fb.control(action, Validators.required),
    });
    return temp;
  }

  updateForm(event: any) {
    console.log(event);
  }

  childSubmit(event: any) {
    console.log(event);
  }

  onSubmit() {
    this.submitted = true;
    const value = this.editSensorFeatureForm.value;

    if (this.editSensorFeatureForm.invalid) {
      console.log('invalid');
      return;
    }

    value.messages = value.messages.items;

    this._httpService
      .patch(`/sensor-feature/${this.id}`, value)
      .then((res) => {
        this._commonService.openSnackBar('Value is Edited', 'close');
        this._router.navigateByUrl('/home/sensor/feature');
      })
      .catch((e: HttpErrorResponse) => console.error(e.error));
  }

  getErrorMessage() {
    return 'This Field is required';
  }

  selectionChange(feature:FeatureType){
    this.enableDropDownValue = false;
    switch(feature){
      case FeatureType.STATUS:
        this.actions = [
          {
            name: 'Read status(read message)',
            value: 'action 1',
          },
          {
            name: 'Write status(write message)',
            value: 'action 2',
          },
          {
            name: 'Acknowledgement',
            value: 'action 3',
          },
        ];
        break;
      case FeatureType.DROPDOWN:
        this.enableDropDownValue = true;
        this.actions = [
          {
            name: 'Read status(read message)',
            value: 'action 1',
          },
          {
            name: 'Update status(write message)',
            value: 'action 2',
          },
          {
            name: 'Acknowledgement',
            value: 'action 3',
          },
        ];
        break;
      case FeatureType.TOGGLE:
        this.actions = [
          {
            name: 'Read status for enable',
            value: 'action 1',
          },
          {
            name: 'Read status for disable',
            value: 'action 2',
          },
          {
            name: 'Write status for enable',
            value: 'action 3',
          },
          {
            name: 'Write status for disable',
            value: 'action 4',
          },
          {
            name: 'Acknowledgement',
            value: 'action 5',
          },
        ];
        break;
      default:
        console.log('No feature selected');
        this.actions = [];
        break;
    }
  }

  toggleDropdownHasValue() {
    if (this.editSensorFeatureForm.get('hasValue')?.value) {
      this.hasValue = true;
      this.editSensorFeatureForm.get('dropDownValue')?.setValidators([Validators.required]);
    } else {
      this.hasValue = false;
      this.editSensorFeatureForm.get('dropDownValue')?.setValidators([]);
    }
  }

}
