export const NoFlags = /*                      */ 0b00000000000000000000000000;
export const PerformedWork = /*                */ 0b00000000000000000000000001;

// You can change the rest (and add more).
export const Placement = /*                    */ 0b00000000000000000000000010; // 2 插入
export const Update = /*                       */ 0b00000000000000000000000100; // 4 更新
export const Deletion = /*                     */ 0b00000000000000000000001000; // 8 删除

export function isStr(s) {
  return typeof s === 'string';
}
export function isStringOrNumber(s) {
  return typeof s === 'string' || typeof s === 'number';
}

export function isFn(f) {
  return typeof f === 'function';
}

export function sameNode(a, b) {
  return !!(a && b && a.key === b.key && a.type === b.type);
}

// export function updateNode(node, nextVal) {
//   Object.keys(nextVal).forEach(prop => {
//     if (prop === 'children') {
//       if (isStr(nextVal.children)) {
//         node.textContent = nextVal.children;
//       }
//     } else {
//       node[prop] = nextVal[prop];
//     }
//   });
// }

export function updateNode(node, prevVal, nextVal) {
  Object.keys(prevVal)
    // .filter(k => k !== "children")
    .forEach(k => {
      if (k === 'children') {
        // 有可能是文本
        if (isStringOrNumber(prevVal[k])) {
          node.textContent = '';
        }
      } else if (k.slice(0, 2) === 'on') {
        const eventName = k.slice(2).toLocaleLowerCase();
        node.removeEventListener(eventName, prevVal[k]);
      } else {
        if (!(k in nextVal)) {
          node[k] = '';
        }
      }
    });

  Object.keys(nextVal)
    // .filter(k => k !== "children")
    .forEach(k => {
      if (k === 'children') {
        // 有可能是文本
        if (isStringOrNumber(nextVal[k])) {
          node.textContent = nextVal[k] + '';
        }
      } else if (k.slice(0, 2) === 'on') {
        const eventName = k.slice(2).toLocaleLowerCase();
        node.addEventListener(eventName, nextVal[k]);
      } else {
        node[k] = nextVal[k];
      }
    });
}
