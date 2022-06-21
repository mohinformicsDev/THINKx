import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'thinkx-show-image-dialog',
  templateUrl: './show-image-dialog.component.html',
  styleUrls: ['./show-image-dialog.component.scss'],
})
export class ShowImageDialogComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<ShowImageDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {
    this.dialogRef.keydownEvents().subscribe((event) => {
      if (event.key === 'Escape') {
        this.onClose();
      }
    });

    this.dialogRef.backdropClick().subscribe(() => {
      this.onClose();
    });
  }

  onClose(): void {
    this.dialogRef.close(false);
  }
}
