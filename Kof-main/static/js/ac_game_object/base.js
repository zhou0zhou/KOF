// 3个元素：地图、两个玩家 3个元素都要实现每秒钟刷新60次
// 让这3个元素继承自同一个元素AcGameObject
// 只要涉及动画，这样的对象是非常常用的
let AC_GAME_OBJECTS = []; //为了能够让每一帧将所有这个对象的元素都刷新一遍，需要将这个对象的所有元素都存下来

class AcGameObject {
    constructor() {
        AC_GAME_OBJECTS.push(this); //每一个AcGameObject都把它存下来

        // AC_GAME_OBJECTS里存几个值：
        this.timedelta = 0;  //当前这帧与上一帧的时间间隔，因为每一个元素运动的速度取决于时间而不是帧数
        this.has_call_start = false; //用来表示当前这个对象有没有执行过start这个函数
    }

    start() {  //初始执行一次

    }

    update() {  //每一帧执行一次（除了第一帧以外 ）

    }

    destroy() {  //删除当前对象
        for (let i in AC_GAME_OBJECTS) {
            if (AC_GAME_OBJECTS[i] === this) { //如果AC_GAME_OBJECTS[i]等于当前元素，把当前元素删掉
                AC_GAME_OBJECTS.splice(i, 1);
                break;
            }
        }
    }

    setWinnerInfo(info){
        this.winnerInfo = info;
    }
}

export {
    AcGameObject
}


let last_timestamp;
let AC_GAME_OBJECTS_FRAME = (timestamp) => {
    for (let obj of AC_GAME_OBJECTS) {
        if (!obj.has_call_start) { //这个元素如果没有执行过start函数
            obj.start();
            obj.has_call_start = true;
        }

        else {  //执行过start函数就执行update函数
            obj.timedelta = timestamp - last_timestamp;  //当前执行时刻 - 上一帧执行时刻
            obj.update();
        }
    }

    last_timestamp = timestamp;
    requestAnimationFrame(AC_GAME_OBJECTS_FRAME);  //requestAnimationFrame函数通过递归的方式实现每一帧执行一次
}

requestAnimationFrame(AC_GAME_OBJECTS_FRAME);