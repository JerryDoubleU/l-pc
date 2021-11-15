import { Component } from '@angular/core';
import { fromEvent, map, Observable, of, startWith } from 'rxjs';
import { onErrorResumeNext } from 'rxjs/operators';
import { ElementDefinition, generateElementDefinitions } from './canvas-element';
import { DragService } from './drag.service';

@Component({
  selector: 'component-list',
  template: `<div>
      <draggable-component *ngFor="let elementDefiniton of elementDefinitions"
                           (mousedown)="mouseDown($event, elementDefiniton)"
                           [elementDefinition]="elementDefiniton">
      </draggable-component>
    </div>
    `,
  styles: [
    `draggable-component {
      display: block;
      position: relative;
      z-index: 1000;
    }`
  ]
})
export class ComponentListComponent {
  elementDefinitions = generateElementDefinitions();

  constructor(private dragService: DragService) {}

  mouseDown(mouseDownEvent: MouseEvent, elementDefinition: ElementDefinition) { // TODO: this in a service, and draggable component should be somewhere 'above' in the structure in the 'editor' scope

    this.dragService.newElementDragStart(mouseDownEvent, elementDefinition);
  }
}
