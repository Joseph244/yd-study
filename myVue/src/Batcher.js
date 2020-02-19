/**
 * 批处理构造函数
 * @constructor
 */
function Batcher() {
    this.reset();
}

/**
 * 批处理重置
 */
Batcher.prototype.reset = function () {
    this.has = {};
    this.queue = [];
    this.waiting = false;
};

/**
 * 将事件添加到队列中
 * @param job {Watcher} watcher事件
 */
Batcher.prototype.push = function (job) {
    let id = job.id;
    if (!this.has[id]) {  // 单例
        console.log(batcher);
        this.queue.push(job);
        //设置元素的ID
        this.has[id] = true;
        if (!this.waiting) {    // vue nextTick的主要代码
            this.waiting = true;
            if ("Promise" in window) {
                Promise.resolve().then( ()=> {
                    this.flush();
                })
            } else {
                setTimeout(() => {
                    this.flush();
                }, 0);
            }
        }
    }
};

/**
 * 执行并清空事件队列
 */
Batcher.prototype.flush = function () {
    this.queue.forEach((job) => {
        job.cb();   // watcher中的cb回调
    });
    this.reset();
};