import { createFiber } from './fiber';
import { isStringOrNumber, Update, updateNode } from './utils';
import { renderHooks } from './hooks';

// 更新原生组件
export function updateHostComponent(wip) {
  if (!wip.stateNode) {
    // 不存在 节点就创建
    wip.stateNode = document.createElement(wip.type);
    // todo 更新属性
    updateNode(wip.stateNode, {}, wip.props);
  }

  // 协调子节点
  reconcileChildren(wip, wip.props.children);
  console.log('wip', wip); //sy-log
}

export function updateFunctionComponent(wip) {
  renderHooks(wip);
  const { type } = wip;
  let children = type(wip.props);
  reconcileChildren(wip, children);
}

export function updateFragementComponent(wip) {
  reconcileChildren(wip, wip.props.children);
}

export function updateClassComponent(wip) {
  const { type } = wip;

  const instance = new type(wip.props);
  const children = instance.render();
  reconcileChildren(wip, children);
}

// 协调子节点
// diff
// 1 2 3 4
// 2 3 4
function reconcileChildren(returnFiber, children) {
  // 子节点是字符串就不需要协调，直接retrun
  if (isStringOrNumber(children)) {
    return;
  }

  const newChildren = Array.isArray(children) ? children : [children];

  let previousNewFiber = null;
  let oldFiber = returnFiber.alternate && returnFiber.alternate.child;
  for (let i = 0; i < newChildren.length; i++) {
    const newChild = newChildren[i];
    const newFiber = createFiber(newChild, returnFiber);
    const same = sameNode(oldFiber, newFiber);

    if (same) {
      // 是同一个节点
      Object.assign(newFiber, {
        alternate: oldFiber,
        stateNode: oldFiber.stateNode,
        flags: Update,
      });
    }

    if (oldFiber) {
      oldFiber = oldFiber.sibling;
    }

    // 第一个子节点
    if (previousNewFiber === null) {
      returnFiber.child = newFiber;
    } else {
      // 兄弟节点
      previousNewFiber.sibling = newFiber;
    }
    previousNewFiber = newFiber;
  }
}

// 判断是否为同一节点，且在同一层级下
function sameNode(a, b) {
  return !!(a && b && a.key === b.key && a.type === b.type);
}
