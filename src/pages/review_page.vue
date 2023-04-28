<template>
  <view class="other-page u-flex-y ">
    <u-navbar title="评价信息" :autoBack="true" ></u-navbar>
    <u-status-bar></u-status-bar>
    <view class="u-flex m20 pt160"></view>
    <view class="content-list mlr30" style="flex: 100 0 auto;border:1px solid #ddd">
      <view v-for="(grade,index) in grade_table" :key="index+'title'">
        <view class="mb10"> <span>{{ index+1 }}. </span> {{ grade.name }}</view>
        <u-radio-group 
        :value="grade.value"
        @change="setvalue($event,index)"
        placement="column">
            <u-radio   :customStyle="{marginBottom: '8px'}" name="95" :label="tablehead.excellent+': '+grade.excellent"></u-radio>
            <u-radio   :customStyle="{marginBottom: '8px'}" name="85" :label="tablehead.good+': '+grade.good"></u-radio>
            <u-radio   :customStyle="{marginBottom: '8px'}" name="75" :label="tablehead.pass+': '+grade.pass"></u-radio>
            <u-radio   :customStyle="{marginBottom: '8px'}" name="55" :label="tablehead.flunk+': '+ grade.flunk"></u-radio>
        </u-radio-group>
      </view>
       <view>评价信息</view>
        <view style="border: 1px solid #ccc;">
          <u-textarea v-model="remark.note" placeholder="请输入评价" ></u-textarea>
        </view>
        <view style="height:200rpx"></view>
   </view>

   <view class="u-flex u-flex-center" v-if="workid" style="position:fixed;bottom:20rpx;width:100%">
     <view style="width:200px">
       <u-button   type="primary" @click="submitForm('ruleForm')" text="保存"></u-button>
     </view>
   </view>
 </view>
</template>

<script>
import { CreateEvaluateInfo, UpdateEvaluateInfo, GetHomeWork,GetEvaluateInfos } from '@/api/apis'
export default {
 name: 'Course',
 data() {
   return {
     courseid: '',
     workid:'',
     reviewid: '',
     workInfo: {},
     search: '',
     dialogVisible: false,
     remark:{},
     tablehead: {
        name: '动作',
        excellent: '优秀',
        good: '良好',
        pass: '及格',
        flunk: '不及格'
      },
      grade_table: [
        {
          name: '动作1',
          value: '',
          excellent: '',
          good: '',
          pass: '',
          flunk: ''
        }
      ],
      grade_val: [
        {
          name: '',
          excellent: ''
        }
      ],
   }
 },
 onLoad(e) {
   console.log('params', e)
   const { courseid,workid ,reviewid} = e
   this.courseid = courseid
   this.workid  = workid
   this.reviewid = reviewid
   console.log('workid', workid)
 },
 mounted() {
   this.getWork()
 },
 beforeDestroy() {
 },
 methods: {
   getWork() {
    if(!this.courseid){
      console.warn('work id is empty')
      return
    }
     const obj = { id: this.courseid }
     GetHomeWork(obj).then(res => {
        this.grade_table = res.sport_item.Evaluates || []
        this.grade_table =  this.grade_table.map((e) => ({ ...e, value: '' }))
         console.log('课程信息:',res)
   this.getReview()
     })
   },
   setvalue(e,i){
    this.grade_table[i].value = e
   },
   getReview(){
    if(!this.reviewid){
      return 
    }
    var obj = {
        skip: 0 ,
        limit: 0,
        query: JSON.stringify({ id: this.reviewid })
      }
      GetEvaluateInfos(obj).then(res => {
      console.log('GetEvaluateInfos',res)
        const { items } = res
        if(items.length){
          this.remark = items[0]
          items[0].Evaluates.forEach((e,i)=>{
            this.grade_table[i].value = e.excellent
          })
        }
      })
   },
   handleClose() {
    this.dialogVisible = false
   },
   submitForm() {
      var obj = {
        name: this.username,
        home_work_id: this.courseid,
        solution_id: this.workid,
        user_id: this.userid,
        Evaluates:this.grade_table.map((e) => ({ name:e.name, excellent: e.value })),
        note: this.remark.note
      }
        if (this.reviewid) {
          UpdateEvaluateInfo({ work_id: this.courseid, id: this.reviewid, body: obj }).then(
            res => {
              uni.showModal({
                title: '提示',
                content: '提交成功',
                success: function (res) {
                  if (res.confirm) {
                    console.log('用户点击确定');
                  } else if (res.cancel) {
                    console.log('用户点击取消');
                  }
                }
              })              
            }
          )
        } else {
          obj.id =this.$u.guid()
          CreateEvaluateInfo({ work_id: this.courseid, body: obj }).then(
            res => {
              uni.showModal({
                title: '提示',
                content: '提交成功',
                success: function (res) {
                  if (res.confirm) {
                    console.log('用户点击确定');
                  } else if (res.cancel) {
                    console.log('用户点击取消');
                  }
                }
              })
            }
          )
        }

   },
   resetForm(formName) {
     this.$refs[formName].resetFields()
   }
 }
}
</script>
<style lang="scss" scoped>
 
 .other-page{
    overflow: auto;
  }
</style>