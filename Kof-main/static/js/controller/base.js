// 用来读取键盘输入

export class Controller {
    constructor($canvas) {
        this.$canvas = $canvas;

        this.pressed_keys = new Set();  // 存按下的键
        this.start();
    }

    start() {
        let outer = this;  //引用外面的this，需要用变量存下来
        this.$canvas.keydown(function (e) {
            outer.pressed_keys.add(e.key);
        });

        this.$canvas.keyup(function (e) {  //按起来时把它从Set里边删掉
            outer.pressed_keys.delete(e.key);
        });
    }
}