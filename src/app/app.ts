import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Loader } from './shared/loader/loader';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, Loader],
  template: `
    <app-loader />
    <router-outlet />
  `
})
export class App {}
