import { Injectable } from "@angular/core";
import { fromEvent, map, Observable, of, startWith, Subject, takeUntil } from "rxjs";
import { onErrorResumeNext, share, switchMap, tap, throttleTime } from "rxjs/operators";
import { ElementDefinition } from "./canvas-element";

const MARKER_OVERLAP = 2;

export interface DraggedElementData {
  clientX: number;
  clientY: number;
  positionStyle: { top: string; left: string; width: string; height: string; };
  elementDefinition: ElementDefinition;
}

export interface TargetHighlightData {
  highlightStyle: { top: string; left: string; width: string; height: string; };
  highlightType: 'line' | 'box';
}

@Injectable({
  providedIn: 'root'
})
export class DragService {
  draggedElementData$: Observable<DraggedElementData>;
  targetHighlight$: Observable<TargetHighlightData>;

  private dragStartEvent$ = new Subject<{
    mouseDownEvent: MouseEvent,
    elementDefinition: ElementDefinition,
    clientWidth: number,
    clientHeight: number;
  }>();

  constructor() {
    this.draggedElementData$ = this.dragStartEvent$.pipe(
      switchMap(({mouseDownEvent, elementDefinition, clientWidth, clientHeight}) => fromEvent<MouseEvent>(document.body, 'mousemove').pipe(
        startWith(mouseDownEvent),
        map(event => ({
          clientX: event.clientX,
          clientY: event.clientY,
          positionStyle: {
            top: `${event.pageY - mouseDownEvent.offsetY}px`,
            left: `${event.pageX - mouseDownEvent.offsetX}px`,
            width: `${clientWidth}px`,
            height: `${clientHeight}px`,
          },
          elementDefinition
        })),
        takeUntil(fromEvent(document.body, 'mouseup')),
        onErrorResumeNext(of(undefined))
      )),
      share()
    );

    this.targetHighlight$ = this.draggedElementData$.pipe(
      map(dragData => {
        if (!dragData) { return; }

        const targetElement = document.elementsFromPoint(dragData.clientX, dragData.clientY);
        const target = targetElement.find(element => element.classList.contains('component-boundry')) as HTMLElement;

        if (!target) { return; }

        const { x, y, width, height } = target.getBoundingClientRect();

        return {
          highlightStyle: {
            left: `${x}px`,
            top: `${y}px`,
            width: `${width}px`,
            height: `${height}px`,
          },
          highlightType: 'box'
        };
      })
    );
  }

  newElementDragStart(mouseDownEvent: MouseEvent, elementDefinition: ElementDefinition) { // TODO: this in a service, and draggable component should be somewhere 'above' in the structure in the 'editor' scope
    mouseDownEvent.preventDefault();

    const { clientWidth, clientHeight } = mouseDownEvent.target as HTMLElement;

    this.dragStartEvent$.next({
      mouseDownEvent, elementDefinition, clientWidth, clientHeight
    });
  }
}

function calculatePlacementMarker(event: MouseEvent) {
  // TODO: what if placed outside of any element? how to find the closest?

  const { offsetLeft, offsetTop, offsetWidth, offsetHeight } = (event.target as HTMLElement);

  const distances = [
    { handle: 'left', distance: event.offsetX },
    { handle: 'right', distance: offsetWidth - event.offsetX },
    { handle: 'top', distance: event.offsetY },
    { handle: 'bottom', distance: offsetHeight - event.offsetY },
    { handle: 'center', distance: 0 },
    { handle: 'left-half', distance: 0 },
    { handle: 'right-half', distance: 0 },
    // TODO: top-half?
    // TODO: bottom-half?
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
