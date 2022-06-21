import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { modelTypeArray } from './custome-type/mode-type-array.type';
import { modelTypeIndividual } from './custome-type/mode-type-individual.type';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  constructor(private _http: HttpClient) { }

  get<T>(url: string): Promise<T> {
    return this._http
      .get<T>(url)
      .toPromise();
  }

  post(url: string, data: any): Promise<modelTypeArray | modelTypeIndividual> {
    return this._http
      .post<modelTypeArray | modelTypeIndividual>(url, data)
      .toPromise();
  }

  delete(url: string): Promise<modelTypeArray | modelTypeIndividual> {
    return this._http
      .delete<modelTypeArray | modelTypeIndividual>(url)
      .toPromise();
  }

  patch(url: string, data: any): Promise<modelTypeArray | modelTypeIndividual> {
    return this._http
      .patch<modelTypeArray | modelTypeIndividual>(url, data)
      .toPromise();
  }
}
