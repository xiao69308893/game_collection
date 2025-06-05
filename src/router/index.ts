import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        name: 'home',
        component: () => import('@/views/HomeView.vue'),
        meta: {
            title: 'home.title'
        }
    },
    {
        path: '/games',
        name: 'games',
        component: () => import('@/views/GameView.vue'),
        meta: {
            title: 'games.title'
        }
    },
    {
        path: '/games/tetris',
        name: 'tetris',
        component: () => import('@/games/tetris/TetrisGame.vue'),
        meta: {
            title: 'games.tetris'
        }
    },
    {
        path: '/games/snake',
        name: 'snake',
        component: () => import('@/games/snake/SnakeGame.vue'),
        meta: {
            title: 'games.snake'
        }
    },
    // {
    //     path: '/games/puzzle',
    //     name: 'puzzle',
    //     component: () => import('@/games/puzzle/PuzzleGame.vue'),
    //     meta: {
    //         title: 'games.puzzle'
    //     }
    // },
    // {
    //     path: '/games/memory',
    //     name: 'memory',
    //     component: () => import('@/games/memory/MemoryGame.vue'),
    //     meta: {
    //         title: 'games.memory'
    //     }
    // },
    {
        path: '/settings',
        name: 'settings',
        component: () => import('@/views/SettingView.vue'),
        meta: {
            title: 'settings.title'
        }
    },
    {
        path: '/:pathMatch(.*)*',
        name: 'not-found',
        component: () => import('@/views/NotFound.vue'),
        meta: {
            title: 'error.notFound'
        }
    }
]

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes
})

// 路由守卫
router.beforeEach((to, from, next) => {
    // 设置页面标题
    const title = to.meta.title as string
    if (title) {
        document.title = `${title} - Game Collection`
    }
    next()
})

export default router
