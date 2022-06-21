import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { HttpService } from '../../shared/http-service.service';
import { CommonService } from '../../shared/service/common.service';
import { AuthService } from '../auth.service';
@Component({
  selector: 'thinkx-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  user = '1';
  isLoginProcessing = false;
  submitted = false;
  login = new FormGroup({
    loginEmail: new FormControl(
      { value: '', disabled: this.isLoginProcessing },
      [Validators.required, Validators.nullValidator, Validators.email]
    ),
    loginPassword: new FormControl('', [
      Validators.required,
      Validators.nullValidator,
    ]),
  });

  constructor(
    private _commonService: CommonService,
    private _router: Router,
    private authService: AuthService,
    private _httpService: HttpService
  ) {
    this._commonService.setTitle('Login');
  }

  // getting the value or getter
  get f() {
    return this.login.controls;
  }

  getErrorMessage() {
    return 'This Field is required';
  }

  onSubmit() {
    // this._httpService.post('/admin', {});
    this.submitted = true;
    this.isLoginProcessing = true;

    const admin = environment.admin;

    if (!this.login.invalid) {
      const data = this.login.value;
      if (
        data.loginEmail.toString().toLowerCase() ===
          admin.email.toString().toLowerCase() &&
        data.loginPassword === admin.password
      ) {
        // (this.login.value);

        const error = 'Login Successfully';
        console.log(error);
        this._commonService.openSnackBar(error, 'close');
        localStorage.setItem('sessionUser', this.user);

        // TODO: Remove setTimeOut with api processing
        setTimeout(() => {
          this.isLoginProcessing = false;
          this._router.navigateByUrl('/home/dashboard');
        }, 3000);
      } else {
        const error = 'Invalid Username and password';
        console.log(error);
        this._commonService.openSnackBar(error, 'close');

        // TODO: Remove setTimeOut with api processing
        setTimeout(() => {
          this.isLoginProcessing = false;
        }, 3000);
      }
    } else {
      console.log('some error occurred');
      this.isLoginProcessing = false;
    }
  }

  ngOnInit(): void {
    if (this.authService.getToken()) {
      this._router.navigateByUrl('/home/dashboard');
    }
  }
}
