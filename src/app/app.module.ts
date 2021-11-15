import { NgModule } from '@angular/core';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { HelloComponent } from './hello.component';
import { ComponentListComponent } from './component-list.component';
import { DraggableComponentComponent } from './draggable-component.component';
import { TheCanvasComponent } from './the-canvas.component';

@NgModule({
  imports: [
    BrowserModule,
    DragDropModule,
    FormsModule
  ],
  declarations: [
    AppComponent,
    HelloComponent,
    ComponentListComponent,
    DraggableComponentComponent,
    TheCanvasComponent
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
