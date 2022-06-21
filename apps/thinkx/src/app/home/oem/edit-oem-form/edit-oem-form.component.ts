import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryModel } from '../../../model/category.model';
import { OemModel } from '../../../model/oem.model';
import { ProductModel } from '../../../model/product.model';
import { SensorModel } from '../../../model/sensor.model';
import { HttpService } from '../../../shared/http-service.service';
import { ImageUploadResponse } from '../../../shared/image-drag-drop/Image-upload-response.model';
import { LoadingOption } from '../../../shared/loading-options.enum';
import { CommonService } from '../../../shared/service/common.service';
import { UploadOptions } from '../../../shared/upload-option.enum';
import { AddOemMatTableComponent } from '../add-oem-mat-table/add-oem-mat-table.component';
import { AddOemTableType } from '../add-oem-table-type.enum';

@Component({
  selector: 'thinkx-edit-oem-form',
  templateUrl: './edit-oem-form.component.html',
  styleUrls: ['./edit-oem-form.component.scss'],
})
export class EditOemFormComponent implements OnInit {
  submitted = false;

  id: string | null = null;
  isLoading = true;
  isLoadingType: LoadingOption = LoadingOption.NEW;

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
  selectCategoryData: CategoryModel[] = [];
  sensorData: SensorModel[] = [];
  selectedSensorData: SensorModel[] = [];
  productData: ProductModel[] = [];
  localProduct: ProductModel[] = [];

  oemLogoDragDropGroup: FormGroup =  this._fb.group({
    whichFileOption: this._fb.control(''),
    image: this._fb.control(''),
    imageUrl: this._fb.control(''),
  })

  @ViewChild('categoryDataTable')
  public categoryDataObj!: AddOemMatTableComponent;

  constructor(
    private _fb: FormBuilder,
    private _commonService: CommonService,
    private _activatedRoute: ActivatedRoute,
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
    this.id = this._activatedRoute.snapshot.paramMap.get('id');
    await this.getResponseCategory();
    await this.getResponseSensor();
    await this.getResponseProductLocal();
    if (this.id !== null) {
      await this.getResponseOem(this.id);
    }
  }

  getErrorMessage() {
    return 'This Field is required';
  }
  
  async getResponseCategory() {
    await this._httpService
      .get('/category')
      .then((data) => {
        const datas = data as CategoryModel[];
        this.categoryData = datas;
      })
      .catch((e: HttpErrorResponse) => {
        this._commonService.openSnackBar(e.error.message, 'close');
      });
  }

  async getResponseProductLocal() {
    await this._httpService
      .get('/product')
      .then((data) => {
        this.localProduct = data as ProductModel[];
      })
      .catch((e: HttpErrorResponse) => {
        this._commonService.openSnackBar(e.error.message, 'close');
      });
  }

  async getResponseSensor() {
    await this._httpService
      .get<SensorModel[]>('/sensor')
      .then((data) => {
        this.sensorData = [...data];
      })
      .catch((e: HttpErrorResponse) => {
        this._commonService.openSnackBar(e.error.message, 'close');
      });
  }

  get f() {
    return this.oemForm.controls;
  }

  get addOemTableType() {
    return AddOemTableType;
  }

  get loadingOption() {
    return LoadingOption;
  }

  async getResponseOem(id: string) {
    try {
      const element = await this._httpService.get<OemModel>(`/oem/${id}`);
      this.oemForm.patchValue({
        oemName: element.oemName,
        oemId: element.oemId,
        bugReportEmail: element.bugReportEmail,
        status: element.status,
      });

      let userAgreementValue = typeof element.endUserAgreement === 'string' ? [element.endUserAgreement] : element.endUserAgreement;
      
      if(userAgreementValue.length > 0){
        let userAgreement = (this.userAgreementImageDragDrop.controls['imageUrl'] as FormArray);
        let controlRequired = Math.max(userAgreement.controls.length, userAgreementValue.length) - Math.min(userAgreement.controls.length, userAgreementValue.length);
        for (let i = 0; i < controlRequired; i++) {
          userAgreement.controls.push(new FormControl('', Validators.required));
        }
        this.userAgreementImageDragDrop.patchValue({
          imageUrl: typeof element.endUserAgreement === 'string' ? [element.endUserAgreement] : element.endUserAgreement,
        });
      }

      let productProfileValue = typeof element.productProfile === 'string' ? [element.productProfile] : element.productProfile;

      if(productProfileValue.length > 0){
        let productProfile = (this.productProfileImageDragDrop.controls['imageUrl'] as FormArray);
        let controlRequired = Math.max(productProfile.controls.length, productProfileValue.length) - Math.min(productProfile.controls.length, productProfileValue.length);
        for (let i = 0; i < controlRequired; i++) {
          productProfile.controls.push(new FormControl('', Validators.required));
        }
        this.productProfileImageDragDrop.patchValue({
          imageUrl: typeof element.productProfile === 'string' ? [element.productProfile] : element.productProfile,
        });
      }

      let companyProfileValue = typeof element.companyProfile === 'string' ? [element.companyProfile] : element.companyProfile;

      if(companyProfileValue.length > 0){
        let companyProfile = (this.companyProfileImageDragDrop.controls['imageUrl'] as FormArray);
        let controlRequired = Math.max(companyProfile.controls.length, companyProfileValue.length) - Math.min(companyProfile.controls.length, companyProfileValue.length);
        for (let i = 0; i < controlRequired; i++) {
          companyProfile.controls.push(new FormControl('', Validators.required));
        }
        this.companyProfileImageDragDrop.patchValue({
          imageUrl: typeof element.companyProfile === 'string' ? [element.companyProfile] : element.companyProfile,
        });
      }

      // this.userManualLinkImageDragDrop.patchValue({
      //   imageUrl: typeof element.userManualLink === 'string' ? [element.userManualLink] : element.userManualLink,
      // });

      if (element.category.length !== 0){
        this.categoryData.forEach(category => {
          if(element.category.findIndex(categoryData => categoryData._id === category._id) != -1)  {
            let tempCategoryData = element.category.filter(categoryData => categoryData._id == category._id)[0];
            category.name = tempCategoryData.name;
            category.imageUrl = tempCategoryData.imageUrl;
          }
        });
        this.selectCategoryData = element.category;
      }
      else this.selectCategoryData = [];

      // this.categoryDataObj.selectedRow = {
      //   data: element.category,
      //   type: AddOemTableType.CATEGORY
      // };

      if (element.sensor.length !== 0) {
        this.sensorData.forEach(sensor => {
          if(element.sensor.findIndex(product => product._id === sensor._id) != -1)  {
            let tempSensorData = element.sensor.filter(sensorData => sensorData._id == sensor._id)[0];
            sensor.name = tempSensorData.name;
            sensor.imageUrl = tempSensorData.imageUrl;
          }
        });
        this.selectedSensorData = element.sensor;
      } else {
        this.selectedSensorData = [];
      }

      if (element.product.length !== 0) {
        const tempProduct = element.product.slice();
        tempProduct.map((product: any) => {
          const result = element.category.find((category) => category._id === product.category);
          product.category = result;
        });
        this.localProduct.forEach(localProduct => {
          if(element.product.findIndex(product => product._id === localProduct._id) != -1)  {
            let product = element.product.filter(product => product._id == localProduct._id)[0];
            localProduct.category = product.category;
            localProduct.imageUrls = product.imageUrls;
            localProduct.name = product.name;
          }
        });
        this.productData = this.localProduct;
      } else {
        this.localProduct = [];
        this.productData = [];
      }

      // element.marketingImageUrl.forEach((marketImage: string) => {
      //   this.marketingFiles.push(marketImage);
      // });

      this.oemLogoFile.push(element.oemLogo);

      this.getImageControl('oemLogo').patchValue({
        imageUrl: element.oemLogo ?? ''
      });

      let marketingImageUrls = typeof element.marketingImageUrl === 'string' ? [element.marketingImageUrl] : element.marketingImageUrl;
      
      if(marketingImageUrls.length > 0){
        let marketingUrl = (this.marketingImageLinkImageDragDrop.controls['imageUrl'] as FormArray);
        let controlRequired = Math.max(marketingUrl.controls.length, marketingImageUrls.length) - Math.min(marketingUrl.controls.length, marketingImageUrls.length);
        for (let i = 0; i < controlRequired; i++) {
          marketingUrl.controls.push(new FormControl('', Validators.required));
        }
        this.marketingImageLinkImageDragDrop.patchValue({
          imageUrl: typeof element.marketingImageUrl === 'string' ? [element.marketingImageUrl] : element.marketingImageUrl,
        });
      }

      // this.oemForm.patchValue({
      //   oemLogo: this.oemLogoFile,
      // });

      // this.oemForm.patchValue({
      //   marketingImageUrl: this.marketingFiles,
      // });
    } catch (error) {
      console.log(error);
      this._commonService.openSnackBar(error?.message, 'close');
    } finally {
      this.isLoading = false;
    }

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

  selectRowChangedHandler(event: {
    data: ProductModel[] | CategoryModel[] | SensorModel[];
    type: AddOemTableType;
  }) {
    let categoryData: CategoryModel[] = [];
    let productData: ProductModel[] = [];
    let sensorData: SensorModel[] = [];
    const type = event.type;

    
    if (type === AddOemTableType.CATEGORY) {
      categoryData = event.data as CategoryModel[];
      // categoryData.forEach((element: CategoryModel) => {
      //   categoryIds.push(element._id);
      // });
      const categoryIds = categoryData.map(x=>x._id);

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

  getImageControl(controlName: string){
    return this.oemForm.get(controlName) as FormGroup;
  }

  onSubmit() {
    this.submitted = true;
    if (this.oemForm.invalid) {
      console.error('Invalid');
      return;
    }
    const value = this.oemForm.value;

    // if (value.oemLogo === '') {
    //   this._commonService.openSnackBar('Please Upload Oem Logo', 'close');
    //   return;
    // }
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
    if (value.category.length <= 0) {
      this._commonService.openSnackBar(
        'Please First Check Category Table',
        'close'
      );
      return;
    }

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

    value.product.map((product: any) => {product.category = product.category._id;});

    const categoryIds = this.categoryData.map((category) => category._id);

    this.returnProductByCategory(categoryIds);

    const url = `/oem/${this.id}`;
    this.isLoading = true;
    this._httpService
      .patch(url, value)
      .then(() => {
        this._commonService.openSnackBar('Value is updated', 'close');
        this.isLoading = false;
        this._router.navigateByUrl('/home/oem');
      })
      .catch((error) => {
        console.error(error);
        this.isLoading = false;
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
