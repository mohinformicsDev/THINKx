import { Component, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { CommonService } from 'apps/thinkx/src/app/shared/service/common.service';
import { FeatureType } from '../../../../shared/feature-type.enum';
import { HttpService } from '../../../../shared/http-service.service';

export interface Action {
  name: string; // action 1, action 2, action 3,
  value: string; // read/get status, send/update status, textvalue
}

@Component({
  selector: 'thinkx-add-sensor-feature-form',
  templateUrl: './add-sensor-feature-form.component.html',
  styleUrls: ['./add-sensor-feature-form.component.scss'],
})
export class AddSensorFeatureFormComponent implements OnInit {
  submitted = false;
  addSensorFeatureForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    syncfield: new FormControl('', [Validators.required]),
    featureType: new FormControl('', [Validators.required]),
    isEditable: new FormControl(false, [Validators.required]),
    isEmergencyFeature: new FormControl(false, [Validators.required]),
    hasValue: new FormControl(false, [Validators.required]),
    dropDownValue: new FormControl('', [])
  });
  hasValue: boolean;
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
    this.addSensorFeatureForm.addControl('messages', this.messageGroupForm);
    const features = Object(FeatureType);
    for (const key in features) {
      if (Object.prototype.hasOwnProperty.call(features, key)) {
        if(features[key] == FeatureType.STATUS || features[key] == FeatureType.TOGGLE || features[key] == FeatureType.DROPDOWN){
          this.options.push(features[key]);
        }
      }
    }
  }

  get f() {
    return this.addSensorFeatureForm.controls;
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

  addItem(): void {
    this.itemArray = this.messageGroupForm.get('items') as FormArray;
    this.itemArray.push(this.createItem());
  }

  // add new dynamic value
  createItem(): FormGroup {
    const temp: FormGroup = this._fb.group({
      messageToRead: this._fb.control('', Validators.required),
      actionToPerform: this._fb.control('', Validators.required),
    });
    return temp;
  }

  updateForm(event: any) {
    console.log(event);
  }

  childSubmit(event: any) {
    console.log(event);
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
    if (this.addSensorFeatureForm.get('hasValue')?.value) {
      this.hasValue = true;
      this.addSensorFeatureForm.get('dropDownValue')?.setValidators([Validators.required]);
    } else {
      this.hasValue = false;
      this.addSensorFeatureForm.get('dropDownValue')?.setValidators([]);
    }
  }

  onSubmit() {
    this.submitted = true;
    const value = this.addSensorFeatureForm.value;

    if (this.addSensorFeatureForm.invalid) {
      console.log('invalid');
      return;
    }

    value.messages = value.messages.items;

    this._httpService.post('/sensor-feature', value).then((res) => {
      this._commonService.openSnackBar('Value is Added', 'close');
      this._router.navigateByUrl('/home/sensor/feature');
    });
  }

  getErrorMessage() {
    return 'This Field is required';
  }
}
