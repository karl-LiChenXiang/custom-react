// node 是真实dom
// vnode 虚拟dom

import { scheduleUpdateOnFible } from './ReactFiberWorkLoop';

// container 是根节点
function render(vnode, container) {
  console.log('vnode', vnode, container);
  const fiberRoot = {
    type: container.nodeName.toLocaleLowerCase(),
    stateNode: container,
    props: {
      children: vnode,
    },
  };
  scheduleUpdateOnFible(fiberRoot);
}

export default {
  render,
};
