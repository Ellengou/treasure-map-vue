<template>
  <div class="wrapper-content">
    <div class="wrapper-box">
      <div class="breadcrumb">
        <el-breadcrumb separator="-">
          <el-breadcrumb-item>首页</el-breadcrumb-item>
          <el-breadcrumb-item>{{$route.meta.title}}</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="display">
        <div class="display-button">
          <!--<el-button type="info" icon="plus" @click="addUser">新增用户</el-button>-->
          <div class="pull-right ml10">
            <div class="pull-left">
              <el-select v-model="tagId" placeholder="标签" style="width: 150px;">
                <el-option
                  label="全部"
                  value="-1" style="color: #98b1d0;" v-if="labelData.length">
                </el-option>
                <el-option
                  v-for="item in labelData"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </div>
            <div class="pull-left ml10">
              <el-select v-model="status" placeholder="状态" style="width: 100px;">
                <el-option label="全部" value="-1" style="color: #98b1d0;"></el-option>
                <el-option label="封禁" value="0"></el-option>
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
              prop="userName"
              label="用户名"
              min-width="100">
            </el-table-column>
            <el-table-column
              prop="mobile"
              label="注册手机号"
              min-width="100">
            </el-table-column>
            <el-table-column
              label="注册时间"
              min-width="100">
              <template scope="scope">
                <p style="margin-bottom: 0;">{{ scope.row.createdTime }}</p>
              </template>
            </el-table-column>
            <el-table-column
              label="标签"
              min-width="300">
              <template scope="scope">
                <p style="margin-bottom: 0;">{{ scope.row.tagName? scope.row.tagName.replace(/,/g, '、'):'' }}</p>
              </template>
            </el-table-column>
            <el-table-column
              label="状态"
              min-width="100">
              <template scope="scope">
                <p :class="{ lock: scope.row.locked }" style="margin-bottom: 0;">{{ scope.row.locked ? '封禁':'正常' }}</p>
              </template>
            </el-table-column>
            <el-table-column
              label="操作"
              min-width="100">
              <template scope="scope">
                <el-button
                  type="success"
                  size="small"
                  @click="handleOpen(scope.row)" v-if="scope.row.locked">开启
                </el-button>
                <el-button
                  type="warning"
                  size="small"
                  @click="handleForbid(scope.row)" v-else>禁用
                </el-button>
                <!--<el-button-->
                <!--type="info"-->
                <!--size="small"-->
                <!--@click="handleEdit(scope.row)">编辑-->
                <!--</el-button>-->
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
</style>

<script>
  export default {
    mounted(){
      //标签列表
      this.axios.post('/api/basic/tag/list', JSON.stringify({param: {key: ''}})).then((response) => {
        if (response.data.code == 0) {
          this.labelData = response.data.result.model
        } else {
          this.$message.error({
            message: response.data.desc,
            showClose: true
          })
        }
      })
      this.getList()
    },
    data(){
      return {
        //数据
        tableData: [],
        //标签列表
        labelData: [],
        //查询条件
        key: '',
        status: '',
        tagId: '',
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
            key: this.key,
            status: this.status,
            tagId: this.tagId
          },
          pager: {
            pageNum: this.currentPage,
            pageSize: this.pageSize
          }
        };
        this.loading = true;
        this.axios.post('/api/user/page', JSON.stringify(param))
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
      searchClick(){
        this.queryClick()
      },
      //分页方法
      handleCurrentChange(index){
        this.paging(index)
      },
      //条数方法
      handleSizeChange(val) {
        this.getSize(val)
      },
      //新增方法
      addUser(){
        this.$router.push({path: '/newUser'})
      },
      //账户开启
      handleOpen(row){
        this.axios.put('/api/user/' + row.id + '/enable/1').then((response) => {
          if (response.data.code == 0) {
            this.$message.success({
              showClose: true,
              message: "用户:  " + row.userName + "  被开启!"
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
      //账户禁止
      handleForbid(row){
        this.axios.put('/api/user/' + row.id + '/enable/0').then((response) => {
          if (response.data.code == 0) {
            this.$message.warning({
              showClose: true,
              message: "用户:  " + row.userName + "  被禁用!"
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
        this.$router.push({path: '/editUser', query: {id: row.id}})
      },
      //删除方法
      handleDelete(row){
        this.$confirm('此操作将删除用户：' + row.userName + ', 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.axios.delete('/api/user/delete/' + row.id).then((response) => {
            // 删除成功后
            if (response.data.code == 0) {
              this.$message.success({
                showClose: true,
                message: '用户删除成功!'
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
