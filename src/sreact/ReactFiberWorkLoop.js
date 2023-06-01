import { isFn } from '../kreact/utils';
import { isStr } from '../sreact/utils';
import {
  updateClassComponent,
  updateFragmentComponent,
  updateFunctiuonComponent,
  updateHostComponent,
} from './ReactFiberReconciler';

let wipRoot = null; // work in progress 当前正在工作中的
// 将要更新的下一个fible节点
let nextUnitOfWork = null;
// 处理更新
export function scheduleUpdateOnFible(fiber) {
  wipRoot = fiber;
  wipRoot.sibling = null;

  nextUnitOfWork = wipRoot;
}

// 协调
function performUnitOfWork(wip) {
  console.log('performUnitOfWork', wip);
  // 1.更新自己
  // 原生组件 函数组件 类组件
  const { type } = wip;
  if (isStr(type)) {
    updateHostComponent(wip);
  } else if (isFn(type)) {
    // 类组件
    console.log('objectssss', type);
    type.prototype.isReactComponent
      ? updateClassComponent(wip)
      : updateFunctiuonComponent(wip);
  } else {
    // fragment
    updateFragmentComponent(wip);
  }

  // 2. 返回下一个更新的fiber
  // 深度优先遍历
  if (wip.child) {
    return wip.child;
  }

  let next = wip;
  while (next) {
    if (next.sibling) {
      return next.sibling;
    }
    next = next.return;
  }
  return null;
}

// IdleDeadline.timeRemaining() 它用来表示当前闲置周期的预估剩余毫秒数
function workLoop(IdleDeadline) {
  while (nextUnitOfWork && IdleDeadline.timeRemaining() > 0) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
    console.log('nextUnitOfWork', nextUnitOfWork);
  }

  // 提交
  if (!nextUnitOfWork && wipRoot) {
    commitRoot();
  }
}

// 这个函数会在浏览器空闲时期被调用
requestIdleCallback(workLoop);

// 提交
function commitRoot() {
  commitWorker(wipRoot.child);
}

function getParentNode(fiber) {
  let next = fiber.return;

  while (!next.stateNode) {
    next = next.return;
  }
  return next.stateNode;
}

function commitWorker(fiber) {
  if (!fiber) return;

  const { stateNode } = fiber;
  // 1. 提交自己

  // fiber.return.stateNode.appendChild(stateNode);

  let parentNode = getParentNode(fiber);
  if (stateNode) {
    parentNode.appendChild(stateNode);
  }
  // 2. 提交孩子
  commitWorker(fiber.child);
  // 3. 提交下一个兄弟
  commitWorker(fiber.sibling);
}
