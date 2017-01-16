<template>
  <div class="wrapper-content">
    <div class="wrapper-box">
      <div class="breadcrumb">
        <span class="pull-right el-breadcrumb back" @click="$router.go(-1)">返回上一级</span>
        <el-breadcrumb separator="-">
          <el-breadcrumb-item>首页</el-breadcrumb-item>
          <el-breadcrumb-item>商品管理</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ name:'sort' }">分类管理</el-breadcrumb-item>
          <el-breadcrumb-item>{{ $route.meta.title }}</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="display">
        <div class="display-main">
          <el-form label-position="top" :model="formLabel" :rules="rules" ref="formLabel">
            <el-form-item label="分类" prop="name" required>
              <el-input v-model="formLabel.name" style="width: 500px;"></el-input>
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
  export default {
    mounted(){
      let id = this.$route.query.id;
      let name = this.$route.query.name;
      if (id) {
        this.formLabel.id = id;
        this.formLabel.name = name;
      }
    },
    data(){
      var validateName = (rule, value, callback) => {
        let reg = /^[A-Za-z0-9\u4e00-\u9fa5]+$/;
        if (!reg.test(value)) {
          return callback(new Error('标签格式：只能包含字符、数字和汉字。'));
        } else {
          callback()
        }
      };
      return {
        //角色数组
        roleData: [],
        //角色添加信息
        formLabel: {
          id: '',
          name: ''
        },
        rules: {
          name: [
            {validator: validateName, trigger: 'blur'}
          ]
        }
      }
    },
    methods: {
      handleSubmit() {
        this.$refs.formLabel.validate((valid) => {
          if (valid) {
            let sort = {
              param: {
                id: this.formLabel.id,
                name: this.formLabel.name
              }
            }
            this.axios.post('/api/item/tag/add', JSON.stringify(sort)).then((response) => {
              if (response.data.code == 0) {
                let string = this.$route.query.id ? '分类编辑成功！': '分类新增成功！';
                this.$message.success({
                  message: string,
                  showClose: true
                });
                this.$router.replace({path: '/sort'})
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
