export interface PositionComponent {
    x: number;
    y: number;
}

export interface MovementComponent {
    velocityX: number;
    velocityY: number;
}

export interface ExampleComponents {
    position?: PositionComponent;
    movement?: MovementComponent;
}
