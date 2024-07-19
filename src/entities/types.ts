export interface DessertComponents {
    position?: PositionComponent;
    movement?: MovementComponent;
    render?: RenderComponent;
    facing?: FacingComponent;
    collision?: CollisionComponent;
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

export interface CollisionComponent {
    tiles?: boolean;
    blocked?: {
        up: boolean;
        down: boolean;
        left: boolean;
        right: boolean;
    }
}
