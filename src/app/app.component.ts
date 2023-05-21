import { Component } from '@angular/core';
import { User } from './model/User';
import { UserToken } from './model/UserToken';
import { UserAuthService } from './service/user-auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  user?: UserToken | null

  constructor( private userService: UserAuthService ) {
    userService.user.subscribe( user => this.user = user );
  }

  logout() {
    this.userService.logout();
  }
}
