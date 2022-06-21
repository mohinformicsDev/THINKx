import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, ComponentFactoryResolver, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryModel } from '../../../model/category.model';
import { imageDragDropModel } from '../../../model/image-drag-drop.model';
import { ProductFeatureModel } from '../../../model/product-feature.model';
import { ProductModel } from '../../../model/product.model';
import { HttpService } from '../../../shared/http-service.service';
import { LoadingOption } from '../../../shared/loading-options.enum';
import { CommonService } from '../../../shared/service/common.service';
import { UploadOptions } from '../../../shared/upload-option.enum';

@Component({
  selector: 'thinkx-edit-product-form',
  templateUrl: './edit-product-form.component.html',
  styleUrls: ['./edit-product-form.component.scss'],
})
export class EditProductFormComponent implements OnInit {
  id: string | null = null;
  isLoading = true;
  isLoadingType: LoadingOption = LoadingOption.NEW;

  submitted = false;
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
  filteredOptions: string[];
  categories: CategoryModel[] = [];

  features: ProductFeatureModel[] = [];
  featureCheckboxes: {
    data: ProductFeatureModel;
    isChecked: boolean;
  }[] = [];

  // testing purpose
  // productForm: FormGroup;
  imageDragDropGroup: FormGroup = this._fb.group({
    whichFileOption: this._fb.control(''),
    image: this._fb.control(''),
    imageUrl: this._fb.control(''),
  });
  itemArray: FormArray;

  constructor(
    private _fb: FormBuilder,
    private _commonService: CommonService,
    private _httpService: HttpService,
    private _activatedRoute: ActivatedRoute,
    private _router: Router
  ) {
    this._commonService.setTitle('Product');
    // this.productForm = this._fb.group({
    //   items: this._fb.array([this.createItem()]),
    // });
    this.itemArray = new FormArray([]);
    this.filteredOptions = [];
  }

  async ngOnInit() {
    this.id = this._activatedRoute.snapshot.paramMap.get('id');
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
    try {
      const categoryData = (await this._httpService.get<CategoryModel[]>(
        '/category'
      )) as CategoryModel[];
      this.categories = [...categoryData];
      this.options = this.categories.map((x) => x.name);
      this.product.controls.category.enable();

      // categoryData.forEach((category: CategoryModel) => {
      //   this.categories.push(category);
      //   this.options.push(category.name);
      //   this.product.controls.category.enable();
      // });
      const productFeatureData = await this._httpService.get<
        ProductFeatureModel[]
      >('/product-feature');

      this.features = [...productFeatureData];
      this.featureCheckboxes = this.features.map((x) => ({
        data: x,
        isChecked: false,
      }));

      // productFeatureData.forEach((feature: ProductFeatureModel) => {
      //   this.features.push(feature);
      //   this.featureCheckboxes.push({
      //     data: feature,
      //     isChecked: false,
      //   });
      // });

      if (this.id !== null) {
        this.getProductResponse(this.id);
      }
    } catch (error) {
      console.log(error);
      this._commonService.openSnackBar(error?.message, 'close');
    }
  }

  // getters
  async getProductResponse(id: string) {
    try {
      const data = await this._httpService.get<ProductModel>(`/product/${id}`);
      const featuresIds = data.features.map((x) => x._id);

      // data.features.forEach((feature: ProductFeatureModel) => {
      //   featuresIds.push(feature._id);
      // });

      this.featureCheckboxes.forEach((checkbox) => {
        if (featuresIds.includes(checkbox.data._id)) {
          checkbox.isChecked = !checkbox.isChecked;
        }
      });

      const categorySelected = this.categories.filter(
        (category: CategoryModel) => {
          return category._id === data.category._id;
        }
      );

      this.product.patchValue({
        name: data.name,
        numberOfUser: data.numberOfUser,
        category: categorySelected[0].name,
        armMessageToRead: data.armMessageToRead,
        disArmMessageToRead: data.disArmMessageToRead,
        sirenOnMessageToRead: data.sirenOnMessageToRead,
        sirenOffMessageToRead: data.sirenOffMessageToRead,
        armMessageToSend: data.armMessageToSend,
        disArmMessageToSend: data.disArmMessageToSend,
        sirenOnMessageToSend: data.sirenOnMessageToSend,
        sirenOffMessageToSend: data.sirenOffMessageToSend,
        armSync: data.armSync,
        disArmSync: data.disArmSync,
        lockSync: data.lockSync,
        unlockSync: data.unlockSync,
        
      });

      // const items = this.productForm.get('items') as FormArray;
      // const groups = items.at(0) as FormGroup;
      // groups.patchValue({
      //   imageUrl: data.imageUrls[0],
      // });

      this.getImageControl('images').patchValue({
        imageUrl: data.imageUrls ?? ''
      });

      this.getImageControl('armedHighlightImage').patchValue({
        imageUrl: data.armedHighlightImage ?? ''
      });
      this.getImageControl('disArmedHighlightImage').patchValue({
        imageUrl: data.disArmedHighlightImage ?? ''
      });
      this.getImageControl('alertOnHighlightImage').patchValue({
        imageUrl: data.alertOnHighlightImage ?? ''
      });
      this.getImageControl('alertOffHighlightImage').patchValue({
        imageUrl: data.alertOffHighlightImage ?? ''
      });
      this.getImageControl('armedUnhighlightImage').patchValue({
        imageUrl: data.armedUnhighlightImage ?? ''
      });
      this.getImageControl('disArmedUnhighlightImage').patchValue({
        imageUrl: data.disArmedUnhighlightImage ?? ''
      });
      this.getImageControl('alertOnUnhighlightImage').patchValue({
        imageUrl: data.alertOnUnhighlightImage ?? ''
      });
      this.getImageControl('alertOffUnhighlightImage').patchValue({
        imageUrl: data.alertOffUnhighlightImage ?? ''
      });
      this.getImageControl('productManual').patchValue({
        imageUrl: data.productManual ?? ''
      });

      // data.imageUrls.shift();
      // if (data.imageUrls.length > 1) {
      //   data.imageUrls.forEach((imageUrl) => {
      //     this.addItem(imageUrl);
      //   });
      // }
    } catch (error) {
      console.log(error);
      this._commonService.openSnackBar(error?.message, 'close');
    } finally {
      this.isLoading = false;
    }
  }

  get f() {
    return this.product.controls;
  }

  // get items(): FormArray {
  //   return this.productForm.get('items') as FormArray;
  // }

  get loadingOption() {
    return LoadingOption;
  }

  // getter Function for Individual Dynamic Group
  // getGroup(i: number) {
  //   const temp = this.productForm.get('items') as FormArray;
  //   return <FormGroup>temp.controls[i];
  // }

  getImageControl(controlName: string){
    return this.product.get(controlName) as FormGroup;
  }

  // add new dynamic value
  createItem(imageUrl?: string): FormGroup {
    if (imageUrl) {
      const temp: FormGroup = this._fb.group({
        whichFileOption: this._fb.control(''),
        imageUrl: this._fb.control(imageUrl),
        image: this._fb.control(''),
      });
      return temp;
    } else {
      const temp: FormGroup = this._fb.group({
        whichFileOption: this._fb.control(''),
        imageUrl: this._fb.control(''),
        image: this._fb.control(''),
      });
      return temp;
    }
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

  // addItem(imageUrl?: string): void {
  //   this.itemArray = this.productForm.get('items') as FormArray;
  //   if (imageUrl) {
  //     this.itemArray.push(this.createItem(imageUrl));
  //   } else {
  //     this.itemArray.push(this.createItem());
  //   }
  // }

  onSubmit(event: Event) {
    event.stopPropagation();

    this.submitted = true;

    const value = this.product.value;

    // adding the features in the value to add Product Function
    // value.features = [];
    // this.featureCheckboxes.forEach((checkbox) => {
    //   console.log(checkbox);
    //   if (checkbox.isChecked === true) {
    //     console.log(checkbox);
    //     value.features.push(checkbox.data._id);
    //   }
    // });
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
    value.features = this.featureCheckboxes
      .filter((x) => x.isChecked)
      .map((x) => x.data._id);

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

    // value.images.items.forEach((item: imageDragDropModel) => {
    //   if (
    //     item.whichFileOption === UploadOptions.URL &&
    //     item.imageUrl.length <= 0
    //   ) {
    //     this._commonService.openSnackBar(
    //       'Please Fill Image Url and Submit',
    //       'close'
    //     );
    //     return;
    //   }
    //   if (item.whichFileOption === UploadOptions.UPLOAD && item.image === '') {
    //     this._commonService.openSnackBar(
    //       'Please Drop Image First and Submit',
    //       'close'
    //     );
    //     return;
    //   }
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

    // const imageUrls: string[] = value.images.;
    if (value.images.whichFileOption === UploadOptions.URL) {
      value.imageUrls = image.imageUrl;
    }

    if (value.images.whichFileOption === UploadOptions.UPLOAD) {
      value.imageUrls = image.image;
    }
    delete value.images;

    const selectedCategory = this.categories.filter(
      (element: CategoryModel) => {
        return element.name === value.category;
      }
    ) as CategoryModel[];
    value.category = selectedCategory[0]._id;

    this.isLoading = true;
    this._httpService.patch(`/product/${this.id}`, value).then(() => {
      this.isLoading = false;
      this._commonService.openSnackBar('Value is Updated', 'close');
      this._router.navigateByUrl('/home/product');
    });
  }

  getErrorMessage() {
    return 'This filed is required';
  }
}
