import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { Observable, Subject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

const oauth_config_key = 'oauth_config';
const oauth_code_key = 'oauth_code';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private apiUrl: String = 'http://localhost:3000';

  private authenticatedUser = new Subject < Object > ();
  constructor(router: Router, private http: HttpClient) {}

  public checkAuthentication() {

    // const authToken = this.getAuthToken();

    // return false;
    this.initiateLoginProcess();
  }

  private checkUrlParameters() {

    return Observable.create((observer) => {
      const urlParameters = window.location.search;
      if (urlParameters) {
        const oauthCode = this.decodeUri('code');
        localStorage.setItem(oauth_code_key, oauthCode);
        observer.next(oauthCode);
      } else {
        // Info may not have been set on the URL when this is called, we'll "pass through"
        observer.next();
      }
    });

  }

  private getOauthConfig() {

    return Observable.create((observer) => {
      const oauthConfig = localStorage.getItem(oauth_config_key);
      if (!oauthConfig) {
        this.http.get(`${this.apiUrl}/oauthparams`).subscribe((response) => {
          localStorage.setItem(oauth_config_key, JSON.stringify(response));
          return response;
        }, (error) => {
          console.log(`ERROR => getOauthConfig, ${error}`);
          observer.error(error);
        });
      } else {
        observer.next(JSON.parse(oauthConfig));
      }
    });

  }

  public initiateLoginProcess() {
    this.getOauthConfig().subscribe((oauthConfig) => {
      if (oauthConfig) {
        this.getOauthCode().subscribe((oauthCode) => {
          if (oauthCode) {
            this.getOauthToken(oauthConfig, oauthCode).subscribe((oauthToken) => {
              if (oauthToken) {
                this.getUserInfo(oauthToken).subscribe((userInfo) => {
                  this.setUserAuthentication(userInfo);
                }, (error) => {
                  console.log(
                    `ERROR => initiateLoginProcess: getUserInfo, ${error}`);
                });
              } else {
                console.log(`getOauthToken did not return token, logging out`);
                this.initiateLogoutPorcess();
              }
            }, (error) => {
              console.log(`ERROR => initiateLoginProcess: getOauthToken, ${error}`);
              this.initiateLogoutPorcess();
            });
          } else {
            this.redirectToOauthProvider(oauthConfig);
          }
        });
      } else {
        // Retry fetching oauth configuration
      }
    }, (error) => {
      console.log(`ERROR => initiateLoginProcess: getOauthConfig, ${error}`);
    });
  }

  private getUserInfo(oauthToken) {
    console.log('get user info');
    return Observable.create((observer) => {
      observer.next();
    });
  }

  private getOauthCode() {

    return Observable.create((observer) => {

      const oauthCode = localStorage.getItem(oauth_code_key);
      if (!oauthCode) {
        this.checkUrlParameters().subscribe((response) => {
          observer.next(response);
        });
      } else {
        observer.next(oauthCode);
      }
    });

  }

  private decodeUri(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    const regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    const results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
  }

  private getOauthToken(oauthConfig, oauthCode) {

    return Observable.create((observer) => {
      if (oauthConfig) {

        if (oauthCode) {

          const httpOptions = {
            headers: new HttpHeaders({
              'Accept': 'application/json',
              'Authorization': `Basic ${btoa(oauthConfig.client_id + ':' + oauthConfig.client_secret)}`,
              'Content-Type': 'application/x-www-form-urlencoded'
            })
          };

          const tokenUrl =
            `${oauthConfig.token_url}?code=${oauthCode}&grant_type=authorization_code&redirect_uri=${oauthConfig.token_redirect_uri}`;
          return this.http.post(tokenUrl, {}, httpOptions).subscribe((response) => {
            observer.next(response);
          }, (error) => {
            observer.error(`ERROR: getOauthToken => post returns ${error}`);
          });
        } else {
          observer.error(`ERROR: getOauthToken => oauthCode not defined`);
        }
      } else {
        observer.error(`ERROR: getOauthToken => oauthConfig not defined`);
      }
    });

  }

  private redirectToOauthProvider(oauthConfig) {
    console.log('redirect');
    window.location.href =
      `${oauthConfig.auth_url}?client_id=${oauthConfig.client_id}&redirect_uri=${oauthConfig.auth_redirect_uri}`;
  }

  private setUserAuthentication(userInfo) {
    console.log('setUserAuth');
    return Observable.create((observer) => {
      observer.next();
    });
  }

  private initiateLogoutPorcess() {
    console.log('logging out');
    return Observable.create((observer) => {
      observer.next();
    });
  }
}