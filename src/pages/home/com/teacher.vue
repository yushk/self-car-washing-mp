<template>
  <view class="teacher u-flex-y ">
    <!-- <view class="u-flex navs">
      <view class="item" v-for="(item,index) in tabs">
        {{item.name}}
      </view>
    </view> -->
    <uCard class="m20" title="学生作业" @openRight="go('/pages/subpackages/teacher/student_work_list')">
      <template #body>
        <view class="list" v-if="myCourseData.length===0" style="height:500rpx">
         <noData  @retry="getMyCourse" tipInfo="暂无提交"/>
         <u-loading-page :loading="isloading"></u-loading-page>
        </view>
        <uniList v-else  style="height:500rpx">
          <view
            v-for="(item, index) in myCourseData"
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
      </template>
    </uCard>
    <uCard class="m20" title="我的课程" @openRight="go('/pages/subpackages/teacher/my_course_list')">
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
            <u-cell
              :title="item.title"
              :value="'人数：'+item.solutions_info_id.length"
              :isLink="true"
              @click="goCoursePage(item,'course')"
            >
            <span  slot="label" class="date">{{ $u.util.parseTime(item.start_time,'{y}年{m}月{d}日') }}——{{ $u.util.parseTime(item.end_time,'{y}年{m}月{d}日') }}</span>
          </u-cell>
			    </view>
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
      typeOption:{
        0:'未发布',
        2:'未发布',
        1:'已发布'
      },
      workOption:{
        0:'未提交',
        1:'已提交'
      },
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
          url:`/pages/subpackages/teacher/course_page?courseid=${e.id}`
        })
      }else{
        uni.navigateTo({
          url:`/pages/subpackages/teacher/student_work_page?courseid=${e.course}&workid=${e.id}`
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
        query: JSON.stringify({ teacher: this.userid })
      }
      //
      GetHomeWorks(obj).then(res => {
        const { items, total_count } = res
        console.log('GetCourses',items)
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
      console.log('this.search', this.search)
      var query = Object.assign({}, this.search)
      console.log('query', query)
      // 管理员可以查看全部
      var q = { teachers: { $in: [this.userid] }}
      if (this.roles.includes('root')) {
        delete query.teachers
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
      console.log('query:', q)
      var obj = {
        skip: 0,
        limit: 0,
        query: JSON.stringify(q)
      }
      GetSolutions(obj).then(res => {
        const { items } = res
        console.log('学生作业:',items)
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
.teacher{
  // height: 100%;
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
