<template>
   <view class="other-page u-flex-y ">
    <u-navbar title="课程中心" :autoBack="true"> </u-navbar>
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
            @click="go(item)"
          >
            <u-cell
              :title="item.title"
              :label="item.desc"
              :isLink="true"
            ></u-cell>
			    </view>
        </uniList>
     </view>
   </view>
 </template>
 
 <script>
   import { CreateWork, GetHomeWorks, GetWorks } from '@/api/apis'
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
       const q = Object.assign({ }, { title:{$regex:this.keyword} })
       // 过滤已报名的课程 end
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
      GetHomeWorks(obj).then(res => {
         const { items } = res
         if(items.length>0){
           console.log('GetHomeWorks items:',items)
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
    go(e){
      uni.navigateTo({
        url:`/pages/subpackages/course_page?courseid=${e.id}`
      })
    },
     join(e) {
       this.$confirm('确认立即参加？')
         .then(_ => {
           const obj = {
             userid: this.userid,
             course: e.id,
             username: this.$store.state.user.name,
             type: 0,
             course_title: e.title,
             course_creater: e.username,
             teacherid: e.userid
           }
           CreateWork({ body: obj }).then(res => {
             this.$message.success('报名成功')
             this.$router.push('/my_course')
             this.query()
           })
         })
         .catch(_ => {})
     }
   },
 };
 </script>
 
 <style lang="scss" scoped>
 .other-page{
   
 }
 </style>
 