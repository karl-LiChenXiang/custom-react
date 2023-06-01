import { Placement } from './utils';

/**
 * fiber ->vnode
 * type 类型
 * key 标记当前层级下的唯一性
 * props 属性值
 * child 第一个子节点（fiber）
 * return 父节点(fiber)
 * alternate 老节点
 * sibling 下一个兄弟节点(fiber)
 * flags 标记当前节点类型(比如 插入、更新、删除等)
 * stateNode 原生标签时候，指向dom节点，（类组件时候指向实例）
 * */
export function createFiber(vnode, returnFiber) {
  console.log('vnode', vnode);
  const fiber = {
    type: vnode.type,
    key: vnode.key,
    props: vnode.props,
    stateNode: null,
    child: null,
    sibling: null,
    return: returnFiber,
    alternate: null,
    flags: Placement,
  };
  return fiber;
}
