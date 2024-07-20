import { WeaponType } from "./Weapons";

export enum Direction {
    LEFT = 0,
    RIGHT = 1
}

export interface DessertComponents {
    player?: PlayerComponent;
    position?: PositionComponent;
    movement?: MovementComponent;
    render?: RenderComponent;
    facing?: FacingComponent;
    collision?: CollisionComponent;
    input?: InputComponent;
    projectile?: ProjectileComponent;
}

export interface RenderComponent {
    spriteKey: string;
    sprite?: Phaser.Physics.Arcade.Sprite;
}

export interface FacingComponent {
    direction: Direction;
}

export interface MovementComponent {
    hasGravity?: boolean;
    killOnCollision?: boolean;
    initialVelocity?: { x: number, y: number };
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

export interface ProjectileComponent {
    // used to check max number allowed alive
    type: WeaponType;
    // shot speed
    speed: number;
    // how many ticks between shots
    cooldown: number;
}

// just exists to say input controls it
export interface InputComponent {}

export interface PlayerComponent {
    currentWeapon: WeaponType;
    shotCooldown: number;
}
