let sharedArray = null;
// 计算密集型函数 - 递归计算斐波那契数列（故意低效实现，制造性能瓶颈）
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

// 对数组中的每个元素执行复杂计算
// 使用数组元素作为输入计算斐波那契数列
// 限制最大值为25，避免计算过久
function getSum(arr) {
  let sum=0
  const results = new Int32Array(arr.length);
  for (let i = 0; i < arr.length; i++) {
    const fibInput = Math.min(arr[i] + 15, 25);
    results[i] = fibonacci(fibInput);
    sum+=results[i]
  }
  return sum;
}

// 清理所有资源
function cleanup() {
  // 释放数组引用
  sharedArray = null;
  // 通知主线程已清理
  postMessage({ action: 'terminated' });
  // 关闭worker
  close();
}

self.onmessage = (e) => {
  try {
    if (e.data.buffer) {
      //创建一个Int32Array，因为sharedArrayBuffer是32位整数数组
      sharedArray = new Int32Array(e.data.buffer);
    }

    if (e.data.action === 'process' && sharedArray) {
      const startTime = performance.now();
      // 进行复杂计算
      const sum = getSum(sharedArray);
      const endTime = performance.now();
      const processingTime = endTime - startTime;
      postMessage({ 
        sum,
        processingTime,
        action: 'process'
      });
    } else if (e.data.action === 'terminate') {
      cleanup();
    }
  } catch (err) {
    // 错误处理
    postMessage({ 
      error: err.message || '处理过程中出现错误',
      action: 'error'
    });
    // 发生错误时也清理资源
    cleanup();
  }
};
self.postMessage({action:'ready'})
