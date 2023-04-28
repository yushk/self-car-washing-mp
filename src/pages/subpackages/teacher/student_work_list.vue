<template>
   <view class="other-page u-flex-y ">
    <u-navbar title="学生作业" :autoBack="true"> </u-navbar>
    <u-status-bar></u-status-bar>
     <view class="u-flex navs m20 pt160">
       <u-search placeholder="请输入课程名称" v-model="keyword" @search="refresh" :showAction="false"></u-search>
     </view>
     <view class="content-list  mlr30">
      <view class="list" v-if="tableData.length===0" >
         <noData  @retry="refresh" tipInfo="暂无作业"/>
        </view>
        <uniList v-else @scrolltolower="scrolltolower" style="height:100%;position: relative;">
          <view v-for="(item, index) in tableData"
            :key="index"
          >
          <u-cell
              :title="item.title"
              :label="$u.util.parseTime(item.commit_time)"
              :isLink="true"
              @click="goCoursePage(item,'work')"
            >
            <view  slot="value" class="u-flex ft14">
              <view>{{item.student_name}}</view>
            </view>
          </u-cell>
          </view>
        </uniList>
     </view>
   </view>
 </template>
 
 <script>
   import { CreateWork,  GetSolutions } from '@/api/apis'
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
    goCoursePage(e,type){
      console.log('item',e)
      if(type==='course'){
        uni.navigateTo({
          url:`/pages/subpackages/teacher/course_page?courseid=${e.id}`
        })
      }else{
        uni.navigateTo({
          url:`/pages/subpackages/teacher/student_work_page?courseid=${e.course}&workid=${e.id}`
        })
      }
    },
     async loadmore() {

      var query = Object.assign({}, { title: this.keyword,desc:'1'})
      console.log('query', query)
      // 管理员可以查看全部
      var q = { teachers: { $in: [this.userid] }}
      if (this.roles.includes('root')) {
        delete q.teachers
      }
      Object.keys(query).forEach(e => {
        if (query[e] instanceof Array) {
          if (query[e].length > 0) {
            const arr = query[e].map((item) => {
              const o = {}
              o[e] = item
              return o
            })
            if (q['$and']) {
              q['$and'].push({ '$or': arr })
            } else {
              q['$and'] = [{ '$or': arr }]
            }
          }
        } else {
          if (query[e]) {
            q[e] = query[e]
          }
        }
      })

       var obj = {
         skip: this.pageSize*(this.currentPage-1),
        limit: this.pageSize,
         query: JSON.stringify(q)
       }
       uni.showLoading({
         title: '加载中'
      });
      GetSolutions(obj).then(res => {
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
 