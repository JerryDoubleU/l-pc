export type ElementType = 'container' | 'header' | 'text' | 'image' | 'card' | 'table';

export interface ElementBase {
  type: ElementType;
  name: string;
}

export interface ElementDefinition<T = any> extends ElementBase {
  initialData: T;
}

export interface CanvasElement<T = any> extends ElementBase {
  data: T;
}

export function generateElementDefinitions(): ElementDefinition<any>[] {
  return [
    {
      type: 'container',
      name: 'Container',
      initialData: {}
    },
    {
      type: 'card',
      name: 'Card',
      initialData: {}
    },
    {
      type: 'header',
      name: 'Header',
      initialData: {}
    },
    {
      type: 'text',
      name: 'Text',
      initialData: {}
    },
    {
      type: 'image',
      name: 'Image',
      initialData: {}
    },
    {
      type: 'table',
      name: 'Table',
      initialData: {}
    },
  ];
}
