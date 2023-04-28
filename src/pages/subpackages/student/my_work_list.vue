<template>
  <view class="other-page u-flex-y ">
   <u-navbar
           title="我的课程"
           @rightClick="rightClick"
           :autoBack="true"
       >
       </u-navbar>
      <u-status-bar></u-status-bar>
     <view class="u-flex navs m20 pt160">
       <u-search placeholder="请输入课程名称" v-model="keyword" @search="refresh" :showAction="false"></u-search>
     </view>
    <view class="content-list m20">
     <view class="list" v-if="tableData.length===0" >
        <noData  @retry="refresh" tipInfo="暂无课程"/>
        <u-loading-page :loading="isloading"></u-loading-page>
       </view>
       <uniList v-else @scrolltolower="scrolltolower" style="height:100%;position: relative;">
         <view
           v-for="(item, index) in tableData"
           :key="index"
         >
         <u-cell
              :title="item.title"
              :label="$u.util.workType[item.type]"
              :isLink="true"
              @click="goCoursePage(item)"
            ></u-cell>
         </view>
         <u-loadmore :status="status" @loadmore="scrolltolower"/>
       </uniList>
    </view>
  </view>
</template>

<script>
  import {  GetSolutions } from '@/api/apis'
export default {
  name:'Student',
   components:{
   },
  data() {
    return {
      tabs:[
        {name:'1'},
        {name:'1'},
        {name:'1'},
        {name:'1'},
      ],
      tableData: [],
      status: 'loadmore',
      triggered: false,
      currentPage: 1,
      pageSize: 15,
      total: 0,
      keyword:''
    };
  },
  mounted(){
    this.loadmore()
  },
  methods: {
    async loadmore() {
      this.status = 'loading';
      const q = { student_id: this.userid,title:this.keyword}
      Object.keys(q).forEach(e => {
        if (q[e] === '' || q[e] === undefined || q[e] === null) {
          delete q[e]
        } else if (typeof q[e] === 'string') {
          const tmp = { '$regex': q[e] }
          q[e] = tmp
        }
      })
      console.log('q', JSON.stringify(q))
      var obj = {
        skip: this.pageSize*(this.currentPage-1),
       limit: this.pageSize,
        query: JSON.stringify(q)
      }
      //
      uni.showLoading({
        title: '加载中'
     });
     GetSolutions(obj).then(res => {
        const { items } = res
        this.tableData.push(...items)
        this.status= 'loadmore'
        if(items.length===0) this.status = 'nomore';
      }).finally(()=>{
        uni.hideLoading()
      })
    },
    refresh(){
      console.log('refresh')
      this.currentPage = 1
      this.tableData = []
      this.loadmore()
    },
    scrolltolower() {
      console.log('scrolltolower')
      this.currentPage++
      this.loadmore()
    },
    goCoursePage(e,type){
      this.$u.util.goCoursePage(e,type)
    }
  },
};
</script>

<style lang="scss" scoped>
.other-page{
  
}
</style>
