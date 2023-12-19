class Enter {
    constructor() {
        this.init();
    }

    init() {
        this.createDOM();
        this.addEventListeners();
    }

    createDOM() {
        // 创建页面元素，设置背景图片和按钮
        const enterPage = document.createElement('div');
        enterPage.id = 'enter-page';

            // 创建开始游戏按钮
            const startGameBtn = document.createElement('button');
            startGameBtn.id = 'start-game-btn';
            startGameBtn.textContent = '开始游戏';

            // 将元素添加到页面
            enterPage.appendChild(startGameBtn);
            document.body.appendChild(enterPage);
        };

    addEventListeners() {
        // 添加点击事件监听器，跳转到 selection.html
        const startGameBtn = document.getElementById('start-game-btn');
        startGameBtn.addEventListener('click', () => {
            window.location.href = 'play.html';
        });
    }
}

// 实例化 Enter 类，开始初始化页面
const enterPage = new Enter();
