import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { isLoading, State } from './state';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'budgeter';
  isLoading = false;

  constructor(private store: Store<State>) { }

  ngOnInit(): void {
    this.store.select(isLoading).subscribe(state => console.log(state));
  }
}
