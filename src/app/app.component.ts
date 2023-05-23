import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserToken } from './model/UserToken';
import { UserAuthService } from './service/user-auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  user?: UserToken | null

  constructor( private userService: UserAuthService, private router: Router ) {
    userService.user.subscribe( user => this.user = user );
  }

  logout() {
    this.userService.logout();
  }

  getUser() {
    this.userService.getUserDetails()
    .subscribe({
      next: (user) => {
        console.log(user);
      },
      error: (e) => { 
        console.log("failed to get user",e);
        this.userService.updateUser( null, '' );
        this.router.navigate(['/login']);
      }
    });
  }
  
}
