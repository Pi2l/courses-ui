import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
    private userAuthService: UserAuthService
  ) { }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      login: ['', Validators.required],
      password: ['', Validators.required],
    });
  }
  
  get formControls() { return this.loginForm.controls; }

  onSubmit() {
    console.log(this.loginForm.value);
    this.userAuthService.login( this.loginForm.value.login, this.loginForm.value.password );
  }
}
