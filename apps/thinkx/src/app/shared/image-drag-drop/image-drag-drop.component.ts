import { HttpClient } from '@angular/common/http';
import {
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatRadioChange } from '@angular/material/radio';
import { DomSanitizer } from '@angular/platform-browser';
import { FileHandle } from '../../shared/file-handle';
import { HttpService } from '../http-service.service';
import { UploadOptions } from '../upload-option.enum';
import { ImageUploadResponse } from './Image-upload-response.model';

@Component({
  selector: 'thinkx-image-drag-drop',
  templateUrl: './image-drag-drop.component.html',
  styleUrls: ['./image-drag-drop.component.scss'],
})
export class ImageDragDropComponent implements OnInit, OnChanges {
  @ViewChild('uploadFileInput') uploadFileInput: ElementRef | undefined;
  submitted = false;

  // radio button
  fileOption: UploadOptions = UploadOptions.URL;
  options: UploadOptions[] = [UploadOptions.URL, UploadOptions.UPLOAD];
  files: FileHandle[] = [];
  fileType: string = 'image/*';

  @Input() groupName = this._fb.group({});
  @Input() fieldLabel = 'Image Url';
  @Input() isTable?: boolean = false;
  @Input() isDisable?: boolean = false;
  @Input() isPdf?: boolean = false;
  @Input() imageSizePlaceholder?: string = 'Images with 400x500 resolution would look good on mobile';

  constructor(
    private _sanitizer: DomSanitizer,
    private _fb: FormBuilder,
    private _http: HttpService
  ) {}

  get f() {
    return this.groupName.controls;
  }

  get UploadOption() {
    return UploadOptions;
  }

  ngOnChanges(changes: SimpleChanges) {
    for (const propName in changes) {
      if (propName === 'isDisable') {
        if (!changes[propName].isFirstChange()) {
          if (changes.isDisable.previousValue !== undefined) {
            if (
              changes.isDisable.currentValue === true ||
              changes.isDisable.currentValue === false
            ) {
              this.isDisable = changes.isDisable.currentValue;
              this.isDisableChange();
            }
          }
        }
      }
    }
  }

  isDisableChange() {
    if (this.isDisable) {
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
      whichFileOption: UploadOptions.URL,
    });
    if (this.isDisable) {
      this.groupName.controls.whichFileOption.disable();
      this.groupName.controls.imageUrl.disable();
      this.groupName.controls.image.disable();
    }
    if(this.isPdf){
      this.fileType = ".pdf";
    }
  }

  getErrorMessage() {
    return 'This filed is required';
  }

  filesDropped(files: FileHandle[] | any): void {
    if (files.length === 0) {
      this.files = files;
    } else if (files.length >= 0) {
      this.files = [files[0]];
    }

    this.imageUploadApiCall(this.files);
  }

  uploadFileEvent(event: any) {
    if (event.target.files && event.target.files[0]) {
      const safeUrl = this._sanitizer.bypassSecurityTrustUrl(
        window.URL.createObjectURL(event.target.files[0])
      );
      const temp: FileHandle = {
        file: event.target.files[0],
        url: safeUrl,
      };
      this.files.push(temp);
      this.imageUploadApiCall(this.files);
    }
  }

  imageUploadApiCall(file: FileHandle[]): void {
    // calling Api
    const fb = new FormData();

    fb.append('file', file[0].file, file[0].file.name);

    this._http
      .post('/image', fb)
      .then((res) => {
        let response = res as ImageUploadResponse;
        const url = response.imageUrls[0];
        this.groupName.patchValue({
          image: url,
        });
      })
      .catch((err) => console.log(err));
  }

  uploadFile(): void {
    this.uploadFileInput?.nativeElement.click();
  }

  radioChange(e: MatRadioChange) {
    this.fileOption = e.value;
  }

  clearImage() {
    this.files = [];
  }
}
