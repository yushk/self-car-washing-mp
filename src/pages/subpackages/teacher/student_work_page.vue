<template>
  <view class="other-page u-flex-y ">
    <u-navbar title="学生作业:" :autoBack="true" >
      <view class="u-nav-slot" slot="right" v-if="roles.includes('student')">
          <u-icon name="plus" size="19"></u-icon>
      </view>
    </u-navbar>
    <u-status-bar></u-status-bar>
    <view class="u-flex pt160">
   </view>
   <view class="content-list mlr30" style="flex: 100 0 auto;border:1px solid #ddd">
      <h2 style="text-align:center">{{ ruleForm.title }}</h2>
      <u-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="100px" labelPosition="top" >
        <u-form-item label="视频:" prop="content">
          <view class="mt10" v-for="(item,index) in ruleForm.content" :key="'visdedeo'+index">
            <video :id="'myVideo'+index" :src="item.url" @error="videoErrorCallback"  controls></video>
            <div>{{ item.name }}</div>
          </view>
        </u-form-item>
     </u-form>
     <u-divider text="评价列表" :dashed="true"></u-divider>
      <uniList >
         <view
           v-for="(item, index) in remarks"
           :key="index"
         >
           <u-cell
             :title="item.note"
             :label="item.name"
             :isLink="true"
             @click="goReview(item)"
           >
           <view  slot="value" class="u-flex ft14">
             <view>{{item.score}} 分</view>
           </view>
         </u-cell>
         </view>
       </uniList>
      </view>
      <view style="height:100rpx"></view>
   <view class="u-flex u-flex-center"  style="position:fixed;bottom:30rpx;width:100%">
    <view style="width:200px">
      <u-button  type="primary" @click="goReview">添加评价</u-button>
    </view>
   </view>
 </view>
</template>

<script>
import { GetEvaluateInfos, GetSolution } from '@/api/apis'
export default {
 name: 'Course',
 data() {
   return {
     courseid: '',
     workid: '',
     workInfo: {},
     search: '',
     dialogVisible: false,
     ruleForm: { 
       content: '' // 课程内容  html 格式
     },
     remarks:[],
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
  this.getRemarks()
 },
 mounted() {
   this.getWork()
 },
 beforeDestroy() {
 
 },
 methods: {
   getWork() {
    if(!this.workid){
      console.warn('work id is empty')
      return
    }
     const obj = { id: this.workid }
     GetSolution(obj).then(res => {
      console.log('GetSolution',res)
      if(res.content){
        res.content = JSON.parse(res.content)
      }
       this.ruleForm = res
     })
   },
   getRemarks() {
    if(!this.workid){
      console.warn('work id is empty')
      return
    }
      var obj = {
        skip: 0 ,
        limit: 0,
        query: JSON.stringify({ solution_id: this.workid })
      }
      GetEvaluateInfos(obj).then(res => {
      console.log('GetEvaluateInfos',res)
        const { items, total } = res
        this.remarks = items.map((e) => {
          const s = e.Evaluates.reduce(
            (accumulator, currentValue) => (Number(accumulator) + Number(currentValue.excellent)),
            0
          ) / e.Evaluates.length
          return {
            ...e,
            score: Number(s).toFixed(2)
          }
        })
      })
    },
    goReview(e){
      if(!e){
        e = {
          id:''
        }
      }
      uni.navigateTo({url:`/pages/review_page?courseid=${this.ruleForm.work_id}&reviewid=${e.id}&workid=${this.workid}`})
    },
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