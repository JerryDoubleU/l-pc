import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { fromEvent, map, merge, Observable } from 'rxjs';
import { CanvasElement } from './canvas-element';
import { CanvasService } from './canvas.service';

const MARKER_OVERLAP = 2;

@Component({
  selector: 'the-canvas',
  template: `
    <div class="wrapper">
      <div #canvasRef class="canvas">
        <div class="element component-boundry" *ngFor="let element of elements$ | async">{{ element.type }}</div>
      </div>
      <ng-container *ngIf="elementPlacementMarker$ | async as marker">
        <div class="placementMarker" [style]="marker.placementStyle"></div>
        <div class="placementElement" [style]="marker.elementStyle"></div>
      </ng-container>
    </div>
  `,
  styles: [
    `.wrapper {
      position: relative;
    }`,
    `.canvas {
      display: block;
      width: 100%;
      height: 100%;
    }`,
    `.element {
      padding: 1rem;
      min-height: 32px;
      border: solid 1px #eee;
    }`,
    `.placementMarker {
      position: absolute;
      background: red;
      pointer-events: none;
      opacity: .6;
    }`,
    `.placementElement {
      position: absolute;
      border: dashed 1px #888;
      pointer-events: none;
    }`,
  ]
})
export class TheCanvasComponent implements OnInit {
  elementPlacementMarker$: Observable<{
    placementStyle: { top: string; left: string; width: string; height: string; },
    elementStyle: { top: string; left: string; width: string; height: string; }
  }>;
  elements$: Observable<CanvasElement[]>;

  @ViewChild('canvasRef', { static: true }) canvasRef: ElementRef<HTMLDivElement>;

  constructor(private canvasService: CanvasService) {
    this.elements$ = this.canvasService.elements$;
  }

  ngOnInit() {
    // TODO: move this logic to a service outside of canvas - to the editor scope; also presentation should happen in the editor scope
    this.elementPlacementMarker$ = merge(
      fromEvent<MouseEvent>(this.canvasRef.nativeElement, 'mousemove'),
      fromEvent<MouseEvent>(this.canvasRef.nativeElement, 'mouseleave')
    ).pipe(
      map(event => {
        if (event.type === 'mouseleave') {
          return undefined;
        } else if (event.type === 'mousemove') {
          return {
            placementStyle: calculatePlacementMarker(event),
            elementStyle: calculateElementMarker(event)
          };
        }
      })
    );
  }
}

function calculatePlacementMarker(event: MouseEvent) {
  const { offsetLeft, offsetTop, offsetWidth, offsetHeight } = (event.target as HTMLElement);

  const distances = [
    { handle: 'left', distance: event.offsetX },
    { handle: 'right', distance: offsetWidth - event.offsetX },
    { handle: 'top', distance: event.offsetY },
    { handle: 'bottom', distance: offsetHeight - event.offsetY },
  ];

  distances.sort((a, b) => a.distance - b.distance);

  switch (distances[0].handle) {
    case 'left': 
      return {
        top: offsetTop - MARKER_OVERLAP + 'px',
        left: offsetLeft - MARKER_OVERLAP + 'px',
        width: MARKER_OVERLAP * 2 + 'px',
        height: offsetHeight + MARKER_OVERLAP * 2 + 'px',
      };
    case 'right': 
      return {
        top: offsetTop - MARKER_OVERLAP + 'px',
        left: offsetLeft + offsetWidth - MARKER_OVERLAP + 'px',
        width: MARKER_OVERLAP * 2 + 'px',
        height: offsetHeight + MARKER_OVERLAP * 2 + 'px',
      };
    case 'top':
      return {
        top: offsetTop - MARKER_OVERLAP + 'px',
        left: offsetLeft - MARKER_OVERLAP + 'px',
        width: offsetWidth + MARKER_OVERLAP * 2 + 'px',
        height: MARKER_OVERLAP * 2 + 'px',
      };
    case 'bottom':
    default:
      return {
        top: offsetTop + offsetHeight - MARKER_OVERLAP + 'px',
        left: offsetLeft - MARKER_OVERLAP + 'px',
        width: offsetWidth + MARKER_OVERLAP * 2 + 'px',
        height: MARKER_OVERLAP * 2 + 'px',
      };
  }
}

function calculateElementMarker(event: MouseEvent) {
  const { offsetLeft, offsetTop, offsetWidth, offsetHeight } = (event.target as HTMLElement);

  return {
    top: offsetTop + 'px',
    left: offsetLeft + 'px',
    width: offsetWidth + 'px',
    height: offsetHeight + 'px',
  };
}

