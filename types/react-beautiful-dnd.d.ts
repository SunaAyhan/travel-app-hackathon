declare module 'react-beautiful-dnd' {
  import { ReactNode, HTMLAttributes, DragEvent as ReactDragEvent, TransitionEvent as ReactTransitionEvent } from 'react';

  export interface DraggableProvidedDraggableProps {
    // inline style
    style?: DraggingStyle | NotDraggingStyle;
    // used for shared global styles
    'data-rbd-draggable-context-id': string;
    'data-rbd-draggable-id': string;
    onTransitionEnd?: (event: ReactTransitionEvent<any>) => void; // Changed to React.TransitionEvent
  }

  export interface DraggableProvidedDragHandleProps {
    'data-rbd-drag-handle-draggable-id': DraggableId;
    'data-rbd-drag-handle-context-id': string;
    'aria-describedby': string;
    role: string;
    tabIndex: number;
    draggable: boolean;
    onDragStart: (event: ReactDragEvent<any>) => void; // Changed to React.DragEvent
  }

  export interface DraggableProvided {
    innerRef: (element: HTMLElement | null) => any;
    draggableProps: DraggableProvidedDraggableProps;
    dragHandleProps: DraggableProvidedDragHandleProps | null;
  }

  export interface DraggableStateSnapshot {
    isDragging: boolean;
    isDropAnimating: boolean;
    dropAnimation?: DropAnimation;
    draggingOver?: DroppableId;
    combineWith?: DraggableId;
    combineTargetFor?: DraggableId;
    mode?: MovementMode;
  }

  export interface DroppableProvidedProps {
    // used for shared global styles
    'data-rbd-droppable-context-id': string;
    'data-rbd-droppable-id': DroppableId;
  }

  export interface DroppableProvided {
    innerRef: (element: HTMLElement | null) => any;
    placeholder?: ReactElement | null;
    droppableProps: DroppableProvidedProps;
  }

  export interface DroppableStateSnapshot {
    isDraggingOver: boolean;
    draggingOverWith?: DraggableId;
    draggingFromThisWith?: DraggableId;
    isUsingPlaceholder: boolean;
  }

  export type DraggableId = string;
  export type DroppableId = string;
  export type MovementMode = 'FLUID' | 'SNAP';
  export interface DropAnimation {
    duration: number;
    curve: string;
    moveTo: Position;
    opacity?: number;
    scale?: number;
  }
  export interface Position {
    x: number;
    y: number;
  }
  export interface DraggingStyle {
    position: 'fixed';
    top: number;
    left: number;
    boxSizing: 'border-box';
    width: number;
    height: number;
    transition: string;
    transform?: string;
    zIndex: number;
    opacity?: number;
    pointerEvents: 'none';
  }
  export interface NotDraggingStyle {
    transform?: string;
    transition?: string; // Changed from string | null
  }
  export type DropReason = 'DROP' | 'CANCEL';
  export interface DragUpdate extends DragStart {
    destination?: DraggableLocation | null;
    combine?: Combine | null;
  }
  export interface DragStart {
    draggableId: DraggableId;
    type: TypeId;
    source: DraggableLocation;
    mode: MovementMode;
  }
  export interface DraggableLocation {
    droppableId: DroppableId;
    index: number;
  }
  export interface Combine {
    draggableId: DraggableId;
    droppableId: DroppableId;
  }
  export type TypeId = string;


  export class DragDropContext extends React.Component<{
    onDragEnd: (result: DropResult, provided: ResponderProvided) => void;
    onDragStart?: (initial: DragStart, provided: ResponderProvided) => void;
    onDragUpdate?: (initial: DragUpdate, provided: ResponderProvided) => void;
    children: ReactNode;
    liftInstruction?: string;
    enableDefaultSensors?: boolean;
    sensors?: Sensor[];
  }> {}

  export class Droppable extends React.Component<{
    droppableId: DroppableId;
    type?: TypeId;
    isDropDisabled?: boolean;
    isCombineEnabled?: boolean;
    direction?: 'vertical' | 'horizontal';
    ignoreContainerClipping?: boolean;
    children: (provided: DroppableProvided, snapshot: DroppableStateSnapshot) => ReactNode;
    getContainerForClone?: () => HTMLElement;
    mode?: 'standard' | 'virtual';
    renderClone?: (provided: DraggableProvided, snapshot: DraggableStateSnapshot, rubric: DraggableRubric) => ReactNode;
  }> {}

  export class Draggable extends React.Component<{
    draggableId: DraggableId;
    index: number;
    children: (provided: DraggableProvided, snapshot: DraggableStateSnapshot, rubric: DraggableRubric) => ReactNode;
    isDragDisabled?: boolean;
    disableInteractiveElementBlocking?: boolean;
    shouldRespectForcePress?: boolean;
    type?: TypeId;
  }> {}

  export interface DropResult {
    reason: DropReason;
    destination?: DraggableLocation | null;
    source: DraggableLocation;
    draggableId: DraggableId;
    type: TypeId;
    mode: MovementMode;
    combine?: Combine | null;
  }
  export interface ResponderProvided {
    announce: (message: string) => void;
  }
  export interface DraggableRubric {
    draggableId: DraggableId;
    type: TypeId;
    source: DraggableLocation;
  }
   export type Sensor = (api: SensorAPI) => void;
  export interface SensorAPI {
    tryGetLock: (draggableId: DraggableId) => PreDrag | null;
    canGetLock: (draggableId: DraggableId) => boolean;
    isLockClaimed: () => boolean;
    tryReleaseLock: () => void;
    findClosestDraggableId: (event: Event) => DraggableId | null;
    findOptionsForDraggable: (draggableId: DraggableId) => DraggableOptions | null;
  }
  export interface PreDrag {
    fluidLift: (point: Position) => void;
    snapLift: () => void;
    abort: () => void;
  }
  export interface DraggableOptions {
    shouldRespectForcePress: boolean;
  }
}