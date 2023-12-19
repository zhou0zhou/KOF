import {GameMap} from '/static/js/game_map/base.js';
import {Kyo} from '/static/js/player/Kyo.js';
import {Kyo1} from '/static/js/player/Kyo1.js';

class KOF {
    constructor(id) {
        this.$kof = $('#' + id);
        this.game_map = new GameMap(this);
        this.players = [
            new Kyo(this, {
                id: 0,
                x: 200,
                y: 0,
                width: 120,
                height: 220,
                color: 'blue',
            }),
            new Kyo1(this, {
                id: 1,
                x: 900,
                y: 0,
                width: 120,
                height: 200,
                color: 'red',
            }),
        ];

        //添加Ko弹框相关的元素
        this.createGameOverDialog();

        //绑定点击事件
        this.addEventListeners();
    }

    update(){
        this.handleGameOver();
    }

    // 创建游戏结束弹框
    createGameOverDialog() {
        this.$gameOverDialog = $('<div id="game-over-dialog">\
        <h1>K O</h1>\
        <button id="play-again-btn">再玩一次</button>\
        <button id="end-game-btn">结束游戏</button>\
    </div>');

        this.$kof.append(this.$gameOverDialog);
    }

    // 绑定点击事件
    addEventListeners() {
        const playAgainBtn = this.$gameOverDialog.find('#play-again-btn');
        playAgainBtn.on('click', () => this.playAgain());

        const endGameBtn = this.$gameOverDialog.find('#end-game-btn');
        endGameBtn.on('click', () => this.endGame());
    }

    // 显示 KO 弹框
    showGameOverDialog() {
        this.$gameOverDialog.show();
       
    }

    // 隐藏 KO 弹框
    hideGameOverDialog() {
        this.$gameOverDialog.hide();
    }

    // 游戏结束处理逻辑
    handleGameOver() {
        let players = this.players;
        if (players[0].status === 6 || players[1].status === 6){
            this.showGameOverDialog();

            //停止倒计时
            this.game_map.stopTimer();
        }
    }

    handleTimeOut() {
        // 创建TIME OUT对话框
        const $timeOutDialog = $('<div id="time-out-dialog">\
            <h1>TIME OUT</h1>\
            <button id="play-again-btn">再玩一次</button>\
            <button id="end-game-btn">结束游戏</button>\
        </div>');

        // 将对话框添加到游戏容器中
        this.$kof.append($timeOutDialog);

        // 绑定点击事件
        const playAgainBtn = $timeOutDialog.find('#play-again-btn');
        playAgainBtn.on('click', () => {
            window.location.reload();
        });

        const endGameBtn = $timeOutDialog.find('#end-game-btn');
        endGameBtn.on('click', () => {           
            window.location.href = 'enter.html';
        });

        // 显示TIME OUT对话框
        $timeOutDialog.show();
    }

    // 再玩一次点击事件
    playAgain() {
        // 在这里添加再玩一次的逻辑，重新加载页面
        window.location.reload();
    }

    // 结束游戏点击事件
    endGame() {
        // 在这里添加结束游戏的逻辑，是返回 enter.html
        window.location.href = 'enter.html';
    }
}
export {
    KOF
}