import { BaseGameScene } from '../base/BaseGameScene'

interface Position {
    x: number
    y: number
}

export default class SnakeScene extends BaseGameScene {
    private snake: Position[] = []
    private food: Position | null = null
    private direction: Position = { x: 1, y: 0 }
    private nextDirection: Position = { x: 1, y: 0 }
    private gridSize: number = 20
    private cellSize: number = 20
    private moveTimer: number = 0
    private moveSpeed: number = 150 // 毫秒
    private snakeGraphics: Phaser.GameObjects.Graphics | null = null
    private foodGraphics: Phaser.GameObjects.Graphics | null = null
    private cursors: Phaser.Types.Input.Keyboard.CursorKeys | null = null
    private keys: Record<string, Phaser.Input.Keyboard.Key> = {}
    private canChangeDirection: boolean = true
    private vueState: any

    constructor() {
        super('SnakeScene')
        this.gameId = 'snake'
    }

    init(): void {
        super.init()
        this.vueState = this.registry.get('vueState')
        this.moveSpeed = 150
        this.direction = { x: 1, y: 0 }
        this.nextDirection = { x: 1, y: 0 }
        this.canChangeDirection = true
        this.initSnake()
        this.spawnFood()
    }

    create(): void {
        super.create()
        this.createBorder()
    }

    protected createGameElements(): void {
        // 创建图形对象
        this.snakeGraphics = this.add.graphics()
        this.foodGraphics = this.add.graphics()

        // 设置键盘控制
        this.cursors = this.input.keyboard!.createCursorKeys()
        this.keys = {
            W: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.W),
            A: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.A),
            S: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.S),
            D: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.D)
        }

        // 添加触摸控制
        this.setupTouchControls()
    }

    protected updateGame(time: number, delta: number): void {
        // 处理输入
        this.handleInput()

        // 蛇移动
        this.moveTimer += delta
        if (this.moveTimer >= this.moveSpeed) {
            this.moveTimer = 0
            this.moveSnake()
        }

        // 重绘游戏
        this.drawGame()
    }

    private initSnake(): void {
        this.snake = []
        // 初始化蛇的长度为3
        const startX = Math.floor(this.gridSize / 2)
        const startY = Math.floor(this.gridSize / 2)

        for (let i = 0; i < 3; i++) {
            this.snake.push({ x: startX - i, y: startY })
        }
    }

    private createBorder(): void {
        const graphics = this.add.graphics()
        graphics.lineStyle(2, 0xffffff, 0.8)
        graphics.strokeRect(0, 0, this.gridSize * this.cellSize, this.gridSize * this.cellSize)
    }

    private setupTouchControls(): void {
        let startX = 0
        let startY = 0

        this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
            startX = pointer.x
            startY = pointer.y
        })

        this.input.on('pointerup', (pointer: Phaser.Input.Pointer) => {
            const dx = pointer.x - startX
            const dy = pointer.y - startY

            // 判断滑动方向
            if (Math.abs(dx) > Math.abs(dy)) {
                // 水平方向
                if (dx > 0 && this.direction.x === 0) {
                    this.nextDirection = { x: 1, y: 0 }
                } else if (dx < 0 && this.direction.x === 0) {
                    this.nextDirection = { x: -1, y: 0 }
                }
            } else {
                // 垂直方向
                if (dy > 0 && this.direction.y === 0) {
                    this.nextDirection = { x: 0, y: 1 }
                } else if (dy < 0 && this.direction.y === 0) {
                    this.nextDirection = { x: 0, y: -1 }
                }
            }
        })
    }

    private handleInput(): void {
        if (!this.cursors || !this.canChangeDirection) return

        // 上下左右控制
        if ((Phaser.Input.Keyboard.JustDown(this.cursors.up) ||
                Phaser.Input.Keyboard.JustDown(this.keys.W)) &&
            this.direction.y === 0) {
            this.nextDirection = { x: 0, y: -1 }
            this.canChangeDirection = false
        }

        if ((Phaser.Input.Keyboard.JustDown(this.cursors.down) ||
                Phaser.Input.Keyboard.JustDown(this.keys.S)) &&
            this.direction.y === 0) {
            this.nextDirection = { x: 0, y: 1 }
            this.canChangeDirection = false
        }

        if ((Phaser.Input.Keyboard.JustDown(this.cursors.left) ||
                Phaser.Input.Keyboard.JustDown(this.keys.A)) &&
            this.direction.x === 0) {
            this.nextDirection = { x: -1, y: 0 }
            this.canChangeDirection = false
        }

        if ((Phaser.Input.Keyboard.JustDown(this.cursors.right) ||
                Phaser.Input.Keyboard.JustDown(this.keys.D)) &&
            this.direction.x === 0) {
            this.nextDirection = { x: 1, y: 0 }
            this.canChangeDirection = false
        }
    }

    private moveSnake(): void {
        // 更新方向
        this.direction = { ...this.nextDirection }
        this.canChangeDirection = true

        // 计算新头部位置
        const head = this.snake[0]
        const newHead = {
            x: head.x + this.direction.x,
            y: head.y + this.direction.y
        }

        // 检查碰撞墙壁
        if (newHead.x < 0 || newHead.x >= this.gridSize ||
            newHead.y < 0 || newHead.y >= this.gridSize) {
            this.gameOver()
            return
        }

        // 检查碰撞自己
        if (this.snake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
            this.gameOver()
            return
        }

        // 添加新头部
        this.snake.unshift(newHead)

        // 检查是否吃到食物
        if (this.food && newHead.x === this.food.x && newHead.y === this.food.y) {
            this.eatFood()
        } else {
            // 没吃到食物则移除尾部
            this.snake.pop()
        }

        this.playSound('move', 0.1)
    }

    private eatFood(): void {
        this.addScore(10 * this.level)
        this.spawnFood()
        this.playSound('eat')

        // 每吃10个食物升级
        if (this.score >= this.level * 100) {
            this.levelUp()
        }
    }

    private spawnFood(): void {
        const availablePositions: Position[] = []

        // 找出所有可用位置
        for (let x = 0; x < this.gridSize; x++) {
            for (let y = 0; y < this.gridSize; y++) {
                const pos = { x, y }
                if (!this.snake.some(segment => segment.x === pos.x && segment.y === pos.y)) {
                    availablePositions.push(pos)
                }
            }
        }

        // 随机选择一个位置
        if (availablePositions.length > 0) {
            const randomIndex = Math.floor(Math.random() * availablePositions.length)
            this.food = availablePositions[randomIndex]
        }
    }

    private drawGame(): void {
        if (!this.snakeGraphics || !this.foodGraphics) return

        // 清除之前的绘制
        this.snakeGraphics.clear()
        this.foodGraphics.clear()

        // 绘制蛇
        this.snake.forEach((segment, index) => {
            const color = index === 0 ? 0x00ff00 : 0x008800 // 头部颜色更亮
            this.snakeGraphics!.fillStyle(color, 1)
            this.snakeGraphics!.fillRect(
                segment.x * this.cellSize + 2,
                segment.y * this.cellSize + 2,
                this.cellSize - 4,
                this.cellSize - 4
            )
        })

        // 绘制食物
        if (this.food) {
            this.foodGraphics.fillStyle(0xff0000, 1)
            this.foodGraphics.fillCircle(
                this.food.x * this.cellSize + this.cellSize / 2,
                this.food.y * this.cellSize + this.cellSize / 2,
                this.cellSize / 2 - 2
            )
        }
    }

    protected onPause(): void {
        this.vueState.isPaused = true
    }

    protected onResume(): void {
        this.vueState.isPaused = false
    }

    public resumeGame(): void {
        this.togglePause()
    }

    protected onGameOver(): void {
        this.vueState.isGameOver = true
        this.playSound('gameover')
    }

    protected onScoreUpdate(score: number): void {
        this.vueState.score = score
    }

    protected onLevelUp(level: number): void {
        this.vueState.level = level
        // 加快移动速度
        this.moveSpeed = Math.max(50, 150 - (level - 1) * 20)
        this.playSound('levelup')
    }
}
