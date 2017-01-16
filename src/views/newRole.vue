<template>
  <div class="wrapper-content">
    <div class="wrapper-box">
      <div class="breadcrumb">
        <span class="pull-right el-breadcrumb back" @click="$router.go(-1)">返回上一级</span>
        <el-breadcrumb separator="-">
          <el-breadcrumb-item>首页</el-breadcrumb-item>
          <el-breadcrumb-item>系统管理</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ name:'role'}">角色管理</el-breadcrumb-item>
          <el-breadcrumb-item>{{ $route.meta.title }}</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="display">
        <div class="display-main">
          <el-form label-position="top" :model="formRole" :rules="rules" ref="formRole" :class="{ last: items.length }">
            <el-form-item label="角色名" prop="name">
              <el-input v-model="formRole.name" style="width: 500px;"></el-input>
            </el-form-item>
            <el-form-item label="角色描述" prop="description">
              <el-input type="textarea" v-model="formRole.description" style="width: 500px;"></el-input>
            </el-form-item>
            <div class="line" :class="{ first: !index }" v-for="(item,index) in items">
              <el-checkbox class="a" :label="item.id" v-model="formRole.menus"
                           style="float: left;margin-left: -180px;">{{item.name}}
              </el-checkbox>
              <el-checkbox class="b" :label="obj.id" v-model="formRole.types" v-for="obj in item.resource"
                           :disabled="isType(formRole.menus,item.id)">
                {{obj.name}}
              </el-checkbox>
            </div>
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

  .el-checkbox + .el-checkbox {
    margin-left: 0;
  }

  .line {
    padding: 14px 0px 14px 200px;
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
  export default {
    mounted(){
      //拉取菜单与权限列表
      this.axios.get('/api/basic/role-resource/list').then((response) => {
        if (response.data.code == 0) {
          this.items = response.data.result.model;
        } else {
          this.$message.error({
            message: response.data.desc,
            showClose: true
          })
        }
      })
      //编辑拉取数据
      let id = this.$route.query.id;
      if (id) {
        this.axios.get('/api/basic/role/' + id).then((response) => {
          if (response.data.code == 0) {
            this.formRole.id = response.data.result.model.id;
            this.formRole.name = response.data.result.model.name;
            this.formRole.description = response.data.result.model.description;
            this.formRole.menus = response.data.result.model.meunIds;
            this.formRole.types = response.data.result.model.resourceIds;
          }
        })
      }
    },
    data(){
      return {
        //权限数组
        items: [],
        //角色添加信息
        formRole: {
          id: '',
          name: '',
          description: '',
          menus: [],
          types: []
        },
        rules: {
          name: [
            {required: true, message: '请输入角色名称', trigger: 'blur'},
            {min: 1, max: 10, message: '角色名称长度规定在 10 个字符内', trigger: 'blur'}
          ],
          description: [
            {required: true, message: '请输入角色描述', trigger: 'blur'},
            {min: 1, max: 100, message: '角色描述长度规定 100 个字符内', trigger: 'blur'}
          ]
        }
      }
    },
    methods: {
      isType(array, id){
        return !array.filter(function (obj) {
          return obj == id;
        }).length
      },
      handleSubmit() {
        this.$refs.formRole.validate((valid) => {
          if (valid) {
            let role = {
              param: {
                id: this.formRole.id,
                name: this.formRole.name,
                description: this.formRole.description,
                meunIds: this.formRole.menus,
                resourceIds: this.formRole.menus.length ? this.formRole.types : []
              }
            }
            this.axios.post('/api/basic/role', JSON.stringify(role)).then((response) => {
              if (response.data.code == 0) {
                let string = this.$route.query.id ? '角色编辑成功！' : '角色新增成功！'
                this.$message.success({
                  message: string,
                  showClose: true
                });
                this.$router.replace({path: '/role'})
              } else {
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
