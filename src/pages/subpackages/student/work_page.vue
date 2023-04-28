<template>
  <view class="other-page u-flex-y ">
    <u-navbar title="上传作业:" :autoBack="true" >
      <view class="u-nav-slot" slot="right" v-if="roles.includes('student')">
          <u-icon name="plus" size="19"></u-icon>
      </view>
    </u-navbar>
    <u-status-bar></u-status-bar>
    <view class="u-flex pt160">
     <!-- <u-search placeholder="请输入课程名称" v-model="keyword" @search="refresh" :showAction="false"></u-search> -->
   </view>
   <view class="content-list mlr30" style="flex: 100 0 auto;border:1px solid #ddd">
       <h2 style="text-align:center">{{ ruleForm.title }}</h2>
    <u-form ref="ruleForm" :model="ruleForm"  label-width="100px" labelPosition="top" >
  
       <u-form-item label="视频:" prop="content">
         <view class="mt10" v-for="(item,index) in videoList" :key="item.url">
          <video  :src="item.url"  controls></video>
          <u-button type="error" @click="delVideo(index)">删除</u-button>
        </view>
      </u-form-item>
      <view class="u-flex u-flex-end">
        <u-button type="primary" @click="openVideo">上传</u-button>
        <u-button type="success" @click="showConfirm = true">提 交</u-button>
       </view>
     </u-form>
   </view>
   <u-modal
    :show="showConfirm"
    @cancel="showConfirm = false"
    @close="showConfirm = false"
    @confirm="submitForm()"
  >
    <view class="slot-content">
      <text>确认保存？</text>
    </view>
  </u-modal>
 </view>
</template>

<script>
import { GetHomeWork, UpdateSolution, GetSolution } from '@/api/apis'
export default {
 name: 'Course',
 data() {
   return {
     courseid: '',
     workid: '',
     workInfo: {},
     search: '',
     ruleForm: { 
       userid: '',
       username: '',
       course_title: '', // 课程标题
       files: [], // 附件列表
       note: '', // 评价
       score: '', // 打分
       type: '', // leixing
       content: '' // 课程内容  html 格式
     },
     showConfirm:false,
     videoList:[]
   }
 },
 onLoad(e) {
   console.log('params', e)
   const {  workid } = e
   this.workid = workid
   console.log('workid', workid)
 },
 onShow(){
  this.getWork()
 },
 methods: {
   delVideo(i){
      uni.showModal({
        title: '提示',
        content: '你确定要删除吗',
        success:  (res)=> {
          if (res.confirm) {
            this.videoList.splice(i,1)
            this.submitForm()
          }
        }
      });
   },
   getCourse() {
    if(!this.courseid){
      console.warn('course id is empty')
      return
    }
     var obj = {
       id: this.courseid
     }
     GetHomeWork(obj).then(res => {
       this.workInfo = res
       console.log('GetHomeWork', this.workInfo)
     })
   },
   getWork() {
    if(!this.workid){
      console.warn('work id is empty')
      return
    }
     const obj = { id: this.workid }
     GetSolution(obj).then(res => {
      console.log('GetSolution',res)
      if(res.content){
        this.videoList = JSON.parse(res.content)
      }
       this.ruleForm = res
     })
   },
   submitForm() {
     const obj = Object.assign({}, this.ruleForm)
     obj.content = JSON.stringify(this.videoList)
    obj.commit_time = new Date().getTime()
    obj.desc = '1'
     delete obj.id
    UpdateSolution({ id: this.ruleForm.id, body: obj }).then(
      res => {
        uni.showToast({title:'保存成功'})
      })
   },
   openVideo(){
    uni.navigateTo({url:`/pages/subpackages/student/record_video?id=${this.workid}`})
   }
 }
}
</script>
<style lang="scss" scoped>
 .other-page{
    overflow: auto;
    .content-list{
      padding:20rpx;
    }
  }
</style>