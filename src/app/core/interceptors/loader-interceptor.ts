import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { LoaderService } from '../services/Loader/loader.service';

export const loaderInterceptor: HttpInterceptorFn = (req, next) => {
  const loaderService = inject(LoaderService);

  const shouldSkipLoader = req.url.includes('/api/chat') || req.url.includes('/hubs/chat');

  if (!shouldSkipLoader) {
    loaderService.show();
  }

  return next(req).pipe(
    finalize(() => {
      if (!shouldSkipLoader) {
        loaderService.hide();
      }
    })
  );
};
