import { v4 } from 'uuid';
import { cloneDeep } from 'lodash';
import { EventType } from '../types';
import { EntityDefinition } from '../entities/types';
import { EntityProvider } from './types';
import MessageBus from '../../messageBus/MessageBus';

export class EntityCollection<TComponents> implements EntityProvider<TComponents> {
  private entitiesMap: Map<string, EntityDefinition<TComponents>>;

  constructor() {
    this.entitiesMap = new Map();

    MessageBus.subscribe(EventType.ADD_ENTITY, ({ entity }) => {
      this.addEntityData(entity);
    });
    MessageBus.subscribe(EventType.DELETE_ENTITY, ({ entityId }) => {
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
      MessageBus.sendMessage(EventType.ENTITY_PREINIT, { entity });
    }
    this.addEntity(entity);
    return entity;
  }

  private removeEntity(id: string): boolean {
    const removed = this.entitiesMap.delete(id);
    if (removed) {
      MessageBus.sendMessage(EventType.ENTITY_DELETED, { entityId: id });
    }
    return removed;
  }
}
