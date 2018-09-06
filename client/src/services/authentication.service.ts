import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { Observable, BehaviorSubject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

const oauth_config_key = 'oauth_config';
const oauth_code_key = 'oauth_code';
const oauth_jwt_key = 'auth';
const oauth_token_key = 'oauth_token';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private apiUrl: String = 'http://localhost:3000';

  public authenticatedUser = new BehaviorSubject < Object > ('');
  constructor(router: Router, private http: HttpClient) {}

  /**
   * checkAuthentication - Use to determine if a user is authenticated with the application, if not will initiate the login process
   */
  public checkAuthentication() {

    const authenticationToken = this.getAuthenticationToken();

    if (authenticationToken) {
      return true;
    }

    this.initiateLoginProcess();
  }

  /**
   * checkUrlParameters - Use to check or examine the browsers url for information that may be passed as part of a redirect uri
   */
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

  /**
   * cleanupAuthenticationArtifacts - Use to 'clean up' or remove artifacts from local storage
   * @param { Array } arrayArtifacts - An array of string values representing the name of each localstorage item to be removed
   */
  private cleanupAuthenticationArtifacts(arrayArtifacts) {

    arrayArtifacts.forEach(element => {
      localStorage.removeItem(element);
    });

  }

  private getAuthenticationToken() {
    const authenticationToken = localStorage.getItem(oauth_jwt_key);
    if (authenticationToken) {
      return authenticationToken;
    }
    return false;
  }

  private getOauthConfig() {

    return Observable.create((observer) => {
      const oauthConfig = localStorage.getItem(oauth_config_key);
      if (!oauthConfig) {
        // Cleanup other artifacts here?
        if (localStorage.getItem(oauth_code_key)) {
          const arrayToRemove = [oauth_code_key, oauth_jwt_key, oauth_token_key];
          this.cleanupAuthenticationArtifacts(arrayToRemove);
        }
        this.http.get(`${this.apiUrl}/oauthparams`).subscribe((response) => {
          localStorage.setItem(oauth_config_key, JSON.stringify(response));
          observer.next(response);
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
      const str = 'ghjitfvbuioi';
      observer.next(str);
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
            localStorage.setItem(oauth_token_key, JSON.stringify(response));
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

    localStorage.setItem(oauth_jwt_key, JSON.stringify(userInfo));
    this.authenticatedUser.next(userInfo);
    const arrayToRemove = [oauth_code_key, oauth_config_key, oauth_token_key];
    this.cleanupAuthenticationArtifacts(arrayToRemove);

  }

  public initiateLogoutPorcess() {
    console.log('logging out');
    const arrayToRemove = [oauth_code_key, oauth_config_key, oauth_jwt_key, oauth_token_key];
    this.cleanupAuthenticationArtifacts(arrayToRemove);
  }
}