import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../model/User';
import { UserService } from '../service/user.service';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.css']
})
export class UserDetailsComponent {

  user?: User | null;

  constructor(
    private router: Router, 
    private userService: UserService
  ) { 
    this.user = this.userService.userValue;
  }

  logout() {
    this.userService.logout();
    this.router.navigateByUrl('/login');
  }
}
