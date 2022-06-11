import Vue from 'vue'
import VueRouter from 'vue-router'

const Login = () =>
    import ('views/login/Login.vue')

const Home = () =>
    import ('views/home/Home.vue')

const Users = () =>
    import ('views/users/Users.vue')

const Roles = () =>
    import ('views/roles/Roles.vue')

const Rights = () =>
    import ('views/rights/Rights.vue')

const Goods = () =>
    import ('views/goods/Goods.vue')
const Params = () =>
    import ('views/params/Params.vue')
const Categories = () =>
    import ('views/categories/Categories.vue')
const Orders = () =>
    import ('views/orders/Orders.vue')
const Reports = () =>
    import ('views/reports/Reports.vue')
const add = () =>
    import ('views/add/Add.vue')

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