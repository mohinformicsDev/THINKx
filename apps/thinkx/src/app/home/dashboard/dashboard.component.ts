import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { DashboardModel } from '../../model/dashboard.model';
import { HttpService } from '../../shared/http-service.service';
import { LoadingOption } from '../../shared/loading-options.enum';
import { CommonService } from '../../shared/service/common.service';

type cardData = {
  title: string;
  cols: string;
  rows: string;
  data: string;
};

@Component({
  selector: 'thinkx-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {
  /** Based on the screen size, switch from standard to one column per row */
  cards: cardData[] = [];
  isLoading = true;
  isLoadingType: LoadingOption = LoadingOption.NEW;

  constructor(
    private _commonService: CommonService,
    private _httpService: HttpService
  ) {
    this._commonService.setTitle('Dashboard');
    this.getResponse();
  }
  get loadingOption() {
    return LoadingOption;
  }
  async getResponse() {
    try {
      const data = await this._httpService.get<DashboardModel>('/dashboard');
      this.cards.push({
        title: 'Total Customer',
        cols: '1',
        rows: '1',
        data: data.customer,
      });
      this.cards.push({
        title: 'Total Product',
        cols: '1',
        rows: '1',
        data: data.product,
      });
      this.cards.push({
        title: 'Total Device',
        cols: '1',
        rows: '1',
        data: data.device,
      });
      this.cards.push({
        title: 'Total Oem',
        cols: '1',
        rows: '1',
        data: data.oem,
      });
    } catch (error) {
      console.log(error);
      this._commonService.openSnackBar(error?.message, 'close');
    } finally {
      this.isLoading = false;
    }
  }
}
