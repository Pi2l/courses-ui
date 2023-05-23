import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { UserAuthService } from '../service/user-auth.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export default class LoginComponent implements OnInit {

  loginForm!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private userAuthService: UserAuthService,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      login: ['', Validators.required],
      password: ['', Validators.required],
    });

    this.loginForm.valueChanges.subscribe(() => {
      this.loginForm.controls['login'].setErrors(null);
      this.loginForm.controls['password'].setErrors(null);
    });
  }
  
  get formControls() { return this.loginForm.controls; }

  onSubmit() {
    this.userAuthService
      .login( this.loginForm.value.login, this.loginForm.value.password )
      .subscribe({
        next: () => {
          const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
          this.router.navigateByUrl(returnUrl);
        },
        error: () => {
          this.loginForm.controls['login'].setErrors({ 'incorrect': true, invalidLoginOrPassword: true });
          this.loginForm.controls['password'].setErrors({ 'incorrect': true });
        },
      });
  }
}
