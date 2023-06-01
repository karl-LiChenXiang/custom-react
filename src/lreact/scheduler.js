const taskQueue = [];
const timerQueue = [];

let deadline = 0; // 过期时间
const threshold = 5;

export function scheduleCallback(callback) {
  const newTask = { callback };
  taskQueue.push(newTask);
  schedule(flushWork);
}

export function schedule(callback) {
  timerQueue.push(callback);
  postMessage();
}

const postMessage = () => {
  const { port1, port2 } = new MessageChannel();
  port1.onmessage = () => {
    let tem = timerQueue.splice(0, timerQueue.length);
    tem.forEach(c => c());
  };
  port2.postMessage(null);
};

function flushWork() {
  deadline = getCurrentTime() + threshold;
  let currentTask = taskQueue[0];
  while (currentTask && !shouldYield()) {
    const { callback } = taskQueue[0];
    callback();
    taskQueue.shift();
    currentTask = taskQueue[0];
  }
}

export function shouldYield() {
  return getCurrentTime() >= deadline;
}

export function getCurrentTime() {
  return performance.now();
}
