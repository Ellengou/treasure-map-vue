<script src="../../../run/config/index.js"></script>
<template>
  <div class="wrapper-content">
    <div class="wrapper-box">
      <div class="breadcrumb">
        <span class="pull-right el-breadcrumb back" v-if="$route.query.id" @click="$router.go(-1)">返回上一级</span>
        <el-breadcrumb separator="-">
          <el-breadcrumb-item>首页</el-breadcrumb-item>
          <el-breadcrumb-item>商户管理</el-breadcrumb-item>
          <el-breadcrumb-item>{{$route.meta.title}}</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="display">
        <div class="display-button">
          <el-button type="info" icon="plus" @click="addShop">新增店铺</el-button>
          <div class="pull-right ml10">
            <div class="pull-left">
              <el-select v-model="provinceCode" placeholder="省" style="width: 150px;" @change="provinceChange">
                <el-option
                  label="全部"
                  value="-1" style="color: #98b1d0;" v-if="provinceData.length">
                </el-option>
                <el-option
                  v-for="item in provinceData"
                  :label="item.name"
                  :value="item.code">
                </el-option>
              </el-select>
            </div>
            <div class="pull-left ml10" v-if="!isCity">
              <el-select v-model="citysCode" placeholder="市" style="width: 150px;" @change="cityChange">
                <el-option
                  v-for="item in cityData"
                  :label="item.name"
                  :value="item.code">
                </el-option>
              </el-select>
            </div>
            <div class="pull-left ml10">
              <el-select v-model="curioCityId" placeholder="古玩城" style="width: 100px;">
                <el-option label="全部" value="-1" style="color: #98b1d0;"></el-option>
                <el-option
                  v-for="item in curioData"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </div>
            <div class="pull-left ml10">
              <el-select v-model="tagId" placeholder="标签" style="width: 100px;">
                <el-option label="全部" value="-1" style="color: #98b1d0;"></el-option>
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
                <el-option label="待审核" value="0"></el-option>
                <el-option label="关闭" value="4"></el-option>
                <el-option label="正常" value="1"></el-option>
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
            style="width: 100%">
            <el-table-column
              prop="name"
              label="店铺名称"
              min-width="90">
            </el-table-column>
            <el-table-column
              prop="province"
              label="省"
              min-width="50">
            </el-table-column>
            <el-table-column
              prop="city"
              label="市"
              min-width="50">
            </el-table-column>
            <el-table-column
              prop="curioCityName"
              label="所属古玩城"
              min-width="90">
            </el-table-column>
            <el-table-column
              prop="address"
              label="地址"
              min-width="100">
            </el-table-column>
            <el-table-column
              prop="contact"
              label="联系方式"
              min-width="70">
            </el-table-column>
            <el-table-column
              label="标签"
              min-width="110">
              <template scope="scope">
                {{ scope.row.tagsName?scope.row.tagsName.replace(/,/g, '、'):'' }}
              </template>
            </el-table-column>
            <el-table-column
              prop="storedNumer"
              label="访问量"
              min-width="50">
            </el-table-column>
            <el-table-column
              prop="viewedNumber"
              label="关注数"
              min-width="50">
            </el-table-column>
            <el-table-column
              label="状态"
              min-width="50">
              <template scope="scope">
                <div :class="{checkName:scope.row.status==0}" v-if="scope.row.status==0">待审核</div>
                <div v-if="scope.row.status==1">正常</div>
                <div :class="{closeName:scope.row.status==4}" v-if="scope.row.status==4">关闭</div>
              </template>
            </el-table-column>
            <el-table-column
              label="操作"
              min-width="140">
              <template scope="scope">
                <el-button
                  type="success"
                  size="small"
                  @click="handleCheck(scope.row)" v-if="scope.row.status==0">审核
                </el-button>
                <el-button
                  type="success"
                  size="small"
                  @click="handleOpen(scope.row)" v-if="scope.row.status==4">开启
                </el-button>
                <el-button
                  type="warning"
                  size="small"
                  @click="handleClose(scope.row)" v-if="scope.row.status==1">关闭
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
                <el-button
                  size="small"
                  :plain="true"
                  type="warning"
                  @click="$router.push({ name: 'shop', query: { id: scope.row.id }})">商品
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

  .closeName {
    color: #999999;
  }

  .checkName {
    color: #ff0000;
  }
</style>

<script>
  export default {
    mounted(){
      //获取省
      this.axios.get('/api/city').then((response) => {
        if (response.data.code == 0) {
          this.provinceData = response.data.result.model;
        }
      }).catch((error) => {
        console.log(error)
      })
      //古玩城数组
      this.axios.post('/api/curio/list', JSON.stringify({
        param: {
          key: ''
        }
      })).then((response) => {
        if (response.data.code == 0) {
          this.curioData = response.data.result.model;
        }
      }).catch((error) => {
        console.log(error)
      })
      //标签数组
      this.axios.post('/api/basic/tag/list', JSON.stringify({
        param: {
          key: ''
        }
      })).then((response) => {
        if (response.data.code == 0) {
          this.tagData = response.data.result.model;
        }
      }).catch((error) => {
        console.log(error)
      })
      let id = this.$route.query.id;
      if (id) {
        this.id = id
      }
      this.getList()
    },
    data(){
      return {
        //ID查询
        id: '',
        //省数据
        provinceCode: '',
        provinceData: [],
        //市数据
        citysCode: '',
        cityData: [],
        //是否直辖市
        isCity: true,
        //古玩城数据
        curioData: [],
        //标签数据
        tagData: [],
        //数据
        tableData: [],
        //查询条件
        cityCode: '',
        curioCityId: '',
        tagId: '',
        status: '',
        key: '',
        //分页信息设置
        currentPage: 1,
        pageSize: 20,
        pageTotal: 0,
        //加载状态
        loading: true
      }
    },
    watch: {
      '$route' (to, from){
        this.cityCode = '';
        this.curioCityId = '';
        this.tagId = '';
        this.status = '';
        this.key = '';
        this.currentPage = 1;
        this.pageSize = 20;
        this.getList()
      }
    },
    methods: {
      provinceChange(val){
        let arr = [-1, 11, 12, 21, 31, 50, 71, 82].filter((item) => {
          return item == val
        });
        this.cityCode = val;
        if (arr.length) {
          this.isCity = true;
        } else {
          this.isCity = false;
          this.citysCode = '';
          this.axios.get('/api/city/' + val + '/level/2').then((response) => {
            if (response.data.code == 0) {
              this.cityData = response.data.result.model;
            }
          }).catch((error) => {
            console.log(error)
          })
        }
      },
      cityChange(val){
        if (val) {
          console.log(val)
          this.cityCode = val
        }
      },
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
            cityCode: this.cityCode,
            curioCityId: this.curioCityId,
            tagId: this.tagId,
            status: this.status,
            key: this.key
          },
          pager: {
            pageNum: this.currentPage,
            pageSize: this.pageSize
          }
        };
        this.loading = true;
        this.axios.post('/api/shop/page', JSON.stringify(param))
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
      handleSizeChange(val){
        this.getSize(val)
      },
      //新增方法
      addShop(){
        this.$router.push({path: '/newShop'})
      },
      //审核方法
      handleCheck(row){
        this.$confirm('此操作将审核通过店铺：' + row.name + ', 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.axios.put('/api/shop/' + row.id + '/enable/1').then((response) => {
            // 删除成功后
            if (response.data.code == 0) {
              this.$message.success({
                showClose: true,
                message: '店铺审核成功!'
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
      //开启操作
      handleOpen(row){
        this.axios.put('/api/shop/' + row.id + '/enable/1').then((response) => {
          if (response.data.code == 0) {
            this.$message({
              showClose: true,
              type: 'success',
              message: "店铺:  " + row.name + "  被开启!"
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
      handleClose(row){
        this.axios.put('/api/shop/' + row.id + '/enable/4').then((response) => {
          if (response.data.code == 0) {
            this.$message.warning({
              showClose: true,
              message: "店铺:  " + row.name + "  被关闭!"
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
      //编辑方法
      handleEdit(row){
        this.$router.push({path: '/editShop', query: {id: row.id,}})
      },
      //删除方法
      handleDelete(row){
        this.$confirm('此操作将删除店铺：' + row.name + ', 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.axios.delete('/api/shop/delete/' + row.id).then((response) => {
            // 删除成功后
            if (response.data.code == 0) {
              this.$message.success({
                showClose: true,
                message: '店铺删除成功!'
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
