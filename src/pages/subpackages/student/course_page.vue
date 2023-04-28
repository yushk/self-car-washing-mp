<template>
    <view class="other-page u-flex-y ">
      <u-navbar title="课程信息" :autoBack="true" ></u-navbar>
      <u-status-bar></u-status-bar>
      <view class="u-flex  pt160">
       <!-- <u-search placeholder="请输入课程名称" v-model="keyword" @search="refresh" :showAction="false"></u-search> -->
     </view>
     <view class="content-list mlr30" >
       <h2 style="text-align:center">{{ courseInfo.title }}</h2>

       <u-parse class="mt10 content" :content="courseInfo.desc"></u-parse>

        <view class="mt10" v-for="(item,index) in courseInfo.sport_item.videos" :key="'video'+index">
         <video :id="'myVideo'+index" :src="item.url" @error="videoErrorCallback"  controls></video>
        </view>
        <view class="mt10" v-for="(item,index) in courseInfo.sport_item.files" :key="index"  @click="openCouseFile(item)">
          <view class="u-flex">
            <u-icon name="file-text" color="#2979ff" size="28"></u-icon>
            <u-text type="primary" :text="item.name"></u-text>
          </view>
        </view>
        <span class="date">{{ $u.util.parseTime(courseInfo.start_time,'{y}年{m}月{d}日') }}——{{ $u.util.parseTime(courseInfo.end_time,'{y}年{m}月{d}日') }}</span>
      </view>
     <view style="height:200rpx"></view>
     <view class="u-flex u-flex-center" v-if="!workInfo.id" style="position:fixed;bottom:30rpx;width:100%">
      <view style="width:200px">
        <u-button v-if="roles.includes('student')"  type="primary" @click="join(courseInfo)">参加课程</u-button>
      </view>
     </view>
     <view class="u-flex u-flex-center" v-else style="position:fixed;bottom:30rpx;width:100%">
      <view style="width:200px">
        <u-button type="primary" v-if="workid" @click="goWork">查看作业</u-button>
      </view>
     </view>
     <mumu-previewOffce v-if="fileUrl" :fileUrl='fileUrl' v-model='showPreview'></mumu-previewOffce>
   </view>
 </template>
 
 <script>
 import { GetHomeWork,  GetSolution,GetSolutions,CreateSolution } from '@/api/apis'
 export default {
   name: 'Course',
  //  components: { Editor, Toolbar },
   data() {
     return {
       courseid: '',
       workid: '',
       courseInfo: {
        sport_item:{}
       },
       search: '',
       dialogVisible: false,
       workInfo: {},
       rules: {
         grade: [
           { required: true, message: '请选择年级', trigger: 'blur' }
         ],
         faculty: [
           { required: true, message: '请输入学院/系', trigger: 'blur' }
         ],
         subject: [
           { required: true, message: '请输入专业', trigger: 'blur' }
         ],
         number: [
           { required: true, message: '请输入班级', trigger: 'blur' }
         ]
       },
       oss: null,
       toolbarConfig: {},
       showConfirm:false,
       editor: null,
       fileUrl:'',
       showPreview:false
     }
   },
   onLoad(e) {
     console.log('params', e)
     const { courseid, workid } = e
     this.courseid = courseid
     if(workid){
       this.workid = workid
      }
     console.log('workid', workid)
     this.query()
     this.getSolutions()
     this.getWork()
   },
   methods: {
    
     query() {
      if(!this.courseid){
        console.warn('course id is empty')
        return
      }
       var obj = {
         id: this.courseid
       }
       GetHomeWork(obj).then(res => {
         this.courseInfo = res
         console.log('GetHomeWork', this.courseInfo)
       })
     },
     getSolutions(){
      var objwork = {
        skip: 0,
        limit: 0,
        query: JSON.stringify({ student_id: this.$store.state.user.userid, work_id: this.courseid })
      }
      GetSolutions(objwork).then(res=>{
        const {items} = res
        if (items && items.length) {
          this.workInfo = items[0]
        }
      })
     },
     getWork() {
      if(!this.workid){
        console.warn('work id is empty')
        return
      }
       const obj = { id: this.workid }
       GetSolution(obj).then(res => {
         this.workInfo = res
         console.log('GetSolution', this.workInfo)
       })
     },
     goWork(url){
      console.log('navigateto',url)
      uni.navigateTo({url:`/pages/subpackages/student/work_page?workid=${this.workid}`})
    },
    join(e) {
      const obj = {
            student_id: this.$store.state.user.userid,
            work_id: e.id,
            student_name: this.$store.state.user.name,
            title: e.title,
            teachers: Array.from(new Set([...e.sport_item.auth_user, ...e.sport_item.auth_user, e.teacher]))
          }
          CreateSolution({ body: obj }).then(res => {
            this.$u.toast('参加成功')
            setTimeout(()=>{
              uni.redirectTo({
                url:`/pages/subpackages/student/course_page?courseid=${e.id}&workid=${res.id}`
              })
            },1000)
          })
    },
    openCouseFile(e){
      this.showPreview = true
      this.fileUrl = e.url
    }
   }
 }
 </script>
 <style lang="scss" scoped>
   @import '@wangeditor/editor/dist/css/style.css';
   
   .other-page{
      overflow: auto;
      height: 100%;
      .content-list{
        min-height: 800rpx;
        flex: 100 0 auto;
        border:1px solid #ddd
      }
    }
 </style>