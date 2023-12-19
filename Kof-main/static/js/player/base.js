import { AcGameObject } from '/static/js/ac_game_object/base.js';

export class Player extends AcGameObject {
    constructor(root, info) {  //roo:方便索引地图上每一个元素
        super();

        this.root = root;
        this.id = info.id;
        this.x = info.x;  //位置
        this.y = info.y;
        this.width = info.width;
        this.height = info.height;
        this.color = info.color;

        this.direction = 1; // 正方向为1，反方向为-1

        this.vx = 0;
        this.vy = 0;

        this.speedx = 400;  //水平速度
        this.speedy = -1200;  //跳起的初始速度

        this.gravity = 50;  //重力

        this.status = 3;  // 0：静止不动， 1：向前， 2：向后， 3：跳跃， 4：轻拳， 5：被攻击， 6：死亡 7：轻腿 8：重拳 9 重腿 10：大招 11:胜利

        this.ctx = this.root.game_map.ctx;
        this.pressed_keys = this.root.game_map.controller.pressed_keys;

        this.animations = new Map();   //把每一个状态的动作存在数组里

        this.frame_current_cnt = 0;     // 因为不能每帧直接渲染, 定义一个计数器, 每过一帧记录一下

        this.attackType = 0;//默认不攻击 

        this.hp = 100; // 初始血量
        this.$hp = this.root.$kof.find(`.kof-head-hp-${this.id}>div`);  // 导入血槽
    }

    start() {

    }

    update_move() {
        this.vy += this.gravity;  // 每秒的速度加上gravity

        this.x += this.vx * this.timedelta / 1000;
        this.y += this.vy * this.timedelta / 1000;

        if (this.y > 450) {   // 设置落地离边界的距离
            this.y = 450;
            this.vy = 0;
            if (this.status === 3) this.status = 0;  // 落地变为静止状态
        }

        if (this.x < 0) {     // 设置左边界， 即使人物不超出左边界
            this.x = 0;
        } else if (this.x + this.width > this.root.game_map.$canvas.width()) {  // 设置右边界
            this.x = this.root.game_map.$canvas.width() - this.width;
        }
    }

    update_control() {
        let w, a, d, j;
        if (this.id === 0) {
            w = this.pressed_keys.has('w');
            a = this.pressed_keys.has('a');
            d = this.pressed_keys.has('d');
            j = this.pressed_keys.has('j');
        } else {
            w = this.pressed_keys.has('ArrowUp');
            a = this.pressed_keys.has('ArrowLeft');
            d = this.pressed_keys.has('ArrowRight');
            j = this.pressed_keys.has('1');
        }

        if (this.status === 0 || this.status === 1) {  //处于静止或向前状态, 可进行跳跃、移动
            if (j) {  // 如果按下‘j’则处于轻拳状态
                this.status = 4;
                this.attackType = 1;//轻拳
                this.vx = 0;
                this.frame_current_cnt = 0;
            }
            else if (w) {   //跳跃
                if (d) {         //向前跳j
                    this.vx = this.speedx;
                } else if (a) {   //向后跳
                    this.vx = -this.speedx;
                } else {          //向上跳
                    this.vx = 0;
                }
                this.vy = this.speedy;
                this.status = 3;
                this.frame_current_cnt = 0;
            }

            else if (d) {  // 向前移动
                this.vx = this.speedx;
                this.status = 1;
            }

            else if (a) {  // 向后移动
                this.vx = -this.speedx;
                this.status = 1;
            }

            else {        // 如果没有移动
                this.vx = 0;
                this.status = 0;
            }
        }
    }

    update_direction() {
        if (this.status === 6) return; // 死了不用换方向

        let players = this.root.players;
        if (players[0] && players[1]) {  // 如果两个玩家都存在
            let me = this, you = players[1 - this.id];
            if (me.x < you.x) {  // 本人自左朝右
                me.direction = 1;
            }
            else me.direction = -1;
        }
    }

    // 碰撞检测
    is_collision(r1, r2) {
        if (Math.max(r1.x1, r2.x1) > Math.min(r1.x2, r2.x2))
            return false;
        if (Math.max(r1.y1, r2.y1) > Math.min(r1.y2, r2.y2))
            return false;
        return true;
    }

    is_attack(damage) {
        if (this.status === 6) return;
        this.status = 5;
        this.frame_current_cnt = 0;

        this.hp = Math.max(this.hp - damage, 0);
        this.$hp.animate({
            width: this.$hp.parent().width() * this.hp / 100
        }, 300);

        if (this.hp <= 0) {
            this.status = 6;
            this.frame_current_cnt = 0;
        }
    };

    update_attack() {
        if(this.status === 6) return;
        if(this.hp <= 0){
            this.status = 6;
            this.frame_current_cnt = 0;

            this.root.gameOver();
        }
        // 第18帧攻击，所以判断第18帧的时候与敌人是否有交集，有则说明攻击到对方
        if (this.status === 4 && this.frame_current_cnt === 18)   {
            let me = this, you = this.root.players[1 - this.id];
            let r1;
            if (this.direction > 0) {
                r1 = {
                    // 红色矩形左上角坐标
                    x1: me.x + 120,
                    y1: me.y + 40,

                    // 红色矩形右下角坐标
                    x2: me.x + 120 + 100,
                    y2: me.y + 40 + 20
                };
            } else {
                r1 = {
                    // 红色矩形左上角坐标
                    x1: me.x + me.width - 120 - 100,
                    y1: me.y + 40,

                    // 红色矩形右下角坐标
                    x2: me.x + me.width - 120 - 100 + 100,
                    y2: me.y + 40 + 20
                };
            }

            // 对方所在的矩形
            let r2 = {
                x1: you.x,
                y1: you.y,
                x2: you.x + you.width,
                y2: you.y + you.height
            };

            if (this.is_collision(r1, r2)) {
                //根据攻击类型设置掉血量
                let damage = 0;
                if(this.attackType === 1){
                    damage = 20; //轻拳/轻脚 掉血5
                }
                    
                else if(this.attackType === 2){
                    damage = 10;//重拳/重脚 掉血10
                }
                    
                else if(this.attackType === 3){
                    damage = 20;//大招掉20
                
                }
                //执行对方的掉血逻辑
                you.is_attack(damage);
            }
        }
    }

    update() {
        this.update_direction();
        this.update_control();
        this.update_move();
        this.update_attack();
        this.root.handleGameOver(); 
        this.render();
    }

    render() {
        let status = this.status;    // 根据状态渲染图片

        // 判断移动的方向，前进和后退的动画不一样
        if (this.status === 1 && this.direction * this.vx < 0) {
            status = 2;
        }

        let obj = this.animations.get(status);     // 把obj取出来
        if (obj && obj.loaded) {     // 如果obj存在并且已被渲染

            if (this.direction > 0) {  // 如果本人所处的方向是正方向，即在左朝右
                let k = parseInt(this.frame_current_cnt / obj.frame_rate) % obj.frame_cnt;  // 表示当前用第几帧动画
                let image = obj.gif.frames[k].image;     // 当前显示的图片

                // 画入图片，其参数分别为：图片本身、左上角坐标、图片宽高；纵坐标加上偏移量offset_y
                this.ctx.drawImage(image, this.x, this.y + obj.offset_y, image.width * obj.scale, image.height * obj.scale);
            }

            // 当本人在右朝左(处于负方向)，需要翻转x轴的方向
            else {
                this.ctx.save();  // save():将设置的内容隔离出来，不会对外面的任何内容造成影响，与restore()一起才有用
                this.ctx.scale(-1, 1);  // x坐标乘-1，y不变，即表示以x轴左右翻转

                // 将坐标系向右移-$canvas.width()，即让原点为右上角。
                // 为什么是负的？因为x轴已经翻转了，朝左为正，要让整个地图处于坐标系中，只能将坐标系向右移(反方向)
                this.ctx.translate(-this.root.game_map.$canvas.width(), 0);

                let k = parseInt(this.frame_current_cnt / obj.frame_rate) % obj.frame_cnt;  // 表示当前用第几帧动画
                let image = obj.gif.frames[k].image;     // 当前显示的图片
                this.ctx.drawImage(image, this.root.game_map.$canvas.width() - this.x - this.width, this.y + obj.offset_y, image.width * obj.scale, image.height * obj.scale);

                this.ctx.restore();
            }
        }

        if (status === 4 || status === 5 || status === 6 ) {  // 如果不判断会一直持续(被)攻击状态
            if (this.frame_current_cnt == obj.frame_rate * (obj.frame_cnt - 1)) {  // 等于最后一帧，表示攻击动画播放完
                if (status === 6) {
                    this.frame_current_cnt--;  // 与后面的++抵消，一直处于倒在地上的最后一帧状态
                } else {
                    this.status = 0;
                }
            }
        }

        this.frame_current_cnt++;
    }
} 