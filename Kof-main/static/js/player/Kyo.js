// player1的动画， 继承自Player
import { Player } from "/static/js/player/base.js";
import { GIF } from "/static/js/utils/gif.js";

export class Kyo extends Player {
    constructor(root, info) {
        super(root, info);

        this.init_animations();
    }

    init_animations() {     // 初始化动画， 有12个动画
        let outer = this;
        let offsets = [0, -22, -22, -140, 0, 0, 0];   // 如果不设置偏移量，人物行走或跳跃时会向下偏移
        for (let i = 0; i < 12; i++) {
            let gif = GIF();
            gif.load(`/static/images/player/kyo2/${i}.gif`);
            this.animations.set(i, {  // 把gif加到animations里
                gif: gif,
                frame_cnt: 0,     // 当前动画的总图片数
                frame_rate: 5,    // 每5帧过渡（渲染下一张图片）一次
                offset_y: offsets[i],      // y方向偏移量
                loaded: false,    // 该变量用于判断obj有没有被加载, 如果没有加载则不能被渲染
                scale: 2,
            });

            gif.onload = function () {     // 当图片加载完之后
                let obj = outer.animations.get(i);
                obj.frame_cnt = gif.frames.length;
                obj.loaded = true;

                if (i === 3) {
                    obj.frame_rate = 4;
                }
                console.log(obj.frame_cnt);
            }
        }
    }
}