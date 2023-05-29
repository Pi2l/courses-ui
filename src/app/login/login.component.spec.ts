import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import { MaterialModule } from '../mat-module.module';
import { UserAuthService } from '../service/user-auth.service';

import LoginComponent from './login.component';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, 
        MaterialModule,
        BrowserModule,
        MatButtonModule,
        MatInputModule,
        FormsModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
        RouterTestingModule,
      ],
      declarations: [ LoginComponent ],
    });
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  
  it('should login user', () => {
    const userAuthService = TestBed.inject(UserAuthService);
    
    spyOn(userAuthService, 'login').and.returnValue( of({
      login: "user",
      accessToken: "testAccessToken",
      refreshToken: "testRefreshToken",
      accessTokenLifetimeMinutes: 1,
      refreshTokenLifetimeMinutes: 10,
    }) )
    
    const loginForm = { login: 'user', password: 'password' };
    component.loginForm.setValue(loginForm);

    component.onSubmit();
    expect(userAuthService.login).toHaveBeenCalledWith(loginForm.login, loginForm.password);
  });

  it('should not login user', () => {
    const userAuthService = TestBed.inject(UserAuthService);
    
    spyOn(userAuthService, 'login').and.returnValue( throwError(() => new Error('error')) )
    
    const loginForm = { login: 'user', password: 'password' };
    component.loginForm.setValue(loginForm);
    component.onSubmit();
    expect(userAuthService.login).toHaveBeenCalledWith(loginForm.login, loginForm.password);

    expect(component.loginForm.controls['login'].getError('invalidLoginOrPassword')).toBeTruthy();
    expect(component.loginForm.controls['login'].getError('incorrect')).toBeTruthy();
    expect(component.loginForm.controls['password'].getError('incorrect')).toBeTruthy();
  });

});
