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
          <el-button type="info" icon="plus" @click="addLabel">新增分类</el-button>
          <div class="pull-right ml10">
            <div class="pull-left ml10" style="width: 300px;">
              <el-input v-model.trim="key" placeholder="分类名称">
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
              label="分类名称"
              min-width="700">
            </el-table-column>
            <el-table-column
              label="操作"
              min-width="200">
              <template scope="scope">
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
</style>

<script>
  export default {
    mounted(){
      this.getList()
    },
    data(){
      return {
        //数据
        tableData: [],
        //查询条件
        key: '',
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
            key: this.key
          },
          pager: {
            pageNum: this.currentPage,
            pageSize: this.pageSize
          }
        };
        this.loading = true;
        this.axios.post('/api/item/tag/page', JSON.stringify(param))
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
          }).catch((error) => {
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
        this.$router.push({path: '/newSort'})
      },
      //编辑方法
      handleEdit(row){
        this.$router.push({path: '/editSort', query: {id: row.id, name: row.name}})
      },
      //删除方法
      handleDelete(row){
        this.$confirm('此操作将删除分类：' + row.name + ', 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.axios.delete('/api/item/tag/delete/' + row.id).then((response) => {
            // 删除成功后
            if (response.data.code == 0) {
              this.$message.success({
                showClose: true,
                message: '分类删除成功!'
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
