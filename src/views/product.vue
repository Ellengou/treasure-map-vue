<template>
  <div class="wrapper-content">
    <div class="wrapper-box">
      <div class="breadcrumb">
        <el-breadcrumb separator="-">
          <el-breadcrumb-item>首页</el-breadcrumb-item>
          <el-breadcrumb-item>商品管理</el-breadcrumb-item>
          <el-breadcrumb-item>{{$route.meta.title}}</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="display">
        <div class="display-button">
          <el-button type="info" icon="plus" @click="addLabel">新增商品</el-button>
          <el-button type="info" icon="delete2" @click="handleDeleteAll">批量删除</el-button>
          <el-button type="info" icon="arrow-up" @click="handleUpAll">批量上架</el-button>
          <el-button type="info" icon="arrow-down" @click="handleDownAll">批量下架</el-button>
          <div class="pull-right ml10">
            <div class="pull-left">
              <el-select v-model="businessId" placeholder="所属店铺" style="width: 150px;">
                <el-option
                  label="全部"
                  value="-1" style="color: #98b1d0;" v-if="shopData.length">
                </el-option>
                <el-option
                  v-for="item in shopData"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </div>
            <div class="pull-left ml10">
              <el-select v-model="categoryId" placeholder="分类" style="width: 150px;">
                <el-option
                  label="全部"
                  value="-1" style="color: #98b1d0;" v-if="tagData.length">
                </el-option>
                <el-option
                  v-for="item in tagData"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </div>
            <div class="pull-left ml10">
              <el-select v-model="status" placeholder="状态" style="width: 100px;">
                <el-option label="全部" value="-1" style="color: #98b1d0;"></el-option>
                <el-option label="下架" value="0"></el-option>
                <el-option label="上架" value="1"></el-option>
              </el-select>
            </div>
            <div class="pull-left ml10" style="width: 250px;">
              <el-input v-model.trim="key">
                <el-button slot="append" icon="search" @click="searchClick"></el-button>
              </el-input>
            </div>
          </div>
        </div>
        <div class="display-main" v-loading="loading" element-loading-text="拼命加载中">
          <el-table
            :data="tableData"
            border
            style="width: 100%"
            @selection-change="handleSelectionChange">
            <el-table-column
              type="selection"
              width="46">
            </el-table-column>
            <el-table-column
              label="图片"
              min-width="54">
              <template scope="scope">
                <div style="padding: 10px 0px;" v-if="scope.row.path">
                  <img :src="scope.row.path" width="50" height="50">
                </div>
              </template>
            </el-table-column>
            <el-table-column
              label="产品名称"
              min-width="190">
              <template scope="scope">
                <div class="blue">{{ scope.row.name }}</div>
              </template>
            </el-table-column>
            <el-table-column
              prop="price"
              label="单价(元)"
              min-width="70">
            </el-table-column>
            <el-table-column
              prop="inventory"
              label="库存"
              min-width="70">
            </el-table-column>
            <el-table-column
              prop="shopName"
              label="所属店铺"
              min-width="150">
            </el-table-column>
            <el-table-column
              prop="tagName"
              label="分类"
              min-width="60">
            </el-table-column>
            <el-table-column
              label="发布时间"
              min-width="100">
              <template scope="scope">
                {{ scope.row.createTime }}
              </template>
            </el-table-column>
            <el-table-column
              label="状态"
              min-width="50">
              <template scope="scope">
                <p :class="{noMarket:!scope.row.marketAble}">{{ scope.row.marketAble ? '上架':'下架' }}</p>
              </template>
            </el-table-column>
            <el-table-column
              label="操作"
              min-width="110">
              <template scope="scope">
                <el-button
                  type="success"
                  size="small"
                  @click="handleUp(scope.row)" v-if="!scope.row.marketAble">上架
                </el-button>
                <el-button
                  type="warning"
                  size="small"
                  @click="handleDown(scope.row)" v-else>下架
                </el-button>
                <el-button
                  type="info"
                  size="small"
                  @click="handleEdit(scope.row)">编辑
                </el-button>
                <el-button
                  size="small"
                  type="danger"
                  @click="handleDelete(scope.row)">删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="pagination" v-show="pageTotal">
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="currentPage"
              :page-sizes="[20, 40, 60, 80]"
              :page-size="pageSize"
              layout="prev, pager, next, total, sizes, jumper"
              :total="pageTotal">
            </el-pagination>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="less" rel="stylesheet/less">
  .ml10 {
    margin-left: 10px;
  }

  .blue {
    color: #268bce;
  }

  .noMarket {
    color: #999;
  }
</style>

<script>
  export default {
    mounted(){
      //获取店铺列表
      this.axios.post('/api/shop/list', JSON.stringify({
        param: {
          key: ''
        }
      })).then((response) => {
        if (response.data.code == 0) {
          this.shopData = response.data.result.model;
        }
      }).catch((error) => {
        console.log(error)
      })
      //获取分类列表
      this.axios.get('/api/item/tag/list').then((response) => {
        if (response.data.code == 0) {
          this.tagData = response.data.result.model;
        }
      }).catch((error) => {
        console.log(error)
      })
      this.getList()
    },
    data(){
      return {
        //店铺数据
        shopData: [],
        //分类数据
        tagData: [],
        //数据
        tableData: [],
        //查询条件
        businessId: '',
        categoryId: '',
        status: '',
        key: '',
        //全选
        multipleSelection: [],
        //分页信息设置
        currentPage: 1,
        pageSize: 20,
        pageTotal: 0,
        //加载状态
        loading: true
      }
    },
    methods: {
      //获取默认第一页数据
      queryClick(){
        this.paging(1)
      },
      //获取某页数据
      paging(newIndex){
        this.currentPage = newIndex;
        this.getList()
      },
      //获取特定多少数据
      getSize(size){
        this.pageSize = size;
        this.getList()
      },
      //获取列表数据
      getList(){
        let param = {
          param: {
            businessId: this.businessId,
            categoryId: this.categoryId,
            status: this.status,
            key: this.key
          },
          pager: {
            pageNum: this.currentPage,
            pageSize: this.pageSize
          }
        };
        this.loading = true;
        this.axios.post('/api/item/page', JSON.stringify(param))
          .then((response) => {
            this.loading = false
            if (response.data.code == 0) {
              this.tableData = response.data.result.model;
              this.pageTotal = response.data.result.pager.total;
            } else {
              this.$message.error({
                message: response.data.desc,
                showClose: true
              });
            }
          })
          .catch((error) => {
            this.loading = false
            console.log(error)
          })
      },
      //搜索查询
      searchClick(){
        this.queryClick()
      },
      //分页方法
      handleCurrentChange(index){
        this.paging(index);
      },
      //条数方法
      handleSizeChange(val) {
        this.getSize(val)
      },
      //新增方法
      addLabel(){
        this.$router.push({path: '/newProduct'})
      },
      //全选
      handleSelectionChange(val) {
        let arr = [];
        _.forEach(val, function (item) {
          arr = _.concat(arr, item.id)
        })
        this.multipleSelection = arr;
      },
      //上架操作
      handleUp(row){
        this.axios.put('/api/item/market', JSON.stringify({
          param: {
            ids: [row.id],
            status: 1
          }
        })).then((response) => {
          if (response.data.code == 0) {
            this.$message({
              showClose: true,
              type: 'success',
              message: "商品:  " + row.name + "  被上架!"
            });
            this.getList();
          } else {
            this.$message({
              showClose: true,
              message: response.data.desc,
              type: 'error'
            });
          }
        }).catch(function (error) {
          console.log(error)
        })
      },
      //批量上架操作
      handleUpAll(){
        this.axios.put('/api/item/market', JSON.stringify({
          param: {
            ids: this.multipleSelection,
            status: 1
          }
        })).then((response) => {
          if (response.data.code == 0) {
            this.$message({
              showClose: true,
              type: 'success',
              message: "商品批量上架成功!"
            });
            this.getList();
          } else {
            this.$message({
              showClose: true,
              message: response.data.desc,
              type: 'error'
            });
          }
        }).catch(function (error) {
          console.log(error)
        })
      },
      //下架操作
      handleDown(row){
        this.axios.put('/api/item/market', JSON.stringify({
          param: {
            ids: [row.id],
            status: 0
          }
        })).then((response) => {
          if (response.data.code == 0) {
            this.$message.warning({
              showClose: true,
              message: "商品:  " + row.name + "  被下架!"
            });
            this.getList();
          } else {
            this.$message.error({
              showClose: true,
              message: response.data.desc
            });
          }
        }).catch((error) => {
            console.log(error)
          }
        )
      },
      //批量下架操作
      handleDownAll(){
        this.axios.put('/api/item/market', JSON.stringify({
          param: {
            ids: this.multipleSelection,
            status: 0
          }
        })).then((response) => {
          if (response.data.code == 0) {
            this.$message.warning({
              showClose: true,
              message: "商品批量下架成功!"
            });
            this.getList();
          } else {
            this.$message.error({
              showClose: true,
              message: response.data.desc
            });
          }
        }).catch((error) => {
          console.log(error)
        })
      },
      //编辑方法
      handleEdit(row){
        this.$router.push({
          path: '/editProduct',
          query: {
            id: row.id,
            businessId: this.businessId,
            categoryId: this.categoryId,
            status: this.status,
            key: this.key,
            currentPage: this.currentPage,
            pageSize: this.pageSize
          }
        })
      },
      //删除方法
      handleDelete(row){
        this.$confirm('此操作将删除商品：' + row.name + ', 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.axios.post('/api/item/delete', JSON.stringify({
            param: {
              ids: [row.id]
            }
          })).then((response) => {
            // 删除成功后
            if (response.data.code == 0) {
              this.$message.success({
                showClose: true,
                message: '标签删除成功!'
              });
              this.getList();
            } else {
              this.$message.error({
                showClose: true,
                message: response.data.desc
              });
            }
          }).catch((error) => {
            console.log(error)
          })
        })
      },
      //批量删除方法
      handleDeleteAll(){
        this.$confirm('此操作将批量删除商品, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.axios.post('/api/item/delete', JSON.stringify({
            param: {
              ids: this.multipleSelection
            }
          })).then((response) => {
            // 删除成功后
            if (response.data.code == 0) {
              this.$message.success({
                showClose: true,
                message: '标签批量删除成功!'
              });
              this.getList();
            } else {
              this.$message.error({
                showClose: true,
                message: response.data.desc
              });
            }
          }).catch((error) => {
            console.log(error)
          })
        })
      }
    }
  }
</script>
