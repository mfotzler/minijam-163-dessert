import { DessertComponents } from "./types";

export const FrostingShot: DessertComponents = {
    movement: { killOnCollision: true, hasGravity: true },
    collision: { tiles: false },
    render: { spriteKey: 'coin' },
    projectile: { type: 'frosting', speed: 800, cooldown: 30 }
};

export const SprinkleShot: DessertComponents = {
    movement: { killOnCollision: true, hasGravity: false },
    collision: { tiles: false },
    render: { spriteSheet: 'sprinkle', scale: 4 },
    projectile: { type: 'sprinkle', speed: 1000, cooldown: 15 }
};

export const Weapons = {
    frosting: FrostingShot,
    sprinkle: SprinkleShot
};

export type WeaponType = keyof typeof Weapons;
