/* eslint-disable @angular-eslint/no-output-rename */
import {
  Directive,
  EventEmitter,
  HostBinding,
  HostListener,
  Output,
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { FileHandle } from '../file-handle';

@Directive({
  selector: '[thinkxImageDragDirectives]',
})
export class ImageDragDirective {
  @Output('files') files: EventEmitter<FileHandle[]> = new EventEmitter();
  @HostBinding('style.background') public background = '#eee';
  @HostBinding('style.color') public color = 'black';

  constructor(private sanitizer: DomSanitizer) {}

  @HostListener('dragover', ['$event']) public onDragOver(evt: DragEvent) {
    evt.preventDefault();
    evt.stopPropagation();
    this.background = '#3F51B5';
    this.color = 'white';
  }
  @HostListener('dragleave', ['$event']) public onDragLeave(evt: DragEvent) {
    evt.preventDefault();
    evt.stopPropagation();
    this.background = '#eee';
    // new color is added

    this.color = 'black';
  }
  @HostListener('drop', ['$event']) public onDrop(evt: DragEvent) {
    evt.preventDefault();
    evt.stopPropagation();
    this.background = '#eee';
    const files: FileHandle[] = [];
    if (evt.dataTransfer !== null) {
      for (let i = 0; i < evt.dataTransfer.files.length; i++) {
        const file = evt.dataTransfer.files[i];
        const url = this.sanitizer.bypassSecurityTrustUrl(
          window.URL.createObjectURL(file)
        );
        files.push({
          file,
          url,
        });
      }
    }
    if (files.length > 0) {
      this.files.emit(files);
    }
  }
}
