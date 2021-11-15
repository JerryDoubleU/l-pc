import { Component, Input } from '@angular/core';
import { ElementDefinition } from './canvas-element';

@Component({
  selector: 'draggable-component',
  template: `<div class="item">{{elementDefinition.name}}</div>`,
  styles: [
    `.item {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 75px;
      height: 75px;
      margin: .25rem;
      font-size: .75rem;
      background: #ddd;
      border: solid 1px #bbb;
      box-sizing: border-box;
    }`
  ]
})
export class DraggableComponentComponent {
  @Input() elementDefinition: ElementDefinition;
}
