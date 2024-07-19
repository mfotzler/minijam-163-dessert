export interface DessertComponents {
    position?: PositionComponent;
    movement?: MovementComponent;
    render?: RenderComponent;
    facing?: FacingComponent;
    collision?: CollisionComponent;
}

export interface RenderComponent {
    spriteKey: string;
    sprite?: Phaser.Physics.Arcade.Sprite;
}

export interface FacingComponent {
    direction: number;
}

export interface MovementComponent {
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
