export enum Direction {
    LEFT = 0,
    RIGHT = 1
}

export interface DessertComponents {
    position?: PositionComponent;
    movement?: MovementComponent;
    render?: RenderComponent;
    facing?: FacingComponent;
    collision?: CollisionComponent;
    input?: InputComponent;
}

export interface RenderComponent {
    spriteKey: string;
    sprite?: Phaser.Physics.Arcade.Sprite;
    followWithCamera?: boolean;
}

export interface FacingComponent {
    direction: Direction;
}

export interface MovementComponent {
    hasGravity?: boolean;
    killOnCollision?: boolean;
    initialSpeed?: { x: number, y: number };
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

// just exists to say input controls it
export interface InputComponent {}
