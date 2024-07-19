import { suite } from 'uvu';
import * as sinon from 'sinon';
import createTimer from './timer';

const test = suite('Timer');
let clock: sinon.SinonFakeTimers;
test.before.each(() => { clock = sinon.useFakeTimers(); });
test.after.each(() => { clock.restore(); });

test('calls the first frame immediately', async () => {
  const callback = sinon.spy();
  const { run, stop } = createTimer({ duration: 10, callback });
  run();
  stop();
  sinon.assert.calledOnce(callback);
});

test('calls a second frame after a delay', async () => {
  const callback = sinon.spy();
  const { run, stop } = createTimer({ duration: 10, callback });
  run();
  clock.tick(12);
  stop();
  sinon.assert.calledTwice(callback);
});

test('does not call multiple frames after lag', async () => {
  const callback = sinon.spy();
  const { run, stop } = createTimer({ duration: 10, callback });
  run();
  clock.jump(100);
  clock.tick(1);
  stop();
  sinon.assert.calledTwice(callback);
});

test.run();