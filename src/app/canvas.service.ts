import { Injectable } from "@angular/core";
import { produce } from "immer";
import { BehaviorSubject } from "rxjs";
import { CanvasElement, generateElementDefinitions } from "./canvas-element";

@Injectable({
  providedIn: 'root'
})
export class CanvasService {
  elements$ = new BehaviorSubject<CanvasElement[]>([
    { ...generateElementDefinitions()[0], data: generateElementDefinitions()[0].initialData },
    { ...generateElementDefinitions()[2], data: generateElementDefinitions()[2].initialData },
    { ...generateElementDefinitions()[3], data: generateElementDefinitions()[3].initialData },
  ]);

  addElement(element: CanvasElement, atIndex: number) {
    this.elements$.next(produce(this.elements$.value, draft => {
      draft.splice(atIndex, 0, element);
    }));
  }
}