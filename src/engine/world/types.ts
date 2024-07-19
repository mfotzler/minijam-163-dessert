import EventEmitter from "events";
import { EntityDefinition } from "../entities/types";

export interface EntityIdProvider {
    createEntityId: () => string;
}

export interface EntityProvider<TComponents> extends EntityIdProvider {
    entities: EntityDefinition<TComponents>[];
    getEntity: (id: string) => EntityDefinition<TComponents> | undefined;
}

export interface EventsProvider {
    events: EventEmitter;
}