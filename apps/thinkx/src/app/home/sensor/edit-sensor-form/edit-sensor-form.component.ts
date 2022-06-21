import { Component, OnInit } from '@angular/core';
import { __core_private_testing_placeholder__ } from '@angular/core/testing';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductFeatureModel } from '../../../model/product-feature.model';
import { SensorFeatureModel } from '../../../model/sensor-feature.model';
import { SensorModel } from '../../../model/sensor.model';
import { HttpService } from '../../../shared/http-service.service';
import { LoadingOption } from '../../../shared/loading-options.enum';
import { CommonService } from '../../../shared/service/common.service';
import { UploadOptions } from '../../../shared/upload-option.enum';

@Component({
  selector: 'thinkx-edit-sensor-form',
  templateUrl: './edit-sensor-form.component.html',
  styleUrls: ['./edit-sensor-form.component.scss'],
})
export class EditSensorFormComponent implements OnInit {
  submitted = false;
  id: string | null = null;
  isLoading = true;
  isLoadingType: LoadingOption = LoadingOption.NEW;

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
  features: SensorFeatureModel[] = [];
  featureCheckboxes: {
    data: SensorFeatureModel;
    isChecked: boolean;
  }[] = [];

  imageDragDropGroup: FormGroup = this._fb.group({
    whichFileOption: this._fb.control(''),
    image: this._fb.control(''),
    imageUrl: this._fb.control(''),
  });

  constructor(
    private _fb: FormBuilder,
    private _commonService: CommonService,
    private _activatedRoute: ActivatedRoute,
    private _httpService: HttpService,
    private _router: Router
  ) {
    this._commonService.setTitle('Sensor');
  }

  ngOnInit(): void {
    this.id = this._activatedRoute.snapshot.paramMap.get('id');
    this.sensor.addControl('images', this.imageDragDropGroup);
    this._httpService
      .get<SensorFeatureModel[]>('/sensor-feature')
      .then((data) => {
        this.features = [...data];
        this.featureCheckboxes = this.features.map((x) => ({
          data: x,
          isChecked: false,
        }));
        if (this.id !== null) {
          this.getResponse(this.id);
        }
      });
  }

  // getters
  async getResponse(id: string) {
    try {
      const sensorData = await this._httpService.get<SensorModel>(
        `/sensor/${id}`
      );
      console.log(sensorData);

      this.featureCheckboxes.forEach((checkbox) => {
        if (sensorData.features.includes(checkbox.data._id)) {
          checkbox.isChecked = !checkbox.isChecked;
        }
      });

      this.sensor.patchValue({
        name: sensorData.name,
        syncfield: sensorData.syncfield,
        armMessageToRead: sensorData.armMessageToRead,
        armMessageToSend: sensorData.armMessageToSend,
        disArmMessageToRead: sensorData.disArmMessageToRead,
        disArmMessageToSend: sensorData.disArmMessageToSend,
        setTimerMessageToRead: sensorData.setTimerMessageToRead,
        setTimerMessageToSend: sensorData.setTimerMessageToSend,
        getTimerMessageToRead: sensorData.getTimerMessageToRead,
        getTimerMessageToSend: sensorData.getTimerMessageToSend,
      });

      this.imageDragDropGroup.patchValue({
        imageUrl: sensorData.imageUrl,
      });
    } catch (error) {
      console.log(error);
      this._commonService.openSnackBar(error?.message, 'close');
    } finally {
      this.isLoading = false;
    }
  }

  toggleFeatureCheckbox(event: MatCheckboxChange, id: string) {
    this.featureCheckboxes.forEach((featureCheckbox) => {
      if (featureCheckbox.data._id === id) {
        featureCheckbox.isChecked = event.checked;
      }
    });
  }

  get f() {
    return this.sensor.controls;
  }

  get loadingOption() {
    return LoadingOption;
  }

  onSubmit(event: Event) {
    event.stopPropagation();
    this.submitted = true;

    const value = this.sensor.value;
    const image = this.sensor.value.images;

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

    let sensorData = value as SensorModel;
    sensorData.features = this.featureCheckboxes
      .filter((x) => x.isChecked)
      .map((x) => x.data._id);

    this._httpService.patch(`/sensor/${this.id}`, value).then(() => {
      this._commonService.openSnackBar('Value is Updated', 'close');
      this._router.navigateByUrl('/home/sensor');
    });
  }

  getErrorMessage() {
    return 'This Field is required';
  }
}
