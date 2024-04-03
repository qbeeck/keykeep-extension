import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";
import { APP_PATHS } from "../app.paths";
import { JwtHelperService } from "@auth0/angular-jwt";
import { aesEncrypt } from "../helpers";
import { BehaviorSubject, Observable, from, switchMap, take, tap } from "rxjs";

export const JWT_STORAGE_KEY = "keykeep_token";
export const MASTER_KEY = "keykeep_key";

@Injectable({
  providedIn: "root",
})
export class AuthenticationService {
  readonly isAuthorized = new BehaviorSubject(false);
  readonly token = new BehaviorSubject("");

  constructor(
    private readonly router: Router,
    private readonly http: HttpClient,
    private readonly jwtHelper: JwtHelperService,
    private readonly snackbar: MatSnackBar
  ) {
    this.setIsAuthorized();
  }

  login(email: string, password: string): Observable<{ access_token: string }> {
    return from(aesEncrypt(password, password)).pipe(
      take(1),
      tap((value) => console.log(value)),
      switchMap((encryptedPassword) =>
        this.http
          .post<{ access_token: string }>("http://localhost:3000/users/login", {
            email,
            password: encryptedPassword,
          })
          .pipe(
            tap((value) => console.log(value)),
            tap({
              next: (resposne) => {
                this.snackbar.open("Successfully logged in", "", {
                  duration: 1000,
                });

                this.setJWT(resposne.access_token);
                this.setMasterKey(password);
                this.isAuthorized.next(true);
                //sssssssss

                this.router.navigate([APP_PATHS.DASHBOARD]);

                chrome.runtime.sendMessage({
                  action: "userLoggedIn",
                  data: {
                    access_token: resposne.access_token,
                    masterKey: password,
                  },
                });
              },
              error: (response) => {
                // this.snackbar.open(response.error.message);
              },
            })
          )
      )
    );
  }

  logout(): void {
    this.removeJWT();
    this.removeMasterKey();
    this.isAuthorized.next(false);

    this.router.navigate([APP_PATHS.LOGIN]);
  }

  setIsAuthorized(): void {
    chrome.storage.session.get().then((session) => {
      if (session[JWT_STORAGE_KEY] && session[MASTER_KEY]) {
        this.token.next(session[JWT_STORAGE_KEY]);

        const isTokenExpired = this.jwtHelper.isTokenExpired(
          session[JWT_STORAGE_KEY]
        );

        this.isAuthorized.next(!isTokenExpired);

        if (!isTokenExpired) {
          this.router.navigate([APP_PATHS.DASHBOARD]);
        }
      }
    });
  }

  private setJWT(token: string): void {
    chrome.storage.session.set({ [JWT_STORAGE_KEY]: token });
  }

  private setMasterKey(key: string): void {
    chrome.storage.session.set({ [MASTER_KEY]: key });
  }

  private removeJWT(): void {
    chrome.storage.session.remove(JWT_STORAGE_KEY);
  }

  private removeMasterKey(): void {
    chrome.storage.session.remove(MASTER_KEY);
  }
}
