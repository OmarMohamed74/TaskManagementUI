import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class Sweetalert {

  constructor() { }

  success(message: string, title: string = 'Success'): void {
    Swal.fire({
      icon: 'success',
      title,
      text: message,
      confirmButtonColor: '#3085d6'
    });
  }

  error(message: string, title: string = 'Error'): void {
    Swal.fire({
      icon: 'error',
      title,
      text: message,
      confirmButtonColor: '#d33'
    });
  }
}

