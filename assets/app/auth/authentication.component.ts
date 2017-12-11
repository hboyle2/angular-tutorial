import {Component} from "@angular/core";
import {AuthService} from "./auth.service"

@Component({
  selector: 'app-authentication',
  template: `
  <header class="row-spacing">
  <nav class="col-md-8 col-md-offset-2">
  <ul class="nav nav-tabs">
  <li routerLink="active"><a [routerLink] = "['signup']">Signup</a></li>
  <li routerLink="active" *ngIf="!isLoggedIn()"><a [routerLink] = "['signin']">Signin</a></li>
  <li routerLink="active" *ngIf="isLoggedIn()"><a [routerLink] = "['logout']">Logout</a></li>
  </ul>
  </nav>
  </header>
  <div class="row-spacing">
  <router-outlet></router-outlet>
  
  </div>
  `
})
export class AuthenticationComponent{
  constructor(private authService: AuthService){}
  isLoggedIn(){
    return this.authService.isLoggedIn();
  }
}