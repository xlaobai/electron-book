const queue: any[] = [];
const activePreFlushCbs: any[] = [];

const p = Promise.resolve();
let isFlushPending = false;

/**
 * nextTick 等待微任务执行后，进行回调处理
 * @param fn 执行函数
 */
export function nextTick(fn?) {
    return fn ? p.then(fn) : p;
}

/**
 * queueJob 把执行任务收集入队列
 * @param job 
 */
export function queueJob(job) {
    if(!queue.includes(job)) {
        queue.push(job);
    }

    queueFlush();
}

/**
 * queueFlush 当微任务触发时，才进行实际的任务执行
 */
function queueFlush() {
    if(isFlushPending) return;
    isFlushPending = true;

    nextTick(flushJobs);
}

/**
 * 收集渲染器回调
 * @param cb 
 */
export function queuePreFlushCb(cb) {
    queueCb(cb, activePreFlushCbs);
}

/**
 * 把执行函数推入渲染器队列
 * @param cb 
 * @param activeQueue
 */
function queueCb(cb, activeQueue) {
    // 直接添加到对应的列表内\
    activeQueue.push(cb);
  
    // 然后执行队列里面所有的 job
    queueFlush()
}

/**
 * flushJobs 执行收集的依赖
 */
function flushJobs() {
    isFlushPending = false;

    flushPreFlushCbs();

    let job;
    while ((job = queue.shift())) {
        job && job();
    }
}

/**
 * flushPreFlushCbs 执行的job 是在渲染前的
 */
function flushPreFlushCbs() {
    // 执行所有的 pre 类型的 job
    for (let i = 0; i < activePreFlushCbs.length; i++) {
      activePreFlushCbs[i]();
    }
  }