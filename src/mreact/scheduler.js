// 存储的是 workLoop
const taskQueue = [];
// 存储是执行任务flashWork
const timerQueue = [];

// 过期时间
let deadLine = 0;

// 时间间隔
let threshold = 5;

export function shedulerCallback(callback) {
  const newTask = { callback };
  taskQueue.push(newTask);
  sheduler(flashWork);
}

function sheduler(callback) {
  timerQueue.push(callback);
  postMessage();
}
function postMessage() {
  const { port1, port2 } = new MessageChannel();

  port1.onmessage = () => {
    // 把timerQueue里的任务执行，并且清空timerQueue，避免下一轮在执行tiemQueue
    let tem = timerQueue.splice(0, timerQueue.length);
    tem.forEach(c => c());
  };
  port2.postMessage(null);
}

// 执行任务
function flashWork() {
  deadLine = getCurrentTiem() + threshold;
  let currentTask = taskQueue[0];
  while (currentTask && !sholdYield()) {
    const { callback } = currentTask;
    callback();
    taskQueue.shift();
    currentTask = taskQueue[0];
  }
}

export function sholdYield() {
  return getCurrentTiem() >= deadLine;
}

export function getCurrentTiem() {
  return performance.now();
}
