import { scheduleUpdateOnFible } from './ReactFiberWorkLoop';

// 当前工作中的hook
let workInProgressHork = null;
// 当前工作中的fible
let currentlyRenderingFible = null;

/**
 * hook 存储在fiber中的 memoizedState 以链表的形式存储
 * fiber(memoizedState)->hook0(next)->hook1(next)->hook2(next)->null
 * workInProgressHork 也称尾部标记，指向当前工作中的hook
 * */
// 初始化hook,赋初始值
export function renderHook(wip) {
  currentlyRenderingFible = wip;
  currentlyRenderingFible.memoizedState = null;
  workInProgressHork = null;
}

function updateWorkInProgeressHook() {
  let hook;
  const current = currentlyRenderingFible.alternate;
  if (current) {
    // 存在current 不是初次渲染 是更新 意味着可以在老hook上更新
    currentlyRenderingFible.memoizedState = current.memoizedState;
    if (workInProgressHork) {
      // 不是第一个hook
      hook = workInProgressHork = workInProgressHork.next;
    } else {
      // 是第一个hook
      hook = workInProgressHork = current.memoizedState;
    }
  } else {
    // 是初次渲染 ， 需要初始化hook
    hook = {
      memoizedState: null, //状态值
      next: null, // 指向下一个hook或者null
    };
    // 存在workInProgressHork 不是第一个hook
    if (workInProgressHork) {
      workInProgressHork = workInProgressHork.next = hook;
    } else {
      // 是第一个hook
      workInProgressHork = currentlyRenderingFible.memoizedState = hook;
    }
  }
  return hook;
}

export function useReducer(reducer, initialState) {
  /**
   * memoizedState 状态值
   * next 指向下一个hook
   * */
  const hook = updateWorkInProgeressHook();

  if (!currentlyRenderingFible.alternate) {
    // 组件初次渲染
    hook.memoizedState = initialState;
  }

  const dispatch = action => {
    hook.memoizedState = reducer(hook.memoizedState, action);

    scheduleUpdateOnFible(currentlyRenderingFible);
  };
  return [hook.memoizedState, dispatch];
}
