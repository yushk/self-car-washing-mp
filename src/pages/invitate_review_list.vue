<!-- 我的待评价列表 -->
<template>
    <view class="other-page u-flex-y ">
     <u-navbar title="我的评论" :autoBack="true"> </u-navbar>
     <u-status-bar></u-status-bar>
      <view class="u-flex navs m20 pt160">
        <u-search placeholder="请输入课程名称" v-model="keyword" @search="refresh" :showAction="false"></u-search>
      </view>
      <view class="content-list  mlr30">
       <view class="list" v-if="tableData.length===0" >
          <noData  @retry="refresh" tipInfo="暂无评论"/>
         </view>
         <uniList v-else @scrolltolower="scrolltolower" style="height:100%;position: relative;">
           <view
             v-for="(item, index) in tableData"
             :key="index"
           >
           <u-cell
              :title="item.course_title"
              :label="$u.util.workType[item.mystatus]"
              :value="item.myscore"
              :isLink="true"
              @click="goCoursePage(item)"
            ></u-cell>
           </view>
         </uniList>
      </view>
    </view>
  </template>
  
  <script>
    import { CreateWork, GetCourses, GetEvaluateInfos } from '@/api/apis'
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
      const q = Object.assign({ user_id: this.userid},{ title: this.keyword})
      Object.keys(q).forEach(e => {
        if (q[e] === '' || q[e] === undefined || q[e] === null) {
          delete q[e]
        }
      })
        var obj = {
          skip: this.pageSize*(this.currentPage-1),
         limit: this.pageSize,
          query: JSON.stringify(q)
        }
        //
        uni.showLoading({
          title: '加载中'
       });
       GetEvaluateInfos(obj).then(res => {
          var { items } = res
          if(items.length>0){
            items = items.map((e) => {
            const current = e.note_info.find((c) => (c.userid === this.$store.state.user.userid)) || {}
            const mycontent = current.content || ''
            const myscore = current.score || ''
            const myvalue = current.value || ''
            const mystatus = current.status || '0'
            return { ...e, mycontent, myscore, myvalue, mystatus }
          })
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
        uni.navigateTo({
          url:`/pages/review_page?courseid=${e.course}&workid=${e.id}`
        })
      }
    },
  };
  </script>
  
  <style lang="scss" scoped>
  .other-page{
    
  }
  </style>
  