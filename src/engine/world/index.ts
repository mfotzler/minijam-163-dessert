import { v4 } from 'uuid';
import { cloneDeep } from 'lodash';
import { EventEmitter } from 'events';
import { EventType } from '../types';
import { EntityDefinition } from '../entities/types';
import { EntityProvider } from './types';

export class EntityCollection<TComponents> implements EntityProvider<TComponents> {
  private entitiesMap: Map<string, EntityDefinition<TComponents>>;

  constructor(public events: EventEmitter) {
    this.entitiesMap = new Map();

    this.events.on(EventType.ADD_ENTITY, ({ entity }) => {
      this.addEntityData(entity);
    });
    this.events.on(EventType.DELETE_ENTITY, ({ entityId }) => {
      this.removeEntity(entityId);
    });
  }

  async destroy() {
    this.entitiesMap.clear();
  }

  public get entities(): EntityDefinition<TComponents>[] {
    return [...this.entitiesMap.values()];
  }

  createEntityId(): string {
    return v4();
  }

  getEntity(id: string): EntityDefinition<TComponents> | undefined {
    return this.entitiesMap.get(id);
  }

  private addEntity(entity: EntityDefinition<TComponents>) {
    this.entitiesMap.set(entity.id, entity);
  }

  private addEntityData(data: EntityDefinition<TComponents>): EntityDefinition<TComponents> {
    const { id } = data;
    const entity = cloneDeep(data);
    if (!this.entitiesMap.has(id)) {
      this.events.emit(EventType.ENTITY_PREINIT, { entity });
    }
    this.addEntity(entity);
    return entity;
  }

  private removeEntity(id: string): boolean {
    const removed = this.entitiesMap.delete(id);
    if (removed) {
      this.events.emit(EventType.ENTITY_DELETED, { entityId: id });
    }
    return removed;
  }
}
