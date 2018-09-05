import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { AuthenticationService } from '../services/authentication.service';

const ROUTES = [{ path: '**', component: AppComponent }];
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot(ROUTES, { useHash: true })
  ],
  providers: [AuthenticationService],
  bootstrap: [AppComponent]
})
export class AppModule {}