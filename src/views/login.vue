<template>
  <div id="loginBg">
    <div class="login-main">
      <div class="title-en">welcome</div>
      <div class="title-zh">寻宝图</div>
      <div class="box">
        <p class="subTitle">用户登录</p>
        <div @keyup.enter="login">
          <el-form :model="user" :rules="rules" ref="user">
            <el-form-item prop="username" required>
              <el-input type="text" v-model.trim="user.username" placeholder="Username"></el-input>
            </el-form-item>
            <el-form-item prop="password" required>
              <el-input type="password" v-model.trim="user.password" placeholder="Password"></el-input>
            </el-form-item>
            <el-form-item style="text-align: right;padding-top: 15px;">
              <el-button type="primary" @click.stop.prevent="login">LGOIN</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="less" rel="stylesheet/less">
  @import "../assets/less/login.less";
</style>
<script>
  import md5 from 'md5'
  export default{
    mounted(){
      window.localStorage.removeItem('token')
    },
    data(){
      var validateName = (rule, value, callback) => {
        let reg = /^\w{6,11}$/;
        if (!reg.test(value)) {
          return callback(new Error('账户格式为：长度在6-11之间，只能包含字符、数字和下划线。'));
        } else {
          callback()
        }
      };
      var validatePass = (rule, value, callback) => {
        let reg = /^\w{6,12}$/;
        if (!reg.test(value)) {
          return callback(new Error('密码格式为：长度在6-12之间，只能包含字符、数字和下划线。'));
        } else {
          callback()
        }
      };
      return {
        user: {
          username: '',
          password: '',
          checked: false
        },
        rules: {
          username: [
            {validator: validateName, trigger: 'blur'}
          ],
          password: [
            {validator: validatePass, trigger: 'blur'}
          ]
        }
      }
    },
    methods: {
      login () {
        this.$nextTick(() => {
          this.$refs.user.validate((valid) => {
            if (valid) {
              let user = {
                param: {
                  username: this.user.username,
                  password: md5(this.user.password),
                  imageCode: ''
                }
              };
              this.axios.post('/api/login', JSON.stringify(user)).then((response) => {
                // 登录成功后存储token
                if (response.data.code == 0) {
                  window.localStorage.setItem('token', JSON.stringify(response.data.result.model))
                  this.goHome()
                } else {
                  this.$message.error({
                    showClose: true,
                    message: response.data.desc
                  });
                }
              }).catch((error) => {
                console.log(error)
              })
            }
          });
        })
      },
      goHome(){
        this.$router.replace({name: 'role'})
      }
    }
  }
</script>
