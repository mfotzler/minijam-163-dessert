export interface TimerOptions {
  /** Frame duration in milliseconds */
  duration: number;
  /** The resolution of the system timer, in milliseconds. Default 5. */
  resolution?: number;
  /** Your frame tick callback */
  callback?: (delta: number) => void;
}

export type Timer = ReturnType<typeof createTimer>;

export const createTimer = (options: TimerOptions) => {
  let timeout: NodeJS.Timeout | undefined;
  let targetTickTime: number | undefined;
  let lastTickTime: number | undefined;

  const duration = options.duration;
  const resolution = options.resolution ?? 5;
  const halfRes = resolution / 2;
  const callback = options.callback ? options.callback : () => {};

  const tick = () => {
    const now = performance.now();
    targetTickTime ??= now;
    lastTickTime ??= now;
    const delta = now - lastTickTime;
    const offset = targetTickTime - now;
    if (offset <= 0) {
      // frame is on time or late
      callback(delta);
      targetTickTime += duration;
      if (targetTickTime < now) {
        // we lagged a while, catch up
        targetTickTime = now + duration;
      }
      lastTickTime = now;
    }

    const delay = Math.max(0, targetTickTime - now - halfRes);
    if (delay < resolution) {
      timeout = setTimeout(tick, 0);
    } else {
      timeout = setTimeout(tick, Math.max(0, delay));
    }
  };

  const run = () => {
    if (!timeout) {
      tick();
    }
  };

  const stop = () => {
    if (timeout) {
      clearTimeout(timeout);
      timeout = undefined;
    }
  };

  return { run, stop };
};
