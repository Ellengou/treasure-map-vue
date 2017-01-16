<template>
  <div class="wrapper-content">
    <div class="wrapper-box">
      <div class="breadcrumb">
        <el-breadcrumb separator="-">
          <el-breadcrumb-item>首页</el-breadcrumb-item>
          <el-breadcrumb-item>系统管理</el-breadcrumb-item>
          <el-breadcrumb-item>{{$route.meta.title}}</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="display">
        <div class="display-button">
          <el-button type="info" icon="plus" @click="addGroup">新增用户</el-button>
          <div class="pull-right ml10">
            <div class="pull-left">
              <el-select v-model="roleIds" placeholder="角色组" style="width: 150px;">
                <el-option
                  label="全部"
                  value="-1" style="color: #98b1d0;" v-if="roleData.length">
                </el-option>
                <el-option
                  v-for="item in roleData"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </div>
            <div class="pull-left ml10">
              <el-select v-model="status" placeholder="状态" style="width: 100px;">
                <el-option label="全部" value="-1" style="color: #98b1d0;"></el-option>
                <el-option label="禁止" value="0"></el-option>
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
            resizable="false"
            border
            style="width: 100%">
            <el-table-column
              prop="username"
              label="用户名"
              min-width="300">
            </el-table-column>
            <el-table-column
              prop="roleName"
              label="角色组"
              min-width="300">
            </el-table-column>
            <el-table-column
              label="状态"
              min-width="100">
              <template scope="scope">
                <p :class="{ lock: !scope.row.enable }" style="margin-bottom: 0;">{{ scope.row.enable ? '正常':'禁止' }}</p>
              </template>
            </el-table-column>
            <el-table-column
              label="操作"
              min-width="200">
              <template scope="scope">
                <el-button
                  type="success"
                  size="small"
                  @click="handleOpen(scope.row)" v-if="!scope.row.enable">开启
                </el-button>
                <el-button
                  type="warning"
                  size="small"
                  @click="handleForbid(scope.row)" v-else>禁用
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
                  @click="handleReset(scope.row)">重置密码
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
  .lock {
    color: #ff0000;
  }

  .ml10 {
    margin-left: 10px;
  }
</style>

<script>
  export default {
    mounted(){
      //获取角色列表
      this.axios.get('/api/basic/roles').then((response) => {
        if (response.data.code == 0) {
          this.roleData = response.data.result.model;
        }
      }).catch((error) => {
        console.log(error)
      })
      this.getList()
    },
    data(){
      return {
        //数据
        tableData: [],
        //角色组列表
        roleData: [],
        //查询条件
        key: '',
        status: '',
        roleIds: '',
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
            roleIds: this.roleIds
          },
          pager: {
            pageNum: this.currentPage,
            pageSize: this.pageSize
          }
        };
        this.loading = true;
        this.axios.post('/api/basic/accounts', JSON.stringify(param))
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
      addGroup(){
        this.$router.push({path: '/newGroup'})
      },
      //账户开启
      handleOpen(row){
        this.axios.put('/api/basic/account/' + row.id + '/disable/1').then((response) => {
          if (response.data.code == 0) {
            this.$message.success({
              showClose: true,
              message: "后台用户:  " + row.username + "  被开启!"
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
        this.axios.put('/api/basic/account/' + row.id + '/disable/0').then((response) => {
          if (response.data.code == 0) {
            this.$message.warning({
              showClose: true,
              message: "后台用户:  " + row.username + "  被禁用!"
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
      handleEdit(row) {
        this.$router.push({path: '/editGroup', query: {id: row.id}})
      },
      //删除方法
      handleDelete(row){
        this.$confirm('此操作将删除后台用户：' + row.username + ', 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.axios.delete('/api/basic/account/' + row.id).then((response) => {
            // 删除成功后
            if (response.data.code == 0) {
              this.$message.success({
                showClose: true,
                message: '后台用户删除成功!'
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
      //密码重置
      handleReset(row){
        this.axios.put('/api/basic/account/' + row.id + '/pwd').then((response) => {
          if (response.data.code == 0) {
            this.$message.success({
              showClose: true,
              message: "后台用户：" + row.username + "，默认密码：jd123456  "
            });
          } else {
            this.$message.error({
              showClose: true,
              message: response.data.desc
            });
          }
        })
      }
    }
  }
</script>
