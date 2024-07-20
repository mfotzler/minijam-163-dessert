import { EntityDefinition } from '../engine/entities/types';
import { System } from '../engine/types';
import { Pea } from '../entities/Enemies';
import { DessertComponents } from '../entities/types';
import BaseScene from '../scenes/BaseScene';
import { World } from '../world';

export class EnemySystem implements System {
	constructor(
		private world: World,
		private scene: BaseScene
	) {}

	step() {
		this.world.entityProvider.entities.forEach((entity) => {
			if (entity.enemy) {
				enemyBehaviors[entity.enemy.type](this.world, entity);
			}
		});
	}
}

const enemyBehaviors = {
	asparatato: (world: World, entity: EntityDefinition<DessertComponents>) => {
		const { enemy, render } = entity;
		if (!enemy || !render?.sprite) return;

		if (render.sprite.body.velocity.x === 0) {
			render.sprite.setVelocityX(100);
		} else if (enemy.stateTime > 60) {
			render.sprite.setVelocityX(-render.sprite.body.velocity.x);
			enemy.stateTime = 0;
		}

		if (enemy.stateTime % 30 === 0) {
			world.createEntity(Pea, {
				x: render.sprite.x,
				y: render.sprite.y + 50
			});
		}

		enemy.stateTime = (enemy.stateTime ?? 0) + 1;
	}
};
