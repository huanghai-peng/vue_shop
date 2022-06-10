<template>
  <div class="home">
    <el-container style="height: 100%;">
      <el-header class="home-hd">
        <div class="home-hd-logo">
          <img src="~assets/img/heima.png"
               alt="">
          <span>电商后台管理系统</span>
        </div>
        <el-button type="info"
                   style="margin-right: 15px;" @click="quitClick">退出</el-button>
      </el-header>
      <el-container style="height: 100%;">
        <el-aside :width="avtive?'200px':'64px'"
                  class="home-aside">
          <div class="fold" @click="foldClick">| | |</div>
          <el-menu background-color="#333744"
                   text-color="#fff" :collapse="!avtive" :collapse-transition="false" unique-opened router>

            <el-submenu :index="item.id + ''"
                        v-for="item in menuData"
                        :key="item.id">
              <template slot="title"><i :class="iconList[item.id]"></i> <span>{{item.authName}}</span></template>
              <el-menu-item :index="'/' + v.path"
                            v-for="v in item.children"
                            :key="v.id"><i class="el-icon-menu"></i><span>{{v.authName}}</span></el-menu-item>
            </el-submenu>

          </el-menu>
        </el-aside>
        <el-main>
            <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script>
import { getMenuData } from 'network/home'
export default {
  data() {
    return {
      menuData: [],
      iconList: {
        125: 'iconfont icon-yonghuguanli',
        103: 'iconfont icon-shangpinguanli',
        101: 'iconfont icon-dingdanguanli',
        102: 'iconfont icon-quanxianguanli',
        145: 'iconfont icon-shujutongji',
      },
      avtive:true
    }
  },
  created() {
    // 获取左侧边栏数据
    this.getMenuData()
  },
  methods: {
    async getMenuData() {
      const res = await getMenuData()
      if (res.meta.status !== 200) {
        return this.$message({
          message: res.meta.msg,
          type: 'error',
        })
      }

      this.menuData = res.data
    },
    foldClick(){
        this.avtive = !this.avtive;
    },
    quitClick(){
        this.$router.push('/login');
    }
  },
}
</script>
<style lang="scss" scoped>
.home {
  height: 100%;
  .home-hd {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #373d41;
    padding: 0;
    height: 60px;

    .home-hd-logo {
      display: flex;
      align-items: center;
      font-size: 18px;
      color: #fff;

      span {
        margin-left: 15px;
      }
    }
  }

  .home-aside {
    background-color: #333744;
    .fold {
      height: 24px;
      line-height: 24px;
      text-align: center;
      color: #fff;
      font-size: 12px;
    }
    .el-menu {
        border-right: 0;
    }
  }

  .el-main {
      background-color: #EAEDF1;
  }
}
</style>