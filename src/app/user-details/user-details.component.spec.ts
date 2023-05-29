import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { AuthInterceptor } from '../interseptor/auth.interceptor';
import { UserAuthService } from '../service/user-auth.service';

import { UserDetailsComponent } from './user-details.component';

describe('UserDetailsComponent', () => {
  let component: UserDetailsComponent;
  let fixture: ComponentFixture<UserDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      declarations: [UserDetailsComponent],
      providers: [
        AuthInterceptor,
        UserAuthService,
        {
          provide: HTTP_INTERCEPTORS,
          useClass: AuthInterceptor,
          multi: true
        }
      ]
    });
    fixture = TestBed.createComponent(UserDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display nothing since user is null', () => {
    expect(component.user).toBeUndefined();

    fixture.detectChanges();

    const rootDiv = fixture.debugElement.query(By.css('.p-4'));
    expect(rootDiv).toBeFalsy();
  })

  it('should have a user property that is defined', () => {
    component.user = { login: 'octocat', id: 1, firstName: 'Octo', lastName: 'Cat', phoneNumber: '123456789', password: '123456789', role: 'user' };
    expect(component.user).toBeDefined();

    fixture.detectChanges();

    const userFirstName = fixture.debugElement.query(By.css('.p-4 .container')).children[0];
    expect(userFirstName.nativeElement.textContent).toContain(component.user.firstName);

    const userLastName = fixture.debugElement.query(By.css('.p-4 .container')).children[1];
    expect(userLastName.nativeElement.textContent).toContain(component.user.lastName);

    const userPhoneNumber = fixture.debugElement.query(By.css('.p-4 .container')).children[2];
    expect(userPhoneNumber.nativeElement.textContent).toContain(component.user.phoneNumber);

    const userLogin = fixture.debugElement.query(By.css('.p-4 .container')).children[3];
    expect(userLogin.nativeElement.textContent).toContain(component.user.login);
    
    const userRole = fixture.debugElement.query(By.css('.p-4 .container')).children[4];
    expect(userRole.nativeElement.textContent).toContain(component.user.role);
  })
  
});
