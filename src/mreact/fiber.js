import { Placement } from './utils';

export function createFiber(vnode, returnFiber) {
  const fiber = {
    type: vnode.type,
    key: vnode.key,
    props: vnode.props,
    stateNode: null, // 原生标签时候指向dom节点，类组件指向的是实例
    child: null, // 存储第一个子节点
    sibling: null, // 存储行兄弟节点
    return: returnFiber, // 父fiber
    // 标记节点是什么类型的
    flags: Placement,
    // 老节点
    alternate: null,
  };
  return fiber;
}
