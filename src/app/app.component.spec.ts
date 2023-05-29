import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientModule],
      declarations: [AppComponent]  
    })

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should show nav', () => {
    component.user = {
      login: "login1",
      accessToken: "testAccessToken",
      refreshToken: "testRefreshToken",
      accessTokenLifetimeMinutes: 1,
      refreshTokenLifetimeMinutes: 10
    };
    fixture.detectChanges();

    const button = fixture.debugElement.query(By.css('button'));
    expect(button).toBeTruthy();
    expect(button.nativeElement.textContent).toContain('Logout');
  })

  it('should not show nav when user is null', () => {
    expect(component.user).toBeNull();
    fixture.detectChanges();

    const rootDiv = fixture.debugElement.query(By.css('nav'));
    expect(rootDiv).toBeFalsy();
  })

  it('should logout when logout button is clicked', () => {
    component.user = {
      login: "login1",
      accessToken: "testAccessToken",
      refreshToken: "testRefreshToken",
      accessTokenLifetimeMinutes: 1,
      refreshTokenLifetimeMinutes: 10
    };
    fixture.detectChanges();

    spyOn(component, 'logout');

    const button = fixture.debugElement.query(By.css('button'));
    button.nativeElement.click('click', null);
    
    expect(component.logout).toHaveBeenCalled();
  })
});
