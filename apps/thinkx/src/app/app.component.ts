import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'thinkx-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'thinkx';
  isLoading = true;

  ngOnInit() {
    this.isLoading = false;
  }
}
