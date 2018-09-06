import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnDestroy, OnInit {

  private userSubscription: Subscription;
  public userName: any = '';

  constructor(private authenticationService: AuthenticationService) {}

  ngOnInit() {
    this.authenticationService.checkAuthentication();
    this.userSubscription = this.authenticationService.authenticatedUser.subscribe((userInfo) => {
      this.userName = userInfo;
    });
  }

  ngOnDestroy() {

    this.userSubscription.unsubscribe();

  }

  public login() {
    this.authenticationService.initiateLoginProcess();
  }

  public logout() {
    this.authenticationService.initiateLogoutPorcess();
  }

}