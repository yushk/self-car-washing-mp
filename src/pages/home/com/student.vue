<template>
  <view class="student u-flex-y ">
    <!-- <view class="u-flex navs">
      <view class="item" v-for="(item,index) in tabs">
        {{item.name}}
      </view>
    </view> -->
    <uCard class="m20" title="课程中心" @openRight="go('/pages/subpackages/student/course_list')">
      <template #body>
        <view class="list" v-if="tableData.length===0" style="height:500rpx">
         <noData  @retry="getCourseList" tipInfo="暂无课程"/>
         <u-loading-page :loading="isloading"></u-loading-page>
        </view>
        <uniList v-else  style="height:500rpx">
          <view
            v-for="(item, index) in tableData"
            :key="index"
          >
          <!-- <uItem :title="item.course_title" :desc="item.desc" auther="xxx" :time="$u.timeFormat(item.create)"></uItem> -->

            <u-cell
              :title="item.title"
              :label="$u.util.controlSize(item.desc,30)"
              :isLink="true"
              @click="goCoursePage(item,'course')"
            ></u-cell>
			    </view>
        </uniList>
      </template>
    </uCard>
    <uCard class="m20" title="我的课程" @openRight="go('/pages/subpackages/student/my_course_list')">
      <template #body>
        <view class="list" v-if="myCourseData.length===0" style="height:500rpx">
         <noData  @retry="getMyCourse" tipInfo="暂无课程"/>
         <u-loading-page :loading="isloading"></u-loading-page>
        </view>
        <uniList v-else  style="height:500rpx;">
          <!-- <view class="u-flex u-flex-wrap" > -->
          <view
            v-for="(item, index) in myCourseData"
            :key="index"
          >

          <!-- <uItem :title="item.course_title" :desc="item.desc" auther="" :time="$u.timeFormat(item.create)"></uItem> -->
          <!-- :label="$u.util.controlSize(item.desc,30)" -->
            <u-cell
              :title="item.title"
              :label="$u.util.workType[item.type]"
              :isLink="true"
              @click="goCoursePage(item)"
            ></u-cell>
			    </view>
        <!-- </view> -->

        </uniList>
      </template>
    </uCard>
  </view>
</template>

<script>
  import {  GetHomeWorks, GetSolutions } from '@/api/apis'
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
      myCourseData: [],
      triggered: false,
      currentPage: 1,
      pageSize: 15,
      total: 0,
      isloading:false
    };
  },
  mounted(){
    this.init()
  },
  methods: {
    goCoursePage(e,type){
      console.log('item',e)
      if(type==='course'){
        uni.navigateTo({
          url:`/pages/subpackages/student/course_page?courseid=${e.id}`
        })
      }else{
        uni.navigateTo({
          url:`/pages/subpackages/student/course_page?courseid=${e.work_id}&workid=${e.id}`
        })
      }
    },
    go(url){
      console.log('navigateto',url)
      uni.navigateTo({url})
    },
    async getCourseList() {
      var obj = {
        skip: 0,
        limit: 10,
        query: JSON.stringify({})
      }
      //
      GetHomeWorks(obj).then(res => {
        const { items, total_count } = res
        console.log('GetHomeWorks',items)
        this.tableData = []
        this.tableData=items 
        this.total = total_count
        this.triggered= false
       
      }).finally(()=>{
        this.isloading  = false
        this.triggered= false
      })
    },
    getMyCourse() {
      const q = Object.assign({ student_id: this.userid })
      var obj = {
        skip: 0,
        limit: 10,
        query: JSON.stringify(q)
      }
      GetSolutions(obj).then(res => {
        const { items } = res
        console.log('GetSolutions',items)
        this.myCourseData = items
        
      })
    },
    init(){
      console.log('init')
      this.getMyCourse()
      this.getCourseList()
    }
  },
};
</script>

<style lang="scss" scoped>
.student{
  height: 100%;
  .navs{
    text-align:center;
    font-size: 36rpx;
    .item{
      // border:1px solid #000;
      width: 25%;
    }
  }
  
}
</style>
