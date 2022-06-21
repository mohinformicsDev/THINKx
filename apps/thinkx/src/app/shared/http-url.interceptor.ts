import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

/** Pass untouched request through to the next request handler. */
@Injectable()
export class HttpUrlInterceptor implements HttpInterceptor {
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const secureReq = req.clone({
      url: environment.baseUrl + req.url,
      body: req.body,
    });
    return next.handle(secureReq);
  }
}
