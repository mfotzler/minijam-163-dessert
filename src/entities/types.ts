export interface DessertComponents {
    position?: PositionComponent;
    movement?: MovementComponent;
    render?: RenderComponent;
    facing?: FacingComponent;
}

export interface RenderComponent {
    spriteKey: string;
}

export interface FacingComponent {
    direction: number;
}

export interface MovementComponent {
    velocityX: number;
    velocityY: number;
    killOnCollision?: boolean;
    baseSpeed?: number;
}

export interface PositionComponent {
    x: number;
    y: number;
}
