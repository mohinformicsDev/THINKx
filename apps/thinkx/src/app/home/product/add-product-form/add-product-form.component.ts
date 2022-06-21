import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { Router } from '@angular/router';
import { CategoryModel } from '../../../model/category.model';
import { imageDragDropModel } from '../../../model/image-drag-drop.model';
import { ProductFeatureModel } from '../../../model/product-feature.model';
import { HttpService } from '../../../shared/http-service.service';
import { CommonService } from '../../../shared/service/common.service';
import { UploadOptions } from '../../../shared/upload-option.enum';

@Component({
  selector: 'thinkx-add-product-form',
  templateUrl: './add-product-form.component.html',
  styleUrls: ['./add-product-form.component.scss'],
})
export class AddProductFormComponent implements OnInit {
  @ViewChild('fileInput') fileInput: ElementRef | undefined;
  @ViewChild('uploadFileInput') uploadFileInput: ElementRef | undefined;

  submitted = false;
  isLoading = false;
  product = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.nullValidator]),
    category: new FormControl('', [Validators.required]),
    numberOfUser: new FormControl('', [Validators.required]),
    armMessageToRead: new FormControl('', [Validators.required]),
    disArmMessageToRead: new FormControl('', [Validators.required]),
    sirenOnMessageToRead: new FormControl('', [Validators.required]),
    sirenOffMessageToRead: new FormControl('', [Validators.required]),
    armMessageToSend: new FormControl('', [Validators.required]),
    disArmMessageToSend: new FormControl('', [Validators.required]),
    sirenOnMessageToSend: new FormControl('', [Validators.required]),
    sirenOffMessageToSend: new FormControl('', [Validators.required]),
    armSync: new FormControl('', [Validators.required]),
    disArmSync: new FormControl('', [Validators.required]),
    lockSync: new FormControl('', [Validators.required]),
    unlockSync: new FormControl('', [Validators.required]),
  });

  options: string[] = [];
  categories: CategoryModel[] = [];

  features: ProductFeatureModel[] = [];
  featureCheckboxes: {
    data: ProductFeatureModel;
    isChecked: boolean;
  }[] = [];

  // testing purpose
  // productForm: FormGroup;
  itemArray: FormArray;
  imageDragDropGroup: FormGroup = this._fb.group({
    whichFileOption: this._fb.control(''),
    image: this._fb.control(''),
    imageUrl: this._fb.control(''),
  });

  constructor(
    private _fb: FormBuilder,
    private _commonService: CommonService,
    private _httpService: HttpService,
    private _router: Router
  ) {
    this._commonService.setTitle('Product');
    // this.productForm = this._fb.group({
    //   items: this._fb.array([this.createItem()]),
    // });
    this.itemArray = new FormArray([]);
  }

  ngOnInit() {
    this.product.addControl('images', this.imageDragDropGroup);
    this.product.addControl('armedHighlightImage', this.createItem());
    this.product.addControl('disArmedHighlightImage', this.createItem());
    this.product.addControl('alertOnHighlightImage', this.createItem());
    this.product.addControl('alertOffHighlightImage', this.createItem());
    this.product.addControl('armedUnhighlightImage', this.createItem());
    this.product.addControl('disArmedUnhighlightImage', this.createItem());
    this.product.addControl('alertOnUnhighlightImage', this.createItem());
    this.product.addControl('alertOffUnhighlightImage', this.createItem());
    this.product.addControl('productManual', this.createItem());
    this.product.controls.category.disable();
    this._httpService.get<CategoryModel[]>('/category').then((data) => {
      const categoryData = data as CategoryModel[];
      categoryData.forEach((category: CategoryModel) => {
        this.categories.push(category);
        this.options.push(category.name);
        this.product.controls.category.enable();
      });
    });
    this._httpService
      .get<ProductFeatureModel[]>('/product-feature')
      .then((data) => {
        this.features = [...data];
        this.featureCheckboxes = this.features.map((x) => ({
          data: x,
          isChecked: false,
        }));
      });
    // this.addItem();
  }

  // getters
  get f() {
    return this.product.controls;
  }

  // get items(): FormArray {
  //   return this.productForm.get('items') as FormArray;
  // }

  // getter Function for Individual Dynamic Group
  // getGroup(i: number) {
  //   const temp = this.productForm.get('items') as FormArray;
  //   return <FormGroup>temp.controls[i];
  // }

  getImageControl(controlName: string){
    return this.product.get(controlName) as FormGroup;
  }

  // add new dynamic value
  // addItem(): void {
  //   this.itemArray.push(this.createItem());
  //   this.itemArray = this.productForm.get('items') as FormArray;
  // }

  createItem(): FormGroup {
    const temp: FormGroup = this._fb.group({
      whichFileOption: this._fb.control(''),
      imageUrl: this._fb.control(''),
      image: this._fb.control(''),
    });
    return temp;
  }

  toggleFeatureCheckbox(event: MatCheckboxChange, id: string) {
    this.featureCheckboxes.map((featureCheckbox) => {
      if (featureCheckbox.data._id === id) {
        featureCheckbox.isChecked = event.checked;
      }
    });
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(
      this.featureCheckboxes,
      event.previousIndex,
      event.currentIndex
    );
  }

  validateGetImage(control: any, controlName: string){
    if(control.whichFileOption === UploadOptions.URL){
      if(control.imageUrl === null || control.imageUrl.toString().length <= 0){
        this._commonService.openSnackBar(
          `Please Fill ${controlName} Url and Submit`,
          'close'
        );
        return false;
      }
    }
    if(control.whichFileOption === UploadOptions.UPLOAD && control.image === ''){
      this._commonService.openSnackBar(
        `Please Drop ${controlName} First and Submit`,
        'close'
      );
      return false;
    }
    return true;
  }

  getImageUrlFromCotnrol(control: any){
    let url = '';
    if (control.whichFileOption === UploadOptions.URL) {
      url = control.imageUrl;
    }

    if (control.whichFileOption === UploadOptions.UPLOAD) {
      url = control.image;
    }
    return url;
  }

  onSubmit(event: Event) {
    event.stopPropagation();
    this.submitted = true;

    const value = this.product.value;

    // adding the features in the value to add Product Function
    value.features = [];
    this.featureCheckboxes.forEach((checkbox) => {
      if (checkbox.isChecked === true) {
        value.features.push(checkbox.data);
      }
    });
    // console.log(value.features);
    const armedHighlightImage = this.product.value.armedHighlightImage;
    this.validateGetImage(armedHighlightImage, 'Armed Highlight Image');
    value.armedHighlightImage = this.getImageUrlFromCotnrol(armedHighlightImage);

    const disArmedHighlightImage = this.product.value.disArmedHighlightImage;
    this.validateGetImage(disArmedHighlightImage, 'Disarmed Highlight Image');
    value.disArmedHighlightImage = this.getImageUrlFromCotnrol(armedHighlightImage);
    
    const alertOnHighlightImage = this.product.value.alertOnHighlightImage;
    this.validateGetImage(alertOnHighlightImage, 'Alert On Highlight Image');
    value.alertOnHighlightImage = this.getImageUrlFromCotnrol(alertOnHighlightImage);
    
    const alertOffHighlightImage = this.product.value.alertOffHighlightImage;
    this.validateGetImage(alertOffHighlightImage, 'Alert Off Highlight Image');
    value.alertOffHighlightImage = this.getImageUrlFromCotnrol(alertOffHighlightImage);
    
    const armedUnhighlightImage = this.product.value.armedUnhighlightImage;
    this.validateGetImage(armedUnhighlightImage, 'Armed Unhighlight Image');
    value.armedUnhighlightImage = this.getImageUrlFromCotnrol(armedUnhighlightImage);
    
    const disArmedUnhighlightImage = this.product.value.disArmedUnhighlightImage;
    this.validateGetImage(disArmedUnhighlightImage, 'Disarmed Unhighlight Image');
    value.disArmedUnhighlightImage = this.getImageUrlFromCotnrol(disArmedUnhighlightImage);
    
    const alertOnUnhighlightImage = this.product.value.alertOnUnhighlightImage;
    this.validateGetImage(alertOnUnhighlightImage, 'Alert On Unhighlight Image');
    value.alertOnUnhighlightImage = this.getImageUrlFromCotnrol(alertOnUnhighlightImage);
    
    const alertOffUnhighlightImage = this.product.value.alertOffUnhighlightImage;
    this.validateGetImage(alertOffUnhighlightImage, 'Alert Off Unhighlight Image');
    value.alertOffUnhighlightImage = this.getImageUrlFromCotnrol(alertOffUnhighlightImage);

    const productManual = this.product.value.productManual;
    value.productManual = this.getImageUrlFromCotnrol(productManual);

    const image = this.product.value.images;
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
    // for (let i = 0; i < value?.images?.items?.length; i++) {
    //   const element = value.images.items[i];
    //   console.log(element);
    //   if (
    //     element.whichFileOption === UploadOptions.URL &&
    //     element.imageUrl.length <= 0
    //   ) {
    //     this._commonService.openSnackBar(
    //       'Please Fill Image Url and Submit',
    //       'close'
    //     );
    //     return;
    //   }
    //   if (
    //     element.whichFileOption === UploadOptions.UPLOAD &&
    //     element.image === ''
    //   ) {
    //     this._commonService.openSnackBar(
    //       'Please Drop Image First and Submit',
    //       'close'
    //     );
    //     return;
    //   }
    // }

    // value.images.items.forEach((item: imageDragDropModel) => {

    // });

    if (this.product.invalid) {
      return;
    }

    // value.images = value.images.items;

    // const imageUrls: string[] = [];
    // value.images.forEach((element: imageDragDropModel) => {
    //   if (element.whichFileOption === UploadOptions.URL) {
    //     imageUrls.push(element.imageUrl);
    //   }
    //   if (element.whichFileOption === UploadOptions.UPLOAD) {
    //     imageUrls.push(element.image);
    //   }
    // });
    if (value.images.whichFileOption === UploadOptions.URL) {
      value.imageUrls = image.imageUrl;
    }

    if (value.images.whichFileOption === UploadOptions.UPLOAD) {
      value.imageUrls = image.image;
    }
    delete value.images;
    // value.imageUrls = imageUrls;

    const selectedCategory = this.categories.filter(
      (element: CategoryModel) => {
        return element.name === value.category;
      }
    ) as CategoryModel[];
    value.category = selectedCategory[0]._id;
    this.isLoading = true;
    this._httpService.post('/product', value).then(() => {
      this.isLoading = false;
      this._router.navigateByUrl('/home/product');
    }).catch((error)=>{
      console.error(error);
      this.isLoading = false;
      this._router.navigateByUrl('/home/product');
    });
  }

  getErrorMessage() {
    return 'This filed is required';
  }
}
