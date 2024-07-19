import type { EventEmitter } from 'events';
import type { GameEngine } from './gameEngine';

export interface StepData {
  delta: number;
}

export interface System {
  step: (data: StepData) => Promise<void> | void;
}

export interface Engine {
  game: GameEngine;
  events: EventEmitter;
  start: () => Promise<void>;
  stop: () => Promise<void>;
}

export enum EventType {
  /**
   * Occurs at the beginning of a step, after the step counter has incremented
   * but before any systems have been run.
   */
  STEP_BEGIN = 'stepBegin',
  /**
   * Occurs at the end of a step, after all systems have been run.
   */
  STEP_END = 'stepEnd',
  /**
   * Requests that an entity be added to the world.
   * Do not use this to modify the entity as it will be deep cloned first.
   */
  ADD_ENTITY = 'entityAdded',
  DELETE_ENTITY = 'deleteEntity',
  ENTITY_DELETED = 'entityDeleted',
  ENTITY_PREINIT = 'entityPreInit'
}