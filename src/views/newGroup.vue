<template>
  <div class="wrapper-content">
    <div class="wrapper-box">
      <div class="breadcrumb">
        <span class="pull-right el-breadcrumb back" @click="$router.go(-1)">返回上一级</span>
        <el-breadcrumb separator="-">
          <el-breadcrumb-item>首页</el-breadcrumb-item>
          <el-breadcrumb-item>系统管理</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ name:'group'}">后台用户</el-breadcrumb-item>
          <el-breadcrumb-item>{{ $route.meta.title }}</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="display">
        <div class="display-main">
          <el-form label-position="top" :model="formGroup" :rules="rules" ref="formGroup">
            <el-form-item label="用户名" prop="username" required>
              <el-input v-model="formGroup.username" style="width: 500px;"></el-input>
            </el-form-item>
            <el-form-item label="用户密码" prop="password" required>
              <el-input type="password" v-model="formGroup.password" style="width: 500px;"></el-input>
            </el-form-item>
            <el-form-item label="角色组" prop="roleIds" required>
              <el-select v-model="formGroup.roleIds" placeholder="角色组" style="width: 500px;">
                <el-option
                  v-for="item in roleData"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-form>
          <el-button @click="handleSubmit" style="background-color: #67738d;color: #fff;width: 100px;">提交</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="less" rel="stylesheet/less" scoped>
  .first {
    border-top: 1px solid #e6e6e6;
  }

  .last {
    margin-bottom: 30px;
  }

  .line {
    padding: 14px 0px 14px 150px;
    border-bottom: 1px solid #e6e6e6;
    label {
      margin-bottom: 0;
      padding: 5px 10px;
      width: 180px;
      &.a {
        color: #5e6d82;
      }
      &.b {
        color: #99a9bf;
      }
    }
  }
</style>

<script>
  import md5 from 'md5'
  export default {
    mounted(){
      //获取角色列表
      this.axios.get('/api/basic/roles').then((response) => {
        if (response.data.code == 0) {
          this.roleData = response.data.result.model;
        } else {
          this.$message.error({
            message: response.data.desc,
            showClose: true
          });
        }
      }).catch((error) => {
        console.log(error)
      })
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
        //角色数组
        roleData: [],
        //角色添加信息
        formGroup: {
          id: '',
          username: '',
          password: '',
          roleIds: ''
        },
        rules: {
          username: [
            {validator: validateName, trigger: 'blur'}
          ],
          password: [
            {validator: validatePass, trigger: 'blur'}
          ],
          roleIds: [
            {type: 'number', message: '请选择角色组', trigger: 'change'}
          ]
        }
      }
    },
    methods: {
      handleSubmit() {
        this.$refs.formGroup.validate((valid) => {
          if (valid) {
            let group = {
              param: {
                id: this.formGroup.id,
                username: this.formGroup.username,
                password: md5(this.formGroup.password),
                roleIds: this.formGroup.roleIds
              }
            }
            this.axios.post('/api/basic/account', JSON.stringify(group)).then((response) => {
              if (response.data.code == 0) {
                this.$message.success({
                  message: '用户新增成功！',
                  showClose: true
                });
                this.$router.replace({path: '/group'})
              }
              else {
                this.$message.error({
                  message: response.data.desc,
                  showClose: true
                });
              }
            }).catch((error) => {
              console.log(error)
            })
          } else {
            console.log('error');
            return false;
          }
        });
      }
    }
  }
</script>
