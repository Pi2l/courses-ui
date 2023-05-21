import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../model/User';
import { UserAuthService } from '../service/user-auth.service';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.css']
})
export class UserDetailsComponent {

  user?: User | null;

  constructor(
    private router: Router, 
    private userService: UserAuthService
  ) { 
    // this.user = this.userService.getUser;
  }

  logout() {
    this.userService.logout();
    this.router.navigateByUrl('/login');
  }
}
