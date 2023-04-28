<template>
  <view class="other-page u-flex-y ">
   <u-navbar title="我的课程" :autoBack="true"> </u-navbar>
   <u-status-bar></u-status-bar>
    <view class="u-flex navs m20 pt160">
      <u-search placeholder="请输入课程名称" v-model="keyword" @search="refresh" :showAction="false"></u-search>
    </view>
    <view class="content-list  mlr30">
     <view class="list" v-if="tableData.length===0" >
        <noData  @retry="refresh" tipInfo="暂无课程"/>
       </view>
       <uniList v-else @scrolltolower="scrolltolower" style="height:100%;position: relative;">
         <view
           v-for="(item, index) in tableData"
           :key="index"
         >
         <u-cell
            :title="item.course_title"
            :label="$u.util.workType[item.type]"
            :isLink="true"
            @click="goCoursePage(item)"
          ></u-cell>
         </view>
       </uniList>
    </view>
  </view>
</template>

<script>
  import {  GetWorks } from '@/api/apis'
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
      keyword:'',
      tableData: [],
      triggered: false,
      currentPage: 1,
      pageSize: 15,
      total: 0,
    };
  },
  onLoad(){
    this.loadmore()
  },
  methods: {
    async loadmore() {
      const q = Object.assign({userid: this.userid  }, { title: this.keyword})
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
     GetWorks(obj).then(res => {
        const { items } = res
        if(items.length>0){
          console.log('GetWorks items:',items)
          this.tableData.push(...items)
         }
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
      console.log('item',e)
      if(type==='course'){
        uni.navigateTo({
          url:`/pages/subpackages/student/course_page?courseid=${e.id}`
        })
      }else{
        uni.navigateTo({
          url:`/pages/subpackages/student/course_page?courseid=${e.course}&workid=${e.id}`
        })
      }
    }
  },
};
</script>

<style lang="scss" scoped>
.other-page{
  
}
</style>
