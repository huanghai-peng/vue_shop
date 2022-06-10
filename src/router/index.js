import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from 'views/login/Login.vue'
import Home from 'views/home/Home.vue'
import Users from 'views/users/Users.vue'
import Roles from 'views/roles/Roles.vue'
import Rights from 'views/rights/Rights.vue'
import Goods from 'views/goods/Goods.vue'
import Params from 'views/params/Params.vue'
import Categories from 'views/categories/Categories.vue'
import Orders from 'views/orders/Orders.vue'
import Reports from 'views/reports/Reports.vue'
import add from 'views/add/Add.vue'

Vue.use(VueRouter)

const routes = [{
    path: '/',
    redirect: '/login'
}, {
    path: '/login',
    component: Login
}, {
    path: '/home',
    component: Home,
    children: [{
            path: '/users',
            component: Users
        }, {
            path: '/roles',
            component: Roles
        }, {
            path: '/rights',
            component: Rights
        }, {
            path: '/goods',
            component: Goods
        }, {
            path: '/params',
            component: Params
        }, {
            path: '/categories',
            component: Categories
        }, {
            path: '/orders',
            component: Orders
        },
        {
            path: '/goods/add',
            component: add
        }, {
            path: '/reports',
            component: Reports
        }
    ]
}]

const router = new VueRouter({
    routes
})

router.beforeEach((to, from, next) => {
    if (to.path == '/login') next()
    if (to.path !== '/login') {
        if (!sessionStorage.getItem('token')) {
            next('/login')
        } else {
            next()
        }
    }
})



export default router