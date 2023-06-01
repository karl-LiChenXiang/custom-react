import { scheduleUpdateOnFible } from './ReactFiberWorkLoop';

// 当前正在工作中的fiber
let currentlyRenderingFiber = null;
// 当前正在工作中的hook
let workInProgressHook = null;

export function renderHooks(fiber) {
  currentlyRenderingFiber = fiber;
  currentlyRenderingFiber.memoizedState = null; // hook0
  workInProgressHook = null;
}

function updateWorkInProgressHook() {
  let hook = null;

  let current = currentlyRenderingFiber.alternate;
  // current 存在表示是更新
  if (current) {
    // 更新阶段 新的hook在老的hook基础上更新
    currentlyRenderingFiber.memoizedState = current.memoizedState;
    // workInProgressHook 不存在表示是第0个hook 否则就不是
    if (workInProgressHook) {
      hook = workInProgressHook = workInProgressHook.next;
    } else {
      // 第0个hook
      hook = workInProgressHook = current.memoizedState;
    }
  } else {
    // current 不存在 表示初始化阶段
    hook = {
      memoizedState: null,
      next: null,
    };
    // workInProgressHook 不存在表示是第0个hook 否则就不是
    if (workInProgressHook) {
      workInProgressHook = workInProgressHook.next = hook;
    } else {
      workInProgressHook = currentlyRenderingFiber.memoizedState = hook;
    }
  }
  return hook;
}

export function useReducer(reducer, initState) {
  const hook = updateWorkInProgressHook();
  if (!currentlyRenderingFiber.alternate) {
    hook.memoizedState = initState;
  }

  const dispatch = action => {
    hook.memoizedState = reducer(hook.memoizedState, action);
    scheduleUpdateOnFible(currentlyRenderingFiber);
  };

  return [hook.memoizedState, dispatch];
}
