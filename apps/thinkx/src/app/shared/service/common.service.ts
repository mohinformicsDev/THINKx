import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Title } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root',
})
export class CommonService {
  title = 'Thinkx';
  constructor(
    private _snackBar: MatSnackBar,
    private _dialog: MatDialog,
    private _titleService: Title
  ) {}

  openDialog(_component: any, _width: string, _data?: any) {
    const dialogRef = this._dialog.open(_component, {
      width: _width,
      data: _data,
      disableClose: true,
    });
    return dialogRef;
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 3000,
    });
  }

  setTitle(_component: string = '') {
    _component === ''
      ? this._titleService.setTitle(`${this.title}`)
      : this._titleService.setTitle(`${this.title} | ${_component}`);
  }
}
