import {
  updateClassComponent,
  updateFragmentComponent,
  updateFunctionComponent,
  updateHostComponent,
} from './ReactFiberReconciler';
import { scheduleCallback, shouldYield } from './scheduler';
import { isFn, isStringOrNumber, Placement, Update, updateNode } from './utils';

let wipRoot = null;
let nextUnitOfWork = null;

export function scheduleUpdateOnFible(vnode) {
  vnode.alternate = { ...vnode };
  wipRoot = vnode;
  wipRoot.sibling = null;
  nextUnitOfWork = wipRoot;

  scheduleCallback(workLoop);
}

function performUnitOfWork(wip) {
  // 1 更新自己
  let { type } = wip;
  if (isStringOrNumber(type)) {
    updateHostComponent(wip);
  } else if (isFn(type)) {
    type.prototype.isReactComponent
      ? updateClassComponent(wip)
      : updateFunctionComponent(wip);
  } else {
    //  fragment
    updateFragmentComponent(wip);
  }
  // 2 返回下一个fiber
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

function workLoop() {
  while (nextUnitOfWork && !shouldYield()) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
    console.log('nextUnitOfWork', nextUnitOfWork);
  }

  // 提交  虚拟dom变为真实dom
  if (!nextUnitOfWork && wipRoot) {
    commitRoot();
  }
}

// requestIdleCallback(workLoop);

function commitRoot() {
  commitWorker(wipRoot.child);
}

function getParentNode(fiber) {
  let parentFiber = fiber.return;
  while (!parentFiber.stateNode) {
    parentFiber = parentFiber.return;
  }
  return parentFiber.stateNode;
}

function commitWorker(fiber) {
  if (!fiber) return;

  // 提交自己
  let { stateNode, flags } = fiber;
  // parentNode是wip的父或者祖先dom节点
  let parentNode = getParentNode(fiber);

  if (flags & Placement && stateNode) {
    parentNode.appendChild(stateNode);
  }

  if (flags & Update && stateNode) {
    // 复用vnode和node
    updateNode(stateNode, fiber.alternate.props, fiber.props);
  }

  //提交 儿子
  commitWorker(fiber.child);
  // 提交兄弟
  commitWorker(fiber.sibling);
}
