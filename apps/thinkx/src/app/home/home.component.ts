import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { CommonService } from '../shared/service/common.service';
@Component({
  selector: 'thinkx-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(
      map((result) => result.matches),
      shareReplay()
    );
  
  isPortrait$: Observable<boolean> = this.breakpointObserver
      .observe(Breakpoints.HandsetPortrait)
      .pipe(map((result) => result.matches),
      shareReplay()
    );


  constructor(
    private breakpointObserver: BreakpointObserver,
    private _router: Router,
    private _commonService: CommonService
  ) {
    this._commonService.setTitle('Home');
  }

  logout() {
    localStorage.removeItem('sessionUser');
    this._router.navigateByUrl('/auth/login');
  }

  onSelectMenu(drawer: any){
    this.isPortrait$.subscribe(e => {
      if(e && !drawer.closedStart.closed){
        drawer.close()
      }
    })
  }

}
