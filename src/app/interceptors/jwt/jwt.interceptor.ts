import {
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
} from "@angular/common/http";
import { inject } from "@angular/core";
import { AuthenticationService } from "../../authentication";
import { throwError } from "rxjs";

export const jwtInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
) => {
  const authentication = inject(AuthenticationService);

  if (!authentication.token.value) return next(req);

  if (!authentication.isAuthorized.value) {
    authentication.logout();

    const error = "Session expired. Please login again";

    return throwError(() => error);
  }

  const clonedReq = req.clone({
    headers: req.headers.set(
      "Authorization",
      "Bearer " + authentication.token.value
    ),
  });

  return next(clonedReq);
};
