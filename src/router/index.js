/**
 * Created by qian on 2016/12/21.
 */
import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)

// 定义（路由）组件
import Login from '../views/login'
import Home from '../views/home'
import Label from '../views/label'
import NewLabel from '../views/newLabel'
import Antique from '../views/antique'
import NewAntique from '../views/newAntique'
import Shop from '../views/shop'
import NewShop from '../views/newShop'
import Sort from '../views/sort'
import NewSort from '../views/newSort'
import Product from '../views/product'
import NewProduct from '../views/newProduct'
import User from '../views/user'
import NewUser from '../views/newProduct'
import Role from '../views/role'
import NewRole from '../views/newRole'
import Group from '../views/group'
import NewGroup from '../views/newGroup'
import EditGroup from '../views/editGroup'
import Password from '../views/password'
import NotFound from '../views/404'

// 创建 router 实例
const router = new VueRouter({
  mode: 'hash',
  linkActiveClass: 'active',
  routes: [
    {
      path: '/',
      redirect: {name: 'login'}
    },
    {
      name: 'login',
      path: '/login',
      component: Login,
      meta: {title: '用户登录'}
    },
    {
      name: 'home',
      path: '/home',
      component: Home,
      meta: {title: '主页'},
      redirect: {name: 'role'},
      children: [
        {name: 'label', path: '/label', component: Label, meta: {title: '标签管理'}},
        {name: 'newLabel', path: '/newLabel', component: NewLabel, meta: {title: '新增标签'}},
        {name: 'editLabel', path: '/editLabel', component: NewLabel, meta: {title: '编辑标签'}},
        {name: 'antique', path: '/antique', component: Antique, meta: {title: '古玩城管理'}},
        {name: 'newAntique', path: '/newAntique', component: NewAntique, meta: {title: '新增古玩城'}},
        {name: 'editAntique', path: '/editAntique', component: NewAntique, meta: {title: '编辑古玩城'}},
        {name: 'shop', path: '/shop', component: Shop, meta: {title: '店铺管理'}},
        {name: 'newShop', path: '/newShop', component: NewShop, meta: {title: '新增店铺'}},
        {name: 'editShop', path: '/editShop', component: NewShop, meta: {title: '编辑店铺'}},
        {name: 'sort', path: '/sort', component: Sort, meta: {title: '分类管理'}},
        {name: 'newSort', path: '/newSort', component: NewSort, meta: {title: '新增分类'}},
        {name: 'editSort', path: '/editSort', component: NewSort, meta: {title: '编辑分类'}},
        {name: 'product', path: '/product', component: Product, meta: {title: '商品列表'}},
        {name: 'newProduct', path: '/newProduct', component: NewProduct, meta: {title: '新增商品'}},
        {name: 'editProduct', path: '/editProduct', component: NewProduct, meta: {title: '编辑商品'}},
        {name: 'user', path: '/user', component: User, meta: {title: '用户管理'}},
        {name: 'newUser', path: '/newUser', component: NewUser, meta: {title: '新增用户'}},
        {name: 'editUser', path: '/editUser', component: NewUser, meta: {title: '编辑用户'}},
        {name: 'role', path: '/role', component: Role, meta: {title: '角色管理'}},
        {name: 'newRole', path: '/newRole', component: NewRole, meta: {title: '新增角色'}},
        {name: 'editRole', path: '/editRole', component: NewRole, meta: {title: '编辑角色'}},
        {name: 'group', path: '/group', component: Group, meta: {title: '后台用户'}},
        {name: 'newGroup', path: '/newGroup', component: NewGroup, meta: {title: '新增用户'}},
        {name: 'editGroup', path: '/editGroup', component: EditGroup, meta: {title: '编辑用户'}},
        {name: 'password', path: '/password', component: Password, meta: {title: '密码修改'}}
      ]
    },
    {path: '*', component: NotFound}
  ]
})

router.beforeEach((to, from, next) => {
  // 已经登录的状态
  if (window.localStorage.getItem('token')) {
    if (to.name === 'home') {
      next({name: 'role'})
    } else {
      next()
    }
  } else if (to.name !== 'login') {
    next({name: 'login'})
  } else {
    next()
  }
})

export default router
