export function isStr(s) {
  return typeof s === 'string';
}

export function isFn(f) {
  return typeof f === 'function';
}
export function updateNode(node, nextVal) {
  Object.keys(nextVal).forEach(prop => {
    if (prop === 'children') {
      if (isStr(nextVal.children)) {
        node.textContent = nextVal.children;
      }
    } else {
      node[prop] = nextVal[prop];
    }
  });
}
