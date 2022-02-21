export enum States {
  Start,
  DragStart,
  Moving,
  Stoped,
  Selected,
  PlacingComponent,
  AddingComponent
}

export enum Actions {
  AUTO,
  EvtDragStart,
  EvtDrag,
  EvtDrop,
  EvtDragEnd,
  StartAddComponent,
}

export type Meta = {
  type : string,
  w : number,
  h : number
}
