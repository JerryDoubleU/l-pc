import { Component } from '@angular/core';
import { DragService } from './drag.service';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.css' ]
})
export class AppComponent {
  constructor(public dragService: DragService) {}
}
