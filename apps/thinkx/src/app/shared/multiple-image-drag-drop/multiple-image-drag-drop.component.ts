import { Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatRadioChange } from '@angular/material/radio';
import { DomSanitizer } from '@angular/platform-browser';
import { FileHandle } from '../../shared/file-handle';
import { HttpService } from '../http-service.service';
import { ImageUploadResponse } from '../image-drag-drop/Image-upload-response.model';
import { UploadOptions } from '../upload-option.enum';

@Component({
  selector: 'thinkx-multiple-image-drag-drop',
  templateUrl: './multiple-image-drag-drop.component.html',
  styleUrls: ['./multiple-image-drag-drop.component.scss']
})
export class MultipleImageDragDropComponent implements OnInit, OnChanges {

  constructor(
    private _sanitizer: DomSanitizer,
    private _fb: FormBuilder,
    private _http: HttpService
  ) { }

  
  @ViewChild('uploadFileInput') uploadFileInput: ElementRef | undefined;
  submitted = false;
  
  fileOption: UploadOptions = UploadOptions.URL;
  options: UploadOptions[] = [UploadOptions.URL, UploadOptions.UPLOAD];
  files: FileHandle[] = [];
  
  @Input() groupName = this._fb.group({});
  @Input() fieldLabel = 'Image Url';
  @Input() isTable?: boolean = false;
  @Input() isDisable?: boolean = false;
  @Input() imageSizePlaceholder?: string = 'Images with 400x500 resolution would look good on mobile';
  
  get f() {
    return this.groupName.controls;
  }

  get UploadOption(){
    return UploadOptions;
  }
  ngOnChanges(changes: SimpleChanges): void {
    for(const propName in changes){
      if(propName === 'isDisable'){
        if(!changes[propName].isFirstChange()){
          if(changes.isDisable.currentValue === true ||
            changes.isDisable.currentValue === false){
              this.isDisable = changes.isDisable.currentValue;
              this.isDisableChange();
            }
        }
      }
    }
  }

  isDisableChange(){
    if(this.isDisable){
      this.groupName.controls.whichFileOption.disable();
      this.groupName.controls.imageUrl.disable();
      this.groupName.controls.image.disable();
    } else {
      this.groupName.controls.whichFileOption.enable();
      this.groupName.controls.imageUrl.enable();
      this.groupName.controls.image.enable();
    }
  }

  ngOnInit(): void {
    this.groupName.patchValue({
      whichFileOption: UploadOptions.URL
    });
    this.addImageUrlField();
    if (this.isDisable) {
      this.groupName.controls.whichFileOption.disable();
      this.groupName.controls.imageUrl.disable();
      this.groupName.controls.image.disable();
    }
  }

  getErrorMessage() {
    return 'This filed is required';
  }

  filesDropped(files: FileHandle[] | any): void {
    if (files.length === 0) {
      this.files = files;
    } else if (files.length >= 0) {
      this.files = [...files];
    }

    this.imageUploadApiCall(this.files);
  }

  uploadFileEvent(event: any) {
    if (event.target.files && event.target.files?.length > 0) {
      for(let i: number = 0; i < event.target.files.length; i++){
        const safeUrl = this._sanitizer.bypassSecurityTrustUrl(
          window.URL.createObjectURL(event.target.files[i])
        );
        const temp: FileHandle = {
          file: event.target.files[i],
          url: safeUrl,
        };
        this.files.push(temp);
      }
      this.imageUploadApiCall(this.files);
    }
  }

  imageUploadApiCall(file: FileHandle[]): void {
    // calling Api
    const fb = new FormData();

    for(let i: number = 0; i<file.length; i++){
      fb.append('file', file[i].file, file[i].file.name);
    }

    this._http
      .post('/image', fb)
      .then((res) => {
        let response = res as ImageUploadResponse;
        const url = response.imageUrls;
        this.groupName.patchValue({
          image: url,
        });
      })
      .catch((err) => console.log(err));
  }

  newImageUrlControl(){
    return new FormControl('',Validators.required);
  }

  imageUrlsField() : FormArray{
    return this.groupName.get('imageUrl') as FormArray;
  }

  addImageUrlField() {
    this.imageUrlsField().push(this.newImageUrlControl())
  }

  removeImageUrlField(i: number){
    this.imageUrlsField().removeAt(i);
  }

  uploadFile(): void {
    this.uploadFileInput?.nativeElement.click();
  }

  radioChange(e: MatRadioChange) {
    this.fileOption = e.value;
    var component = this.imageUrlsField();
    if(this.fileOption == UploadOptions.UPLOAD){
      for(let i = 0; i < component.controls.length ; i++){
        component.controls[i].clearValidators()
        component.controls[i].updateValueAndValidity()
      }
    }else{
      for(let i = 0; i < component.controls.length ; i++){
        component.controls[i].setValidators(Validators.required)
        component.controls[i].updateValueAndValidity()
      }
    }
  }

  clearImage(index: number) {
    this.files.splice(index,1);
  }

}
