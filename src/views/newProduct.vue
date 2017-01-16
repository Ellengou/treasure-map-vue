<template>
  <div class="wrapper-content" style="background: transparent;">
    <div class="wrapper-box" style="background: transparent;">
      <div class="breadcrumb">
        <span class="pull-right el-breadcrumb back" @click="$router.go(-1)">返回上一级</span>
        <el-breadcrumb separator="-">
          <el-breadcrumb-item>首页</el-breadcrumb-item>
          <el-breadcrumb-item>商品管理</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ name: 'product' }">商品列表</el-breadcrumb-item>
          <el-breadcrumb-item>{{ $route.meta.title }}</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="display" style="margin-top: 20px;padding: 0px;">
        <div class="display-main">
          <el-row :gutter="20">
            <el-col :span="10">
              <div class="grid-content">
                <div class="grid-top">基本资料</div>
                <div class="grid-box" style="min-height: 762px;">
                  <el-form :model="formProduct" :rules="rules" label-position="top" ref="formProduct">
                    <el-form-item label="选择店铺" prop="businessId" required>
                      <el-select v-model="formProduct.businessId" placeholder="请选择" style="width: 500px;">
                        <el-option
                          v-for="item in businessData"
                          :label="item.name"
                          :value="item.id">
                        </el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item label="选择分类" prop="categoryId" required>
                      <el-select v-model="formProduct.categoryId" placeholder="请选择" style="width: 500px;">
                        <el-option
                          v-for="item in categoryData"
                          :label="item.name"
                          :value="item.id">
                        </el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item label="商品名称" prop="name" required>
                      <el-input v-model="formProduct.name" style="width: 500px;"></el-input>
                    </el-form-item>
                    <el-form-item label="商品描述" prop="remark">
                      <el-input v-model="formProduct.remark" style="width: 500px;"></el-input>
                    </el-form-item>
                    <el-form-item label="材质" prop="material">
                      <el-input v-model="formProduct.material" style="width: 500px;"></el-input>
                    </el-form-item>
                    <el-form-item label="尺寸" prop="spec">
                      <el-input v-model="formProduct.spec" style="width: 500px;"></el-input>
                    </el-form-item>
                    <!--<el-form-item label="年代" prop="dynasty" required>-->
                    <!--<el-input v-model="formProduct.dynasty" style="width: 500px;"></el-input>-->
                    <!--</el-form-item>-->
                    <!--<el-form-item label="证书" prop="cid" required>-->
                    <!--<el-input v-model="formProduct.cid" style="width: 500px;"></el-input>-->
                    <!--</el-form-item>-->
                    <el-form-item label="价格" prop="price" required>
                      <el-input v-model="formProduct.price" style="width: 500px;">
                        <template slot="append">元</template>
                      </el-input>
                    </el-form-item>
                    <el-form-item label="库存" prop="inventory" required>
                      <el-input v-model="formProduct.inventory" style="width: 500px;">
                        <template slot="append">件</template>
                      </el-input>
                    </el-form-item>
                  </el-form>
                </div>
              </div>
            </el-col>
            <el-col :span="14">
              <div class="grid-content">
                <div class="grid-top">商品图片</div>
                <div class="grid-box" style="min-height: 762px;">
                  <div class="grid-photo">
                    <img src="../../static/bg.png" width="200" height="200" style="margin-bottom: 10px;"
                         v-if="!fileList.length">
                    <div v-for="file in fileList" class="photo">
                      <img :src="file.url">
                      <div class="el-upload__file is-finished" style="margin: 5px 0px;">
                        <a class="el-upload__file__name">
                          <i class="el-icon-document"></i>{{file.name}}
                        </a>
                        <span class="el-upload__btn-delete" @click="handleRemove(file)">删除</span>
                      </div>
                    </div>
                  </div>
                  <el-upload
                    :action="basePath+'/image/upload'"
                    :multiple="true"
                    :before-upload="uploadBefore"
                    :show-upload-list="false"
                    :on-success="handleSuccess"
                    style="width: 100%;">
                    <el-button size="small" type="primary">点击上传</el-button>
                    <div class="el-upload__tip" slot="tip">仅支持JPG、JPEG、PNG格式的图片文件，文件不能大于1MB, 上传数量不能大于9张</div>
                  </el-upload>
                </div>
              </div>
            </el-col>
          </el-row>
          <el-button style="background-color: #67738d;color: #fff;width: 100%;margin-top: 20px;" @click="handleSubmit">
            提交
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="less" rel="stylesheet/less" scoped>
  @color: #333642;
  .first {
    border-top: 1px solid #e6e6e6;
  }

  .last {
    margin-bottom: 30px;
  }

  .el-checkbox {
    margin-right: 15px;
  }

  .el-checkbox + .el-checkbox {
    margin-left: 0;
    margin-right: 15px;
  }

  .grid-content {
    border-top: 4px solid #e6e6e6;
    background-color: #fff;
    .grid-top {
      color: @color;
      padding: 0px 20px;
      height: 45px;
      line-height: 44px;
      border-bottom: 1px solid #e6e6e6;
    }
    .grid-box {
      padding: 20px;
    }
  }

  .grid-photo {
    .photo {
      display: inline-block;
      margin-right: 25px;
      width: 200px;
      height: 200px;
      &:nth-child(4) {
        margin-right: 0px;
      }
      [class^=el-icon] {
        color: #99a9bf;
        margin-right: 7px;
        height: 100%;
        line-height: inherit;
      }
      img {
        width: 100%;
        height: 100%;
      }
    }
  }
</style>

<script>
  export default {
    mounted(){
      //获取分类列表
      this.axios.get('/api/item/tag/list').then((response) => {
        if (response.data.code == 0) {
          this.categoryData = response.data.result.model;
        } else {
          this.$message.error({
            message: response.data.desc,
            showClose: true
          });
        }
      })
      //获取店铺列表
      this.axios.post('/api/shop/list', JSON.stringify({
        param: {
          key: ''
        }
      })).then((response) => {
        if (response.data.code == 0) {
          this.businessData = response.data.result.model;
        } else {
          this.$message.error({
            message: response.data.desc,
            showClose: true
          });
        }
      })
      //获取商品
      let id = this.$route.query.id;
      if (id) {
        this.axios.get('/api/item/' + id).then((response) => {
          if (response.data.code == 0) {
            this.id = response.data.result.model.id;
            this.formProduct.businessId = response.data.result.model.businessId;
            this.formProduct.categoryId = response.data.result.model.categoryId;
            this.formProduct.name = response.data.result.model.name;
            this.formProduct.remark = response.data.result.model.remark;
            this.formProduct.material = response.data.result.model.material;
            this.formProduct.spec = response.data.result.model.spec;
            this.formProduct.price = response.data.result.model.price;
            this.formProduct.inventory = response.data.result.model.inventory;
            this.fileList = response.data.result.model.pics;
          } else {
            this.$message.error({
              message: response.data.desc,
              showClose: true
            });
          }
        })
      }
    },
    data(){
      var validatePrice = (rule, value, callback) => {
        let reg = /^\d+(\.\d+)?$/;
        if (!reg.test(value)) {
          return callback(new Error('价格格式为：0 或 正整数 或 正小数'));
        } else {
          callback()
        }
      };
      var validateInventory = (rule, value, callback) => {
        let reg = /^(0|\+?[1-9][0-9]*)$/;
        if (!reg.test(value)) {
          return callback(new Error('库存格式为：0 或 正整数'));
        } else {
          callback()
        }
      };
      return {
        id: '',
        //标签数组
        businessData: [],
        categoryData: [],
        formProduct: {
          businessId: '',
          categoryId: '',
          name: '',
          desc: '',
          material: '',
          spec: '',
          //dynasty: '',
          //cid: '',
          price: '',
          inventory: 1
        },
        arrList: [],
        fileList: [],
        rules: {
          businessId: [
            {type: 'number', message: '请选择店铺', trigger: 'change'}
          ],
          categoryId: [
            {type: 'number', message: '请选分类', trigger: 'change'}
          ],
          name: [
            {required: true, message: '请输入商品名称', trigger: 'blur'}
          ],
          price: [
            {validator: validatePrice, trigger: 'blur'}
          ],
          inventory: [
            {validator: validateInventory, trigger: 'blur'}
          ]
        }
      }
    },
    methods: {
      handleSubmit() {
        this.$refs.formProduct.validate((valid) => {
          if (valid) {
            let product = {
              param: {
                id: this.id,
                businessId: this.formProduct.businessId,
                categoryId: this.formProduct.categoryId,
                name: this.formProduct.name,
                remark: this.formProduct.remark,
                material: this.formProduct.material,
                spec: this.formProduct.spec,
                price: this.formProduct.price,
                inventory: this.formProduct.inventory,
                pics: this.fileList
              }
            }
            this.axios.post('/api/item/add-update', JSON.stringify(product)).then((response) => {
              if (response.data.code == 0) {
                let string = this.$route.query.id ? '商品编辑成功' : '商品新增成功';
                this.$message.success({
                  message: string,
                  showClose: true
                });
                this.$router.replace({
                  path: '/product',
                  query: {
                    id: this.$route.id,
                    businessId: this.$route.businessId,
                    categoryId: this.$route.categoryId,
                    status: this.$route.status,
                    key: this.$route.key,
                    currentPage: this.$route.currentPage,
                    pageSize: this.$route.pageSize
                  }
                })
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
      },
      uploadBefore(file) {
        let reg = /.*(.jpg|.png|.gif)$/;//匹配图片格式
        // 限制文件大小 (大图标1M以下)
        if (reg.test(file.name.toLowerCase())) {
          if ((file.size / 1024) > 1024) {
            this.$message.error({
              message: '图片不能超过1M, 请重新上传!',
              showClose: true
            })
            return false
          }
        } else {
          this.$message.error({
            message: '图片格式不正确, 请重新上传!',
            showClose: true
          })
          return false
        }
      },
      handleRemove(file, fileList) {
        this.axios.post('/api/item/picture/delete', JSON.stringify({
          param: {
            url: file.url
          }
        })).then((response) => {
        })
        this.fileList = _.difference(this.fileList, [file])
      },
      handlePreview(file) {
        console.log(file.response);
      },
      handleSuccess(response, file, fileList){
        if (this.fileList.length < 9) {
          this.fileList = _.concat(this.fileList, {
            name: file.name,
            url: response.result.model
          });
        }
      }
    }
  }
</script>
