# 游戏设计文档: 星星捕手 (Star Catcher)

## 1. 核心概念
一个简单的街机游戏。玩家控制一个角色在屏幕底部左右移动，接住从天上掉下来的星星。接到炸弹后游戏结束。

## 2. 核心玩法 (Core Mechanics)
- 玩家 (Player):
  - 使用左右箭头键控制。
  - 只能在水平方向移动。
- 星星 (Star):
  - 从屏幕顶部随机位置掉落。
  - 掉落速度随时间增加。
  - 玩家接到后得分+10。
  - 掉到屏幕底部消失。
- 炸弹 (Bomb):
  - 偶尔从屏幕顶部掉落。
  - 玩家接到后游戏结束。

## 3. 场景流程 (Scene Flow)
1.  `BootScene`: 预加载所有资源。加载完成后切换到 `MainMenuScene`。
2.  `MainMenuScene`: 显示游戏标题和"开始游戏"按钮。点击按钮后切换到 `GameScene`。
3.  `GameScene`: 核心游戏场景。实现上述玩法。
4.  `GameOverScene`: 游戏结束后显示最终得分和"重新开始"按钮。

## 4. 资源清单 (Asset List)
- `sky.png`: 背景图片
- `ground.png`: 地面平台
- `star.png`: 星星
- `bomb.png`: 炸弹
- `dude.png`: 玩家角色 (一个spritesheet)

## 5. 技术栈与代码风格
- 框架: Phaser 3
- 语言: TypeScript
- 代码风格:
  - 使用 ES6 Class 来定义场景和 Prefab。
  - 所有方法和重要属性需要有 JSDoc 注释。
  - 遵循项目现有的 ESLint 和 Prettier 规则。