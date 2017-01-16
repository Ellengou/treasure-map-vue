<template>
  <div id="wrapper">
    <nav class="navbar-static-side">
      <div class="sidebar-collapse">
        <div class="nav" id="side-menu">
          <div class="nav-header">
            <div class="dropdown profile-element">
              <span><img alt="image" class="img-circle" src="../../static/profile_small.jpg"/></span>
              <a data-toggle="dropdown" class="dropdown-toggle">
                  <span class="clear">
                    <span class="block m-t-xs"><strong class="font-bold">{{ userName }}</strong></span>
                    <span class="text-muted text-xs block">{{ roleName }}<b class="caret"></b></span>
                  </span>
              </a>
              <ul class="dropdown-menu animated fadeInRight m-t-xs">
                <li><a @click="dialogVisible = true">修改密码</a></li>
                <li class="divider"></li>
                <li>
                  <a @click="loginOut">安全退出</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <el-menu :default-active="$route.path" :router="true" theme="dark">
          <el-menu-item index=""><i class="el-icon-menu"></i>主页</el-menu-item>
          <el-submenu index="1" v-if="checkList(11)">
            <template slot="title"><i class="el-icon-message"></i>商户管理</template>
            <el-menu-item index="/label" v-if="checkList(1101)">标签管理</el-menu-item>
            <el-menu-item index="/antique" v-if="checkList(1102)">古玩城管理</el-menu-item>
            <el-menu-item index="/shop" v-if="checkList(1103)">店铺管理</el-menu-item>
          </el-submenu>
          <el-submenu index="2" v-if="checkList(13)">
            <template slot="title"><i class="el-icon-message"></i>商品管理</template>
            <el-menu-item index="/sort" v-if="checkList(1301)">分类管理</el-menu-item>
            <el-menu-item index="/product" v-if="checkList(1302)">商品列表</el-menu-item>
          </el-submenu>
          <el-menu-item index="/user" v-if="checkList(12)"><i class="el-icon-menu"></i>用户管理</el-menu-item>
          <el-submenu index="3" v-if="checkList(14)">
            <template slot="title"><i class="el-icon-message"></i>系统管理</template>
            <el-menu-item index="/role" v-if="checkList(1401)">角色管理</el-menu-item>
            <el-menu-item index="/group" v-if="checkList(1402)">后台用户</el-menu-item>
          </el-submenu>
        </el-menu>
      </div>
    </nav>
    <div id="page-wrapper" class="gray-bg">
      <div class="row" id="mainTop"></div>
      <div class="row" id="mainContent" style="height: calc(100% - 98px);">
        <div class="iframe">
          <router-view></router-view>
        </div>
      </div>
      <div class="row" id="mainFooter">
        <div class="pull-right">© 2014-2015 <a href="http://www.zi-han.net/" target="_blank">寻宝图</a></div>
      </div>
    </div>
    <el-dialog title="提示" v-model="dialogVisible" size="tiny">
      <span>这是一段信息</span>
      <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>
<style lang="less" rel="stylesheet/less">
  @import "../assets/less/home.less";
</style>
<script>
  export default{
    mounted(){
      $(".sidebar-collapse").slimScroll({
        size: '4px',
        height: "100%",
        railOpacity: .5,
        alwaysVisible: false
      })
      //localStorage权限
      let token = window.localStorage.getItem('token')
      if (token) {
        this.userName = JSON.parse(token).username;
        this.roleName = JSON.parse(token).role.name;
        this.menuCodes = JSON.parse(token).menuCodes;
      }
    },
    data(){
      return {
        dialogVisible: false,
        userName: '',
        roleName: '',
        menuCodes: []
      }
    },
    methods: {
      checkList(index){
        return this.menuCodes.filter(function (item) {
          return item == index
        }).length
      },
      loginOut(){
        this.axios.get('/api/logout')
        window.localStorage.removeItem('token')
        this.$router.replace({name: 'login'})
      }
    }
  }
</script>
