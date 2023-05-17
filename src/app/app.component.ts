import { Component } from '@angular/core';
import { User } from './model/User';
import { UserService } from './service/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  user?: User | null

  constructor( private userService: UserService) {
    userService.user.subscribe( user => this.user = user );
  }

  logout() {
    this.userService.logout();
  }
}
