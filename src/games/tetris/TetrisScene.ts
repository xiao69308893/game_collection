import { BaseGameScene } from '../base/BaseGameScene'

// 方块类型和形状定义
const TETROMINOS = {
    I: {
        shape: [[1, 1, 1, 1]],
        color: 0x00f0f0
    },
    O: {
        shape: [
            [1, 1],
            [1, 1]
        ],
        color: 0xf0f000
    },
    T: {
        shape: [
            [0, 1, 0],
            [1, 1, 1]
        ],
        color: 0xa000f0
    },
    S: {
        shape: [
            [0, 1, 1],
            [1, 1, 0]
        ],
        color: 0x00f000
    },
    Z: {
        shape: [
            [1, 1, 0],
            [0, 1, 1]
        ],
        color: 0xf00000
    },
    J: {
        shape: [
            [1, 0, 0],
            [1, 1, 1]
        ],
        color: 0x0000f0
    },
    L: {
        shape: [
            [0, 0, 1],
            [1, 1, 1]
        ],
        color: 0xf0a000
    }
}

type TetrominoType = keyof typeof TETROMINOS

interface Piece {
    type: TetrominoType
    shape: number[][]
    color: number
    x: number
    y: number
}

export default class TetrisScene extends BaseGameScene {
    private grid: number[][] = []
    private gridGraphics: Phaser.GameObjects.Graphics | null = null
    private currentPiece: Piece | null = null
    private nextPiece: Piece | null = null
    private holdPiece: Piece | null = null
    private canHold: boolean = true
    private dropTimer: number = 0
    private dropSpeed: number = 1000 // 毫秒
    private linesCleared: number = 0
    private vueState: any
    private cellSize: number = 30
    private gridWidth: number = 10
    private gridHeight: number = 20
    private cursors: Phaser.Types.Input.Keyboard.CursorKeys | null = null
    private keys: Record<string, Phaser.Input.Keyboard.Key> = {}

    constructor() {
        super('TetrisScene')
        this.gameId = 'tetris'
    }

    init(): void {
        super.init()
        this.vueState = this.registry.get('vueState')
        this.linesCleared = 0
        this.dropSpeed = 1000
        this.canHold = true
        this.holdPiece = null
        this.nextPiece = null
        this.currentPiece = null
        this.initGrid()
    }

    create(): void {
        super.create()
        this.createBorder()
        this.generateNextPiece()
        this.spawnNewPiece()
    }

    protected createGameElements(): void {
        // 创建网格图形对象
        this.gridGraphics = this.add.graphics()

        // 设置键盘控制
        this.cursors = this.input.keyboard!.createCursorKeys()
        this.keys = {
            W: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.W),
            A: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.A),
            S: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.S),
            D: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.D),
            SPACE: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE),
            SHIFT: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT)
        }
    }

    protected updateGame(time: number, delta: number): void {
        if (!this.currentPiece) return

        // 处理输入
        this.handleInput()

        // 自动下落
        this.dropTimer += delta
        if (this.dropTimer >= this.dropSpeed) {
            this.dropTimer = 0
            this.moveDown()
        }

        // 重绘游戏
        this.drawGame()
    }

    private initGrid(): void {
        this.grid = []
        for (let y = 0; y < this.gridHeight; y++) {
            this.grid[y] = new Array(this.gridWidth).fill(0)
        }
    }

    private createBorder(): void {
        const graphics = this.add.graphics()
        graphics.lineStyle(2, 0xffffff, 0.8)
        graphics.strokeRect(0, 0, this.gridWidth * this.cellSize, this.gridHeight * this.cellSize)
    }

    private handleInput(): void {
        if (!this.cursors || !this.currentPiece) return

        // 左右移动
        if (Phaser.Input.Keyboard.JustDown(this.cursors.left) ||
            Phaser.Input.Keyboard.JustDown(this.keys.A)) {
            this.movePiece(-1, 0)
        }
        if (Phaser.Input.Keyboard.JustDown(this.cursors.right) ||
            Phaser.Input.Keyboard.JustDown(this.keys.D)) {
            this.movePiece(1, 0)
        }

        // 旋转
        if (Phaser.Input.Keyboard.JustDown(this.cursors.up) ||
            Phaser.Input.Keyboard.JustDown(this.keys.W)) {
            this.rotatePiece()
        }

        // 软降
        if (this.cursors.down.isDown || this.keys.S.isDown) {
            this.dropTimer = this.dropSpeed
        }

        // 硬降
        if (Phaser.Input.Keyboard.JustDown(this.cursors.space) ||
            Phaser.Input.Keyboard.JustDown(this.keys.SPACE)) {
            this.hardDrop()
        }

        // 保留方块
        if (Phaser.Input.Keyboard.JustDown(this.keys.SHIFT)) {
            this.holdCurrentPiece()
        }
    }

    private movePiece(dx: number, dy: number): boolean {
        if (!this.currentPiece) return false

        const newX = this.currentPiece.x + dx
        const newY = this.currentPiece.y + dy

        if (this.isValidPosition(this.currentPiece.shape, newX, newY)) {
            this.currentPiece.x = newX
            this.currentPiece.y = newY
            return true
        }
        return false
    }

    private moveDown(): void {
        if (!this.movePiece(0, 1)) {
            this.lockPiece()
        }
    }

    private hardDrop(): void {
        if (!this.currentPiece) return

        while (this.movePiece(0, 1)) {
            // 继续下落
        }
        this.lockPiece()
    }

    private rotatePiece(): void {
        if (!this.currentPiece) return

        const rotated = this.rotateMatrix(this.currentPiece.shape)
        if (this.isValidPosition(rotated, this.currentPiece.x, this.currentPiece.y)) {
            this.currentPiece.shape = rotated
            this.playSound('rotate')
        }
    }

    private rotateMatrix(matrix: number[][]): number[][] {
        const rows = matrix.length
        const cols = matrix[0].length
        const rotated: number[][] = []

        for (let i = 0; i < cols; i++) {
            rotated[i] = []
            for (let j = rows - 1; j >= 0; j--) {
                rotated[i][rows - 1 - j] = matrix[j][i]
            }
        }
        return rotated
    }

    private isValidPosition(shape: number[][], x: number, y: number): boolean {
        for (let row = 0; row < shape.length; row++) {
            for (let col = 0; col < shape[row].length; col++) {
                if (shape[row][col]) {
                    const newX = x + col
                    const newY = y + row

                    if (newX < 0 || newX >= this.gridWidth ||
                        newY >= this.gridHeight ||
                        (newY >= 0 && this.grid[newY][newX])) {
                        return false
                    }
                }
            }
        }
        return true
    }

    private lockPiece(): void {
        if (!this.currentPiece) return

        // 将方块添加到网格
        for (let row = 0; row < this.currentPiece.shape.length; row++) {
            for (let col = 0; col < this.currentPiece.shape[row].length; col++) {
                if (this.currentPiece.shape[row][col]) {
                    const y = this.currentPiece.y + row
                    const x = this.currentPiece.x + col
                    if (y >= 0) {
                        this.grid[y][x] = this.currentPiece.color
                    }
                }
            }
        }

        this.playSound('lock')
        this.checkLines()
        this.spawnNewPiece()
        this.canHold = true
    }

    private checkLines(): void {
        let linesCleared = 0
        for (let y = this.gridHeight - 1; y >= 0; y--) {
            if (this.grid[y].every(cell => cell !== 0)) {
                this.grid.splice(y, 1)
                this.grid.unshift(new Array(this.gridWidth).fill(0))
                linesCleared++
                y++ // 重新检查这一行
            }
        }

        if (linesCleared > 0) {
            this.linesCleared += linesCleared
            this.vueState.lines = this.linesCleared
            this.addScore(linesCleared * 100 * this.level)
            this.playSound('clear')

            // 每10行升级
            if (this.linesCleared >= this.level * 10) {
                this.levelUp()
            }
        }
    }

    private holdCurrentPiece(): void {
        if (!this.canHold || !this.currentPiece) return

        const temp = this.currentPiece
        if (this.holdPiece) {
            this.currentPiece = this.createPiece(this.holdPiece.type)
        } else {
            this.spawnNewPiece()
        }
        this.holdPiece = { ...temp, x: 0, y: 0 }
        this.canHold = false
        this.drawHoldPiece()
        this.playSound('hold')
    }

    private spawnNewPiece(): void {
        if (!this.nextPiece) {
            this.generateNextPiece()
        }

        this.currentPiece = this.createPiece(this.nextPiece!.type)
        this.currentPiece.x = Math.floor((this.gridWidth - this.currentPiece.shape[0].length) / 2)
        this.currentPiece.y = 0

        if (!this.isValidPosition(this.currentPiece.shape, this.currentPiece.x, this.currentPiece.y)) {
            this.gameOver()
        }

        this.generateNextPiece()
    }

    private generateNextPiece(): void {
        const types = Object.keys(TETROMINOS) as TetrominoType[]
        const randomType = types[Math.floor(Math.random() * types.length)]
        this.nextPiece = this.createPiece(randomType)
        this.drawNextPiece()
    }

    private createPiece(type: TetrominoType): Piece {
        const tetromino = TETROMINOS[type]
        return {
            type,
            shape: tetromino.shape.map(row => [...row]),
            color: tetromino.color,
            x: 0,
            y: 0
        }
    }

    private drawGame(): void {
        if (!this.gridGraphics) return

        this.gridGraphics.clear()

        // 绘制网格中的方块
        for (let y = 0; y < this.gridHeight; y++) {
            for (let x = 0; x < this.gridWidth; x++) {
                if (this.grid[y][x]) {
                    this.drawCell(this.gridGraphics, x, y, this.grid[y][x])
                }
            }
        }

        // 绘制当前方块
        if (this.currentPiece) {
            for (let row = 0; row < this.currentPiece.shape.length; row++) {
                for (let col = 0; col < this.currentPiece.shape[row].length; col++) {
                    if (this.currentPiece.shape[row][col]) {
                        const x = this.currentPiece.x + col
                        const y = this.currentPiece.y + row
                        if (y >= 0) {
                            this.drawCell(this.gridGraphics, x, y, this.currentPiece.color)
                        }
                    }
                }
            }

            // 绘制投影
            this.drawGhostPiece()
        }
    }

    private drawGhostPiece(): void {
        if (!this.currentPiece || !this.gridGraphics) return

        let ghostY = this.currentPiece.y
        while (this.isValidPosition(this.currentPiece.shape, this.currentPiece.x, ghostY + 1)) {
            ghostY++
        }

        for (let row = 0; row < this.currentPiece.shape.length; row++) {
            for (let col = 0; col < this.currentPiece.shape[row].length; col++) {
                if (this.currentPiece.shape[row][col]) {
                    const x = this.currentPiece.x + col
                    const y = ghostY + row
                    if (y >= 0) {
                        this.drawCell(this.gridGraphics, x, y, this.currentPiece.color, 0.3)
                    }
                }
            }
        }
    }

    private drawCell(graphics: Phaser.GameObjects.Graphics, x: number, y: number, color: number, alpha: number = 1): void {
        graphics.fillStyle(color, alpha)
        graphics.fillRect(x * this.cellSize + 1, y * this.cellSize + 1, this.cellSize - 2, this.cellSize - 2)
    }

    private drawNextPiece(): void {
        const canvas = this.registry.get('nextPieceCanvas') as HTMLDivElement
        if (!canvas || !this.nextPiece) return

        // 使用Canvas API直接绘制
        let ctx = (canvas as any).ctx
        if (!ctx) {
            const canvasEl = document.createElement('canvas')
            canvasEl.width = 100
            canvasEl.height = 100
            canvas.appendChild(canvasEl)
            ctx = canvasEl.getContext('2d')
            ;(canvas as any).ctx = ctx
        }

        ctx.clearRect(0, 0, 100, 100)
        const cellSize = 20
        const offsetX = (100 - this.nextPiece.shape[0].length * cellSize) / 2
        const offsetY = (100 - this.nextPiece.shape.length * cellSize) / 2

        for (let row = 0; row < this.nextPiece.shape.length; row++) {
            for (let col = 0; col < this.nextPiece.shape[row].length; col++) {
                if (this.nextPiece.shape[row][col]) {
                    ctx.fillStyle = `#${this.nextPiece.color.toString(16).padStart(6, '0')}`
                    ctx.fillRect(
                        offsetX + col * cellSize,
                        offsetY + row * cellSize,
                        cellSize - 2,
                        cellSize - 2
                    )
                }
            }
        }
    }

    private drawHoldPiece(): void {
        const canvas = this.registry.get('holdPieceCanvas') as HTMLDivElement
        if (!canvas) return

        let ctx = (canvas as any).ctx
        if (!ctx) {
            const canvasEl = document.createElement('canvas')
            canvasEl.width = 100
            canvasEl.height = 100
            canvas.appendChild(canvasEl)
            ctx = canvasEl.getContext('2d')
            ;(canvas as any).ctx = ctx
        }

        ctx.clearRect(0, 0, 100, 100)

        if (!this.holdPiece) return

        const cellSize = 20
        const offsetX = (100 - this.holdPiece.shape[0].length * cellSize) / 2
        const offsetY = (100 - this.holdPiece.shape.length * cellSize) / 2

        for (let row = 0; row < this.holdPiece.shape.length; row++) {
            for (let col = 0; col < this.holdPiece.shape[row].length; col++) {
                if (this.holdPiece.shape[row][col]) {
                    ctx.fillStyle = `#${this.holdPiece.color.toString(16).padStart(6, '0')}`
                    ctx.fillRect(
                        offsetX + col * cellSize,
                        offsetY + row * cellSize,
                        cellSize - 2,
                        cellSize - 2
                    )
                }
            }
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
        // 加快下落速度
        this.dropSpeed = Math.max(100, 1000 - (level - 1) * 100)
        this.playSound('levelup')
    }
}
