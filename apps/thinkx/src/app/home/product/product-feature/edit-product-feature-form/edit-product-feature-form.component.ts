import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserType } from '../../../../shared/user-type.enum';
import { MessageModel } from '../../../../model/message.model';
import { ProductFeatureModel } from '../../../../model/product-feature.model';
import { FeatureType } from '../../../../shared/feature-type.enum';
import { HttpService } from '../../../../shared/http-service.service';
import { LoadingOption } from '../../../../shared/loading-options.enum';
import { UploadOptions } from '../../../../shared/upload-option.enum';
import { CommonService } from 'apps/thinkx/src/app/shared/service/common.service';

interface Action {
  name: string; // action 1, action 2, action 3,
  value: string; // read/get status, send/update status, textvalue
}
@Component({
  selector: 'thinkx-edit-product-feature-form',
  templateUrl: './edit-product-feature-form.component.html',
  styleUrls: ['./edit-product-feature-form.component.scss'],
})
export class EditProductFeatureFormComponent implements OnInit {
  submitted = false;
  id: string | null = null;
  isLoading = true;
  isLoadingType: LoadingOption = LoadingOption.NEW;

  editProductFeatureForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    featureType: new FormControl('', [Validators.required]),
    isEditable: new FormControl(false, [Validators.required]),
    isEmergencyFeature: new FormControl(false, [Validators.required]),
    isInformerEditor: new FormControl(false, [Validators.required]),
    syncField: new FormControl('', [Validators.required]),
    userType: new FormControl(UserType.EDITOR, [Validators.required]),
    requirePassword: new FormControl(false, [Validators.required]),
    requireRefresh: new FormControl(false, [Validators.required]),
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

  // *Variables for Image Drag and drop
  imageDragDropGroup: FormGroup = this._fb.group({
    whichFileOption: this._fb.control(''),
    image: this._fb.control(''),
    imageUrl: this._fb.control(''),
  });

  constructor(
    private _fb: FormBuilder,
    private _commonService: CommonService,
    private _httpService: HttpService,
    private _activatedRoute: ActivatedRoute,
    private _router: Router
  ) {
    this._commonService.setTitle('Product');
    this.itemArray = new FormArray([]);
    this.messageGroupForm = this._fb.group({
      items: this._fb.array([this.createItem()]),
    });
    this.hasValue = false;
    this.enableDropDownValue = false;
  }
  getImageControl(controlName: string){
    return this.editProductFeatureForm.get(controlName) as FormGroup;
  }

  ngOnInit(): void {
    this.id = this._activatedRoute.snapshot.paramMap.get('id');
    this.editProductFeatureForm.addControl('messages', this.messageGroupForm);
    this.editProductFeatureForm.addControl('images', this.imageDragDropGroup);
    const features = Object(FeatureType);
    for (const key in features) {
      if (Object.prototype.hasOwnProperty.call(features, key)) {
        this.options.push(features[key]);
      }
    }

    if (this.id !== null) {
      this.getResponse(this.id);
    }
  }

  selectionChange(feature: FeatureType) {
    this.enableDropDownValue = false;
    switch (feature) {
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
            value: 'action 5',
          },
        ];
        break;
      case FeatureType.REMINDER:
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
            value: 'action 5',
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
            name: 'Acknowledement',
            value: 'action 5',
          },
        ];
        break;
      case FeatureType.STATUSTEXTFIELD:
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
            value: 'action 5',
          },
        ];
        break;
      case FeatureType.TIMER:
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
            value: 'action 5',
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
            name: 'Write status for enable',
            value: 'action 2',
          },
          {
            name: 'Read status for disable',
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
      case FeatureType.CHANGEPASSWORD:
        this.actions = [
          {
            name: 'Change Password Message',
            value: 'action 6',
          },
          {
            name: 'Old Password Message',
            value: 'action 7',
          },
          {
            name: 'New Password Message',
            value: 'action 8',
          },
          {
            name: 'Acknowledgement',
            value: 'action 5',
          },
        ];
        break;
      case FeatureType.MASTERRESET:
        this.actions = [
          {
            name: 'Write status(write message)',
            value: 'action 2'
          },
          {
            name: 'Acknowledgement',
            value: 'action 5',
          },
        ];
        break;
      case FeatureType.TOGGLEDROPDOWN:
        this.enableDropDownValue = true;
        this.actions = [
          {
            name: 'Read status for enable',
            value: 'action 1',
          },
          {
            name: 'Write status for enable',
            value: 'action 2',
          },
          {
            name: 'Read status for disable',
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
      case FeatureType.TOGGLETIMER:
        this.actions = [
          {
            name: 'Read status for enable',
            value: 'action 1',
          },
          {
            name: 'Write status for enable',
            value: 'action 2',
          },
          {
            name: 'Read status for disable',
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
      // case FeatureType.MANAGEUSER:
      //   this.actions = [
      //     {
      //       name: 'Add user actions',
      //       value: 'action 1',
      //     },
      //     {
      //       name: 'Update user action',
      //       value: 'action 2',
      //     },
      //     {
      //       name: 'Delete user action',
      //       value: 'action 3',
      //     },
      //     {
      //       name: 'Sync user action with their message',
      //       value: 'action 4',
      //     },
      //     {
      //       name: 'Admin registration',
      //       value: 'action 5',
      //     },
      //     {
      //       name: 'Acknowledgement',
      //       value: 'action 6',
      //     },
      //   ];
      //   break;
      // case FeatureType.MESSAGESYNC:
        // this.actions = [
        //   {
        //     name: 'Start message',
        //     value: 'action 1',
        //   },
        //   {
        //     name: 'Data message',
        //     value: 'action 2',
        //   },
        //   {
        //     name: 'End message format',
        //     value: 'action 3',
        //   },
        //   {
        //     name: 'Acknowledgement',
        //     value: 'action 4',
        //   },
        // ];
        // break;
      case FeatureType.TOGGLEREMINDER:
        this.actions = [
          {
            name: 'Read status for enable',
            value: 'action 1',
          },
          {
            name: 'Write status for enable',
            value: 'action 2',
          },
          {
            name: 'Read status for disable',
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
        console.log('No faature selected');
        this.actions = [];
        break;
    }
  }
  get loadingOption() {
    return LoadingOption;
  }

  get f() {
    return this.editProductFeatureForm.controls;
  }

  get typeOfUser() {
    return UserType;
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
      const data = await this._httpService.get<ProductFeatureModel[]>(
        `/product-feature/${id}`
      );
      const element = data[0];
      this.editProductFeatureForm.patchValue({
        name: element.name,
        featureType: element.featureType,
        isEditable: element.isEditable,
        isEmergencyFeature: element.isEmergencyFeature,
        userType: element.userType,
        requirePassword: element.requirePassword,
        requireRefresh: element.requireRefresh,
        hasValue: element.hasValue ?? false,
        dropDownValue: element.dropDownValue ?? '',
        syncField: element.syncField ?? ''
      });
      this.getImageControl('images').patchValue({
        imageUrl: element.imageUrl ?? ''
      })
      this.selectionChange(element.featureType);

      const temp = element.messages as MessageModel[];
      const message = this.getControlProperty(0);
      message.setValue(temp[0].messageToRead);
      const action = this.getControlValue(0);
      action.setValue(temp[0].actionToPerform);
      temp.shift();
      if (temp.length >= 1) {
        temp.forEach((data) => {
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

  toggleDropdownHasValue() {
    if (this.editProductFeatureForm.get('hasValue')?.value) {
      this.hasValue = true;
      this.editProductFeatureForm.get('dropDownValue')?.setValidators([Validators.required]);
    } else {
      this.hasValue = false;
      this.editProductFeatureForm.get('dropDownValue')?.setValidators([]);
    }
  }

  addItem(message?: string, action?: string): void {
    this.itemArray = this.messageGroupForm.get('items') as FormArray;
    this.itemArray.push(this.createItem(message, action));
  }

  removeItem(index: number): void {
    this.itemArray = this.messageGroupForm.get('items') as FormArray;
    this.itemArray.removeAt(index);
  }

  // add new dynamic value
  createItem(message: string = '', action: string = ''): FormGroup {
    const temp: FormGroup = this._fb.group({
      messageToRead: this._fb.control(message, Validators.required),
      actionToPerform: this._fb.control(action, Validators.required),
    });
    return temp;
  }

  onSubmit() {
    this.submitted = true;
    const value = this.editProductFeatureForm.value;

    const image = this.editProductFeatureForm.value.images;
    if (image.whichFileOption === UploadOptions.URL) {
      if (image.imageUrl === null || image.imageUrl.toString().length <= 0) {
        this._commonService.openSnackBar(
          'Please Fill Image Url and Submit',
          'close'
        );
        return;
      }
    }
    if (image.whichFileOption === UploadOptions.UPLOAD && image.image === '') {
      this._commonService.openSnackBar(
        'Please Drop Image First and Submit',
        'close'
      );
      return;
    }
    if (this.editProductFeatureForm.invalid) {
      console.log('invalid');
      return;
    }

    value.messages = value.messages.items;

    if (value.images.whichFileOption === UploadOptions.URL) {
      value.imageUrl = image.imageUrl;
    }

    if (value.images.whichFileOption === UploadOptions.UPLOAD) {
      value.imageUrl = image.image;
    }

    delete value.images;
    this._httpService
      .patch(`/product-feature/${this.id}`, value)
      .then(() => {
        this._commonService.openSnackBar('Value is Edited', 'close');
        this._router.navigateByUrl('/home/product/feature');
      })
      .catch((e: HttpErrorResponse) => console.error(e.error));
  }

  getErrorMessage() {
    return 'This Field is required';
  }
}
