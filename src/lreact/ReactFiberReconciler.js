import { createFiber } from './fiber';
import { renderHook } from './hooks';
import { isStringOrNumber, sameNode, Update, updateNode } from './utils';

export function updateHostComponent(wip) {
  if (!wip.stateNode) {
    wip.stateNode = document.createElement(wip.type);
    // 更新属性
    updateNode(wip.stateNode, {}, wip.props);
  }
  reconcileChildren(wip, wip.props.children);
}

export function updateFunctionComponent(wip) {
  renderHook(wip);
  let { type, props } = wip;
  let newChild = type(props);
  reconcileChildren(wip, newChild);
}

export function updateFragmentComponent(wip) {
  reconcileChildren(wip, wip.props.children);
}

export function updateClassComponent(wip) {
  let { type, props } = wip;
  let instance = new type(props);
  let child = instance.render();
  reconcileChildren(wip, child);
}

function reconcileChildren(returnFiber, children) {
  if (isStringOrNumber(children) || !children) {
    return;
  }
  const newChildren = Array.isArray(children) ? children : [children];

  let previousNewFiber = null;
  let oldFiber = returnFiber.alternate && returnFiber.alternate.child;
  for (let index = 0; index < newChildren.length; index++) {
    const newChild = newChildren[index];
    let newFiber = createFiber(newChild, returnFiber);
    const same = sameNode(newChild, oldFiber);

    // 一样就复用
    if (same) {
      // 更新
      Object.assign(newFiber, {
        alternate: oldFiber,
        stateNode: oldFiber.stateNode,
        flags: Update,
      });
    }

    if (oldFiber) {
      oldFiber = oldFiber.sibling;
    }

    if (previousNewFiber === null) {
      returnFiber.child = newFiber;
    } else {
      previousNewFiber.sibling = newFiber;
    }
    previousNewFiber = newFiber;
  }
}
