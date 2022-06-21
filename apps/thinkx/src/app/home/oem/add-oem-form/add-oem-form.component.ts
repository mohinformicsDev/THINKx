import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { CategoryModel } from '../../../model/category.model';
import { ProductModel } from '../../../model/product.model';
import { SensorModel } from '../../../model/sensor.model';
import { HttpService } from '../../../shared/http-service.service';
import { ImageUploadResponse } from '../../../shared/image-drag-drop/Image-upload-response.model';
import { CommonService } from '../../../shared/service/common.service';
import { UploadOptions } from '../../../shared/upload-option.enum';
import { AddOemTableType } from '../add-oem-table-type.enum';

@Component({
  selector: 'thinkx-add-oem-form',
  templateUrl: './add-oem-form.component.html',
  styleUrls: ['./add-oem-form.component.scss'],
})
export class AddOemFormComponent implements OnInit {
  submitted = false;
  isLoading = false;
  oemForm = new FormGroup({
    oemName: new FormControl('', [
      Validators.required,
      Validators.nullValidator,
    ]),
    oemId: new FormControl('', [Validators.required]),
    bugReportEmail: new FormControl('', [Validators.required]),
    status: new FormControl(false),
    // oemLogo: new FormControl(''),
    // marketingImageUrl: new FormControl(''),
    product: new FormControl(''),
    category: new FormControl(''),
    sensor: new FormControl(''),
  });

  // Images
  oemLogoFile: string[] = [];
  marketingFiles: string[] = [];

  userAgreementImageDragDrop: FormGroup = this.getImageDragDropFormGroup();
  productProfileImageDragDrop: FormGroup = this.getImageDragDropFormGroup();
  companyProfileImageDragDrop: FormGroup = this.getImageDragDropFormGroup();
  userManualLinkImageDragDrop: FormGroup = this.getImageDragDropFormGroup();
  marketingImageLinkImageDragDrop: FormGroup = this.getImageDragDropFormGroup();

  categoryColumns: string[] = ['select', 'id', 'name', 'image', 'expand'];
  productColumns: string[] = [
    'select',
    'id',
    'name',
    'category',
    'image',
    'expand',
  ];
  sensorColumns: string[] = ['select', 'id', 'name', 'image', 'expand'];

  categoryData: CategoryModel[] = [];
  sensorData: SensorModel[] = [];
  productData: ProductModel[] = [];
  localProduct: ProductModel[] = [];
  oemLogoDragDropGroup: FormGroup =  this._fb.group({
    whichFileOption: this._fb.control(''),
    image: this._fb.control(''),
    imageUrl: this._fb.control(''),
  })
  selectedRow: {
    categoryData: CategoryModel[];
    productData: ProductModel[];
    sensorData: SensorModel[];
  } = { categoryData: [], productData: [], sensorData: [] };

  constructor(
    private _fb: FormBuilder,
    private _commonService: CommonService,
    private _httpService: HttpService,
    private _router: Router
  ) {
    this._commonService.setTitle('OEM');
  }

  async ngOnInit(): Promise<void> {
    this.oemForm.addControl(
      'endUserAgreement',
      this.userAgreementImageDragDrop
    );
    this.oemForm.addControl(
      'marketingImageUrl',
      this.marketingImageLinkImageDragDrop
    );
    this.oemForm.addControl('oemLogo', this.oemLogoDragDropGroup);
    this.oemForm.addControl('productProfile', this.productProfileImageDragDrop);
    this.oemForm.addControl('companyProfile', this.companyProfileImageDragDrop);
    this.oemForm.addControl('userManualLink', this.userManualLinkImageDragDrop);
    this.getResponseCategory();
    this.getResponseSensor();
    this.getResponseProductLocal();
  }

  getErrorMessage() {
    return 'This Field is required';
  }

  get f() {
    return this.oemForm.controls;
  }

  get addOemTableType() {
    return AddOemTableType;
  }

  getResponseCategory() {
    this._httpService
      .get('/category')
      .then((data) => {
        const datas = data as CategoryModel[];
        this.categoryData = datas;
      })
      .catch((e: HttpErrorResponse) => {
        this._commonService.openSnackBar(e.error.message, 'close');
      });
  }

  getResponseProductLocal() {
    this._httpService
      .get('/product')
      .then((data) => {
        this.localProduct = data as ProductModel[];
      })
      .catch((e: HttpErrorResponse) => {
        this._commonService.openSnackBar(e.error.message, 'close');
      });
  }

  returnProductByCategory(categoryIds: string[]) {
    const temp = this.localProduct.filter((value: ProductModel) => categoryIds.includes(value.category._id));
    this.productData = temp.map((value: ProductModel) => {
      const data = this.categoryData.filter((element: CategoryModel) => element._id === value.category._id);
      const obj2 = Object.assign({}, value);
      obj2.category = data[0];
      return obj2;
    });
  }

  getResponseSensor() {
    this._httpService
      .get<SensorModel[]>('/sensor')
      .then((data) => {
        this.sensorData = [...data];
      })
      .catch((e: HttpErrorResponse) => {
        this._commonService.openSnackBar(e.error.message, 'close');
      });
  }

  selectRowChangedHandler(event: {
    data: ProductModel[] | CategoryModel[] | SensorModel[];
    type: AddOemTableType;
  }) {
    let categoryData: CategoryModel[] = [];
    let productData: ProductModel[] = [];
    let sensorData: SensorModel[] = [];
    const type = event.type;

    let categoryIds: string[] = [];

    if (type === AddOemTableType.CATEGORY) {
      categoryData = event.data as CategoryModel[];
      categoryIds = categoryData.map((x) => x._id);
      this.returnProductByCategory(categoryIds);
    }

    if (type === this.addOemTableType.PRODUCT) {
      productData = event.data as ProductModel[];
    }

    if (type === this.addOemTableType.SENSOR) {
      sensorData = event.data as SensorModel[];
    }

    if (type === AddOemTableType.CATEGORY) {
      this.oemForm.patchValue({
        category: categoryData,
      });
    }
    if (type === AddOemTableType.PRODUCT) {
      this.oemForm.patchValue({
        product: productData,
      });
    }
    if (type === AddOemTableType.SENSOR) {
      this.oemForm.patchValue({
        sensor: sensorData,
      });
    }
  }

  getImageDragDropFormGroup(): FormGroup {
    return this._fb.group({
      whichFileOption: this._fb.control(''),
      image: this._fb.control(''),
      imageUrl: this._fb.array([]),
    });
  }

  onSubmit() {
    this.submitted = true;
    const value = this.oemForm.value;
    if (this.oemForm.invalid) {
      console.error('Invalid');
      this._commonService.openSnackBar('Please fill all required fields', 'close');
      return;
    }
    const image = this.oemForm.value.oemLogo;
    if (image.whichFileOption === UploadOptions.URL) {
      if (image.imageUrl === null || image.imageUrl.toString().length <= 0) {
        this._commonService.openSnackBar(
          'Please Fill Oem Logo Url and Submit',
          'close'
        );
        return;
      }
    }
    if (image.whichFileOption === UploadOptions.UPLOAD && image.image === '') {
      this._commonService.openSnackBar(
        'Please Upload Oem Logo First and Submit',
        'close'
      );
      return;
    }
    // if (value.oemLogo === '') {
    //   this._commonService.openSnackBar('Please Upload Oem Logo', 'close');
    //   return;
    // }

    // if (value.marketingImageUrl === '') {
    //   this._commonService.openSnackBar(
    //     'Please Upload Marketing Images',
    //     'close'
    //   );
    //   return;
    // }

    // value.oemLogo = value.oemLogo[0];

    value.companyProfile =
      value.companyProfile.whichFileOption === UploadOptions.URL
        ? value.companyProfile.imageUrl
        : value.companyProfile.image;
    value.productProfile =
      value.productProfile.whichFileOption === UploadOptions.URL
        ? value.productProfile.imageUrl
        : value.productProfile.image;
    value.endUserAgreement =
      value.endUserAgreement.whichFileOption === UploadOptions.URL
        ? value.endUserAgreement.imageUrl
        : value.endUserAgreement.image;
    value.userManualLink =
      value.userManualLink.whichFileOption === UploadOptions.URL
        ? value.userManualLink.imageUrl
        : value.userManualLink.image;
        value.marketingImageUrl =
        value.marketingImageUrl.whichFileOption === UploadOptions.URL
          ? value.marketingImageUrl.imageUrl
          : value.marketingImageUrl.image;

      
    // *Validation Some Of Part
    // if (value.category.length <= 0) {
    //   this._commonService.openSnackBar(
    //     'Please First Check Category Table',
    //     'close'
    //   );
    //   return;
    // }
    // if (value.product.length <= 0) {
    //   this._commonService.openSnackBar(
    //     'Please First Check Product Table',
    //     'close'
    //   );
    //   return;
    // }
    if (value.product.length <= 0 && value.sensor.length <= 0) {
      this._commonService.openSnackBar(
        'Please First Check Product Or Sensor',
        'close'
      );
      return;
    }

    if (value.oemLogo.whichFileOption === UploadOptions.URL) {
      value.oemLogo = value.oemLogo.imageUrl;
    }

    if (value.oemLogo.whichFileOption === UploadOptions.UPLOAD) {
      value.oemLogo = value.oemLogo.image;
    }

    if (value.marketingImageUrl.length <= 0) {
      this._commonService.openSnackBar(
        'Please Upload Marketing Images',
        'close'
      );
      return;
    }

    if (value.companyProfile.length <= 0) {
      this._commonService.openSnackBar(
        'Company Profile Image Missing',
        'close'
      );
      return;
    }
    if (value.productProfile.length <= 0) {
      this._commonService.openSnackBar(
        'Company Profile Image Missing',
        'close'
      );
      return;
    }
    if (value.endUserAgreement.length <= 0) {
      this._commonService.openSnackBar(
        'Company Profile Image Missing',
        'close'
      );
      return;
    }

    if(value.product)
      value.product.map((product: any) => {
        product.category = product.category._id;
      });

    const categoryIds = this.categoryData.map((category) => category._id);

    if (value.product === '') {
      value.product = [];
    }

    if (value.sensor === '') {
      value.sensor = [];
    }

    this.returnProductByCategory(categoryIds);

    // console.log(value);
    // return;
    this.isLoading = true;
    this._httpService
      .post('/oem', value)
      .then(() => {
        this._commonService.openSnackBar('Value Is Added', 'close');
        this.isLoading = false;
        this._router.navigateByUrl('/home/oem');
      })
      .catch((error) => {
        console.error(error);
        this.isLoading = false;
        this._router.navigateByUrl('/home/oem');
      });
  }

  uploadFileEvent(event: any, forElement: string) {
    if (event.target.files && event.target.files[0]) {
      const files = event.target.files as FileList;
      for (let index = 0; index < files.length; index++) {
        const file = files.item(index) as File;
        const fb = new FormData();
        fb.append('file', file, file.name);
        this._httpService.post('/image', fb).then(
          (res) => {
            const response = res as ImageUploadResponse;
            if (forElement === 'oem-logo') {
              this.oemLogoFile.push(response.imageUrls[0]);
              this.oemForm.patchValue({
                oemLogo: this.oemLogoFile,
              });
            } else {
              this.marketingFiles.push(response.imageUrls[0]);
              this.oemForm.patchValue({
                marketingImageUrl: this.marketingFiles,
              });
            }
          },
          (err) => console.log(err)
        );
      }
    }
  }

  clearImage(type: string, index?: number) {
    if (type === 'oem-logo') {
      this.oemLogoFile = [];
    } else {
      if (index !== undefined) delete this.marketingFiles[index];
      this.marketingFiles = this.marketingFiles.filter((data) => data !== undefined);
    }
  }
}
