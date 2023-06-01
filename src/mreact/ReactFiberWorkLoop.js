import {
  updateHostComponent,
  updateFunctionComponent,
  updateFragementComponent,
  updateClassComponent,
} from './ReactFiberReconciler';
import { shedulerCallback, sholdYield } from './scheduler';
import { isFn, isStringOrNumber, Placement, Update, updateNode } from './utils';

// wip work in progress 当前正在工作中的
let wipRoot = null;
// 将要更新的下一个fiber
let nextUnitOfWork = null;

export function scheduleUpdateOnFible(fiber) {
  fiber.alternate = { ...fiber };
  wipRoot = fiber;
  wipRoot.sibiling = null;
  nextUnitOfWork = wipRoot;
  shedulerCallback(workLoop);
}

function performaUnitOfWork(wip) {
  // 更新自己
  // todo 原生标签 类组件 函数组件
  const { type } = wip;

  if (isStringOrNumber(type)) {
    updateHostComponent(wip);
  } else if (isFn(type)) {
    // 类组件
    console.log('type', type);
    type.prototype.isReactComponent
      ? updateClassComponent(wip)
      : updateFunctionComponent(wip);
  } else {
    // fragement
    updateFragementComponent(wip);
  }

  // 有子节点就返回子节点
  if (wip.child) {
    return wip.child;
  }

  let next = wip;
  while (next) {
    // 有兄弟节点就返回兄弟节点
    if (next.sibling) {
      return next.sibling;
    }
    // 返回父节点
    next = next.return;
  }
  return null;
}

// workLoop(IdleDeadLine)
function workLoop() {
  while (nextUnitOfWork && !sholdYield()) {
    //IdleDeadLine.timeRemaining() > 0
    nextUnitOfWork = performaUnitOfWork(nextUnitOfWork);
  }

  // 协调完节点并且wipRoot不为空 就提交节点
  if (!nextUnitOfWork && wipRoot) {
    commitRoot();
  }
}

// 浏览器空闲执行这个函数，存在兼容性
// requestIdleCallback(workLoop);

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
  if (!fiber) {
    return;
  }
  let { stateNode, flags } = fiber;

  // 父节点
  // 不一定都有父节点 如函数组件和类组件 那就找它的父级的父级...直到找到为止
  let parentNode = getParentNode(fiber); //fiber.return.stateNode;
  // 1 提交自己
  // 插入
  if (stateNode && flags & Placement) {
    parentNode.appendChild(stateNode);
  }
  // 更新
  if (flags & Update && stateNode) {
    updateNode(stateNode, fiber.alternate.props, fiber.props);
  }

  // 2 提交孩子
  commitWorker(fiber.child);
  // 3 提交兄弟节点
  commitWorker(fiber.sibling);
}
