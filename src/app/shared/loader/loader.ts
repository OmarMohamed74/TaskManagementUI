
import { Component, OnInit } from '@angular/core';
import { LoaderService } from '../../core/services/Loader/loader.service';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-loader',
  imports: [AsyncPipe],
  templateUrl: './loader.html',
  styleUrl: './loader.scss',
})
export class Loader implements OnInit {
  loading$!: Observable<boolean>;

  constructor(private loaderService: LoaderService) { }

  ngOnInit(): void {
    this.loading$ = this.loaderService.loading$;
  }
}

