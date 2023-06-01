import { createFiber } from './fiber';
import { isStr, updateNode } from './utils';

// 更新原生组件
export function updateHostComponent(wip) {
  if (!wip.stateNode) {
    wip.stateNode = document.createElement(wip.type);
    // 更新属性
    updateNode(wip.stateNode, wip.props);
  }
  reconcileChildren(wip, wip.props.children);
  console.log('updateHostComponent', wip);
}

// 更新函数组件
export function updateFunctiuonComponent(wip) {
  let { type } = wip;
  let children = type(wip.props);
  reconcileChildren(wip, children);
}

// fragment组件
export function updateFragmentComponent(wip) {
  console.log('updateFragmentComponent', wip);
  reconcileChildren(wip, wip.props.children);
}

export function updateClassComponent(wip) {
  const { type } = wip;
  let instance = new type(wip.props);
  let children = instance.render();
  reconcileChildren(wip, children);
}

// returnFible 指父fiber
export function reconcileChildren(returnFible, children) {
  // 如果是文本就不需要协调
  if (isStr(children)) {
    return;
  }
  const newChildern = Array.isArray(children) ? children : [children];

  // 上一个节点
  let previousNewFiber = null;
  for (let i = 0; i < newChildern.length; i++) {
    const newChild = newChildern[i];
    const newFible = createFiber(newChild, returnFible);

    if (previousNewFiber === null) {
      returnFible.child = newFible;
    } else {
      previousNewFiber.sibling = newFible;
    }
    previousNewFiber = newFible;
  }
}
