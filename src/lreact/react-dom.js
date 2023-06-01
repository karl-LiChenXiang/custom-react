import { scheduleUpdateOnFible } from './ReactFiberWorkLoop';

function render(vnode, container) {
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
