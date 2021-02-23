<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户隐私</el-breadcrumb-item>
      <el-breadcrumb-item>相册</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 搜索 添加 -->
      <el-row :gutter="100">
        <el-col :span="12">
          <el-input placeholder="输入用户手机号搜索" v-model="queryInfo.query" clearable @clear="getPhoto">
            <el-button slot="append" icon="el-icon-search" @click="getPhoto"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <!-- 用户列表区域 -->
      <el-table :data="Photolist" border stripe>
        <!-- stripe: 斑马条纹
              border：边框-->
        <el-table-column align="center" sortable type="index" label="#"></el-table-column>
        <el-table-column align="center" sortable prop="owner" label="用户"></el-table-column>
        <el-table-column sortable label="相册" width="120" align="center">
          <template slot-scope="scope">
            <img style="height: 80px;width: 90px" :src="'data:image/jpg;base64,'+scope.row.photo" :fit="fit">
          </template>
        </el-table-column>
        <el-table-column align="center" sortable prop="name" label="图片名字"></el-table-column>
        <el-table-column align="center" sortable prop="time" label="创建时间"></el-table-column>
        






        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="danger" icon="el-icon-delete" size="mini" circle @click="removePhotoById(scope.row.id)"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryInfo.pageNum"
        :page-sizes="[5, 10, 15]" :page-size="queryInfo.pageSize" layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>

    </el-card>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        fit: 'contain',
        queryInfo: {
          query: '',
          // 当前页数
          pageNum: 1,
          // 每页显示多少数据
          pageSize: 5
        },
        Photolist: [],
        total: 0,

      }
    },

    created() {
      this.getPhoto()
    },

    methods: {
      async getPhoto() {
        const {
          data: res
        } = await this.$http.get('photo', {
          params: this.queryInfo
        })

        if (res.status !== 200) {
          return this.$message.error('获取用户相册失败！')
        }
        this.Photolist = res.uphotoEntityList;
        this.total = res.total;
      },
      // 监听 pagesize改变的事件
      handleSizeChange(newSize) {
        this.queryInfo.pageSize = newSize
        this.getPhoto()
      },
      // 监听 页码值 改变事件
      handleCurrentChange(newSize) {
        this.queryInfo.pageNum = newSize
        this.getPhoto()
      },

      // 删除
      async removePhotoById(id) {
        var pagenum = this.queryInfo.pageNum;
        var pagesize = this.queryInfo.pageSize;
        var total = this.total;
        if (((pagenum - 1) * pagesize == this.total - 1)&&this.total!=1) {
          this.queryInfo.pageNum = pagenum - 1;
        }
        const confirmResult = await this.$confirm(
          '删除后不可恢复, 是否继续?',
          '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }
        ).catch(err => err)
        // 点击确定 返回值为：confirm
        // 点击取消 返回值为： cancel
        if (confirmResult !== 'confirm') {
          return this.$message.info('已取消删除')
        }
        const {
          data: res
        } = await this.$http.delete('deletePhoto/' + id)
        if (res !== 200) return this.$message.error('删除失败！')
        this.$message.success('删除成功！')
        this.getPhoto()
      },
    },
  }
</script>

<style lang="less" scoped>
</style>
