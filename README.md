# Game Collection - 多平台游戏集合

一个基于 Vue 3 + TypeScript + Phaser 的现代化游戏集合应用，支持多语言、主题切换和响应式设计。

## 🎮 功能特性

- **多游戏支持**: 包含俄罗斯方块、贪吃蛇等经典游戏
- **多语言**: 支持中文、英文、德文、法文、阿拉伯文
- **主题切换**: 支持亮色/暗色主题，可跟随系统设置
- **响应式设计**: 完美适配桌面端和移动端
- **游戏数据**: 本地存储高分记录和游戏设置
- **现代化UI**: 使用 CSS Grid/Flexbox 和动画效果
- **PWA支持**: 可安装为原生应用
- **多平台**: 支持 Web、桌面(Tauri)、移动端(Capacitor)

## 🛠️ 技术栈

### 前端框架
- **Vue 3** - 渐进式JavaScript框架
- **TypeScript** - 类型安全的JavaScript
- **Vite** - 快速的构建工具
- **Vue Router** - 官方路由管理器
- **Pinia** - 状态管理库

### 游戏引擎
- **Phaser 3** - 2D游戏框架

### 样式方案
- **SCSS** - CSS预处理器
- **CSS变量** - 动态主题切换
- **响应式设计** - 移动优先

### 国际化
- **Vue I18n** - 国际化解决方案

### 构建工具
- **Vite** - 开发服务器和构建工具
- **unplugin-auto-import** - 自动导入
- **unplugin-vue-components** - 组件自动导入

### 跨平台
- **Tauri** - 桌面应用框架
- **Capacitor** - 移动应用框架

## 📁 项目结构

```
src/
├── assets/              # 静态资源
│   ├── images/         # 图片资源
│   ├── fonts/          # 字体文件
│   └── icons/          # 图标文件
├── components/         # 可复用组件
│   ├── layout/         # 布局组件
│   ├── icons/          # 图标组件
│   └── common/         # 通用组件
├── games/              # 游戏模块
│   ├── base/           # 游戏基类
│   ├── tetris/         # 俄罗斯方块
│   ├── snake/          # 贪吃蛇
│   ├── puzzle/         # 拼图游戏
│   └── memory/         # 记忆游戏
├── stores/             # 状态管理
│   ├── game.ts         # 游戏状态
│   └── theme.ts        # 主题状态
├── views/              # 页面组件
│   ├── HomeView.vue    # 首页
│   ├── GameView.vue    # 游戏列表
│   └── SettingView.vue # 设置页面
├── router/             # 路由配置
├── i18n/               # 国际化
│   └── locales/        # 语言文件
├── styles/             # 样式文件
│   ├── _variables.scss # 变量定义
│   ├── _themes.scss    # 主题样式
│   ├── _utilities.scss # 工具类
│   └── _animations.scss# 动画效果
├── utils/              # 工具函数
├── types/              # 类型定义
└── main.ts             # 应用入口
```

## 🚀 快速开始

### 环境要求

- Node.js >= 16.0.0
- npm >= 7.0.0 或 yarn >= 1.22.0

### 安装依赖

```bash
# 使用 npm
npm install

# 或使用 yarn
yarn install
```

### 开发模式

```bash
# 启动开发服务器
npm run dev

# 或使用 yarn
yarn dev
```

访问 [http://localhost:5173](http://localhost:5173) 查看应用。

### 构建生产版本

```bash
# 构建 Web 版本
npm run build

# 预览构建结果
npm run preview
```

### 桌面应用开发

```bash
# 启动 Tauri 开发模式
npm run tauri:dev

# 构建桌面应用
npm run tauri:build
```

### 移动应用开发

```bash
# 添加 iOS 平台
npx cap add ios

# 添加 Android 平台
npx cap add android

# 同步代码到原生平台
npx cap sync

# 在 iOS 模拟器中运行
npx cap run ios

# 在 Android 模拟器中运行
npx cap run android
```

## 🎯 游戏说明

### 俄罗斯方块 (Tetris)
- **操作**: 方向键或 WASD 控制移动和旋转
- **目标**: 填满整行消除，获得更高分数
- **特色**: 经典7种方块类型，等级递增系统

### 贪吃蛇 (Snake)
- **操作**: 方向键或 WASD 控制方向
- **目标**: 吃食物让蛇变长，避免撞墙和自己
- **特色**: 移动端虚拟按键支持

### 拼图游戏 (Puzzle)
- **操作**: 点击拖拽拼图块
- **目标**: 将打乱的图片拼成完整图案
- **特色**: 多种难度等级

### 记忆翻牌 (Memory)
- **操作**: 点击翻开卡牌
- **目标**: 找到所有匹配的卡牌对
- **特色**: 计时挑战，记忆力训练

## 🌐 国际化

项目支持以下语言：

- 🇨🇳 简体中文 (zh-CN)
- 🇺🇸 English (en-US)
- 🇩🇪 Deutsch (de-DE)
- 🇫🇷 Français (fr-FR)
- 🇸🇦 العربية (ar-SA)

语言文件位于 `src/i18n/locales/` 目录下。

## 🎨 主题系统

支持三种主题模式：
- **亮色主题**: 适合白天使用
- **暗色主题**: 适合夜间使用
- **自动模式**: 跟随系统设置

主题配置文件：`src/styles/_themes.scss`

## 🏗️ 架构设计

### 组件架构
- **原子化组件**: 最小粒度的UI元素
- **复合组件**: 业务逻辑组件
- **页面组件**: 路由级别组件
- **布局组件**: 页面结构组件

### 状态管理
使用 Pinia 进行状态管理：
- **游戏状态**: 分数、等级、设置等
- **主题状态**: 当前主题、用户偏好
- **用户数据**: 游戏记录、个人设置

### 游戏引擎集成
- **BaseGameScene**: 游戏场景基类
- **统一接口**: 标准化游戏生命周期
- **状态同步**: Vue响应式数据与Phaser集成

## 📱 响应式设计

### 断点设置
- **移动端**: < 768px
- **平板**: 768px - 1024px
- **桌面**: > 1024px

### 适配策略
- **移动优先**: 从小屏幕开始设计
- **渐进增强**: 大屏幕添加更多功能
- **触摸优化**: 移动端手势支持

## 🔧 开发指南

### 添加新游戏

1. 在 `src/games/` 下创建游戏目录
2. 继承 `BaseGameScene` 类
3. 实现必要的游戏逻辑方法
4. 创建对应的 Vue 组件
5. 添加路由配置
6. 更新多语言文件

### 代码规范

- **TypeScript**: 严格类型检查
- **ESLint**: 代码质量检查
- **Prettier**: 代码格式化
- **命名约定**:
    - 组件: PascalCase
    - 文件: kebab-case
    - 变量: camelCase
    - 常量: UPPER_SNAKE_CASE

### Git 提交规范

```
feat: 新功能
fix: 修复bug
docs: 文档更新
style: 代码格式化
refactor: 代码重构
test: 测试相关
chore: 构建/工具链更新
```

## 🚀 部署

### Web 部署

```bash
# 构建生产版本
npm run build

# 部署到静态服务器
# dist/ 目录包含所有静态文件
```

### 桌面应用发布

```bash
# 构建桌面应用
npm run tauri:build

# 生成的安装包在 src-tauri/target/release/bundle/
```

### 移动应用发布

```bash
# 构建 iOS 应用
npx cap build ios

# 构建 Android 应用
npx cap build android
```

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📄 许可证

本项目采用 CC BY-NC-SA 4.0 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🙏 致谢

- [Vue.js](https://vuejs.org/) - 渐进式JavaScript框架
- [Phaser](https://phaser.io/) - 优秀的2D游戏框架
- [Tauri](https://tauri.app/) - 轻量级桌面应用框架
- [Capacitor](https://capacitorjs.com/) - 跨平台移动应用框架

## 📞 联系方式

如有问题或建议，请通过以下方式联系：

- 提交 [Issue](https://github.com/your-username/game-collection/issues)
- 发送邮件至: 397547360@qq.com

---

**享受游戏的乐趣！** 🎮
