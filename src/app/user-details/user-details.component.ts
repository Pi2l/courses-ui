import { Component } from '@angular/core';
import { User } from '../model/User';
import { UserAuthService } from '../service/user-auth.service';
import { UserService } from '../service/user.service';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.css']
})
export class UserDetailsComponent {

  user?: User | null;

  constructor(
    private userService: UserService,
    private authService: UserAuthService
  ) {
    this.authService.user.subscribe( user => {
      if (user !== null) {
        this.userService.getUserDetailsByLogin( user?.login ).subscribe( user => this.user = user.items[0] );
      }
    });
  }
}
