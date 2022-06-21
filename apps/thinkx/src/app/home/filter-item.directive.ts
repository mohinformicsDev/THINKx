import { Directive, HostListener } from '@angular/core';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[mat-filter-item]',
})
export class FilterItemDirective {
  @HostListener('click', ['$event'])
  onClick(e: MouseEvent) {
    e.stopPropagation();
    e.preventDefault();
    return false;
  }
}
