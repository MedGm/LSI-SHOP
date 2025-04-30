import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';

// Create an HTTP interceptor to add the auth token to requests
const authInterceptor = (req: any, next: any) => {
  // Get token from localStorage
  const token = localStorage.getItem('user') 
    ? JSON.parse(localStorage.getItem('user') || '{}').token 
    : null;
  
  // If token exists, add it to the request headers
  if (token) {
    const authReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`)
    });
    return next(authReq);
  }
  
  return next(req);
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideAnimations()
  ]
};
