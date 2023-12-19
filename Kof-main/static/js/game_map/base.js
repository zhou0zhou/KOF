import { AcGameObject } from "/static/js/ac_game_object/base.js";  // 引入类
import { Controller } from "/static/js/controller/base.js";

export class GameMap extends AcGameObject {
    constructor(root) {
        super();
        this.root = root;

        //tabindex=0:让canvas聚焦以读取键盘输入
        this.$canvas = $('<canvas width="1280" height="720" tabindex=0></canvas>')
        this.ctx = this.$canvas[0].getContext('2d');   //把canvas对象取出来
        this.root.$kof.append(this.$canvas);  // 将canva加到div里边
        this.$canvas.focus();  //聚焦

        this.controller = new Controller(this.$canvas);

        this.root.$kof.append($(`<div class="kof-head">
        <div class="kof-head-hp-0"><div></div></div>
        <div class="kof-head-timer">60</div>
        <div class="kof-head-hp-1"><div></div></div>
    </div>`));

        this.time_left = 60000;  // 单位：ms
        this.$timer = this.root.$kof.find(`.kof-head-timer`);
        this.isTimeOutHandled = false;//添加标志，表示是否已经处理倒计时结束逻辑，防止多次调用
        this.isTimerRunning = true;//添加标志，表示是否正在计时
    }

    start() {

    }

    update() {
        super.update();
        
        this.time_left -= this.timedelta;
        if(this.time_left < 0){
            this.time_left = 0;
        }

        this.$timer.text(parseInt(this.time_left / 1000));

        if(this.time_left <= 0 && !this.isTimeOutHandled){
            this.root.handleTimeOut();//调用KOF实例的方法处理倒计时结束
            this.isTimeOutHandled = true;
        }

        this.render();
    }

    stopTimer(){
        this.isTimerRunning = false;
    }
    
    render() {  //每一帧把地图清空一遍，不刷新存的是移动的路径
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    }
}