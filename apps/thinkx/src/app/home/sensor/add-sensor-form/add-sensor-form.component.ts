import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { Router } from '@angular/router';
import { ProductFeatureModel } from '../../../model/product-feature.model';
import { HttpService } from '../../../shared/http-service.service';
import { CommonService } from '../../../shared/service/common.service';
import { UploadOptions } from '../../../shared/upload-option.enum';

@Component({
  selector: 'thinkx-add-sensor-form',
  templateUrl: './add-sensor-form.component.html',
  styleUrls: ['./add-sensor-form.component.scss'],
})
export class AddSensorFormComponent implements OnInit {
  @ViewChild('fileInput') fileInput: ElementRef | undefined;
  @ViewChild('uploadFileInput') uploadFileInput: ElementRef | undefined;
  @ViewChild('submit') submit: MatButton | undefined;

  submitted = false;
  sensor = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.nullValidator]),
    syncfield: new FormControl('', [Validators.required, Validators.nullValidator]),
    armMessageToRead: new FormControl('', [
      Validators.required,
      Validators.nullValidator,
    ]),
    armMessageToSend: new FormControl('', [
      Validators.required,
      Validators.nullValidator,
    ]),
    disArmMessageToRead: new FormControl('', [
      Validators.required,
      Validators.nullValidator,
    ]),
    disArmMessageToSend: new FormControl('', [
      Validators.required,
      Validators.nullValidator,
    ]),
    setTimerMessageToRead: new FormControl('', [
      Validators.required,
      Validators.nullValidator,
    ]),
    setTimerMessageToSend: new FormControl('', [
      Validators.required,
      Validators.nullValidator,
    ]),
    getTimerMessageToRead: new FormControl('', [
      Validators.required,
      Validators.nullValidator,
    ]),
    getTimerMessageToSend: new FormControl('', [
      Validators.required,
      Validators.nullValidator,
    ]),
  });
  // *Variables for Image Drag and drop
  imageDragDropGroup: FormGroup = this._fb.group({
    whichFileOption: this._fb.control(''),
    image: this._fb.control(''),
    imageUrl: this._fb.control(''),
  });

  features: ProductFeatureModel[] = [];
  featureCheckboxes: {
    data: ProductFeatureModel;
    isChecked: boolean;
  }[] = [];

  constructor(
    private _fb: FormBuilder,
    private _commonService: CommonService,
    private _httpService: HttpService,
    private _router: Router
  ) {
    this._commonService.setTitle('Sensor');
  }

  ngOnInit(): void {
    this.sensor.addControl('images', this.imageDragDropGroup);
    this._httpService
      .get<ProductFeatureModel[]>('/sensor-feature')
      .then((features) => {
        this.features = [...features];
        this.featureCheckboxes = this.features.map((x) => ({
          data: x,
          isChecked: false,
        }));
        // features.forEach((feature: ProductFeatureModel) => {
        //   this.features.push(feature);
        //   this.featureCheckboxes.push({
        //     data: feature,
        //     isChecked: false,
        //   });
        // });
      });
  }

  toggleFeatureCheckbox(event: MatCheckboxChange, id: string) {
    this.featureCheckboxes.map((featureCheckbox) => {
      if (featureCheckbox.data._id === id) {
        featureCheckbox.isChecked = event.checked;
      }
    });
  }

  get f() {
    return this.sensor.controls;
  }

  onSubmit(event: Event) {
    event.stopPropagation();
    this.submitted = true;
    const value = this.sensor.value;
    const image = this.sensor.value.images;

    // value.features = [];
    // this.featureCheckboxes.forEach((checkbox) => {
    //   if (checkbox.isChecked === true) {
    //     value.features.push(checkbox.data._id);
    //   }
    // });

    value.features = this.featureCheckboxes
      .filter((x) => x.isChecked)
      .map((x) => x.data._id);

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
    console.log(this.sensor.value);
    if (this.sensor.invalid) {
      console.log('invalid');
      return;
    }

    if (value.images.whichFileOption === UploadOptions.URL) {
      value.imageUrl = image.imageUrl;
    }

    if (value.images.whichFileOption === UploadOptions.UPLOAD) {
      value.imageUrl = image.image;
    }

    delete value.images;

    this._httpService.post('/sensor', value).then(() => {
      this._router.navigateByUrl('/home/sensor');
    });
  }

  getErrorMessage() {
    return 'This Field is required';
  }
}
