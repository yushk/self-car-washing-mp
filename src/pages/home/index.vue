<template>
    <view class="page">
      <view >
        <u-status-bar></u-status-bar>
        <view class="head" :style="{height: titleBarHeight + 'px',lineHeight:titleBarHeight + 'px'}"></view>
      </view>
      <view class="content">
        <Student v-if="roles.includes('student')"/>
        <Teacher v-if="roles.includes('teacher')"/>
        <Root v-if="roles.includes('root')"/>
      </view>
      <userDefinedTabBar></userDefinedTabBar>

    </view>
  </template>
  
<script>
    import Student from './com/student.vue'
    import Teacher from './com/teacher.vue'
    import Root from './com/root.vue'
    export default {
      components:{
      Student,
      Teacher,
      Root
      },
    data() {
      return {
        statusBarHeight: 0,
      };
    },
    onLoad(){
     
    },
   onReady() {
    // #ifdef MP-WEIXIN
      this.statusBarHeight = uni.$u.sys().statusBarHeight;
      // this.statusBarHeight = uni.$u.addUnit(uni.$u.sys().statusBarHeight, 'px');
      var titleBarHeight = (uni.getMenuButtonBoundingClientRect().top - this.statusBarHeight) * 2 +
      uni.getMenuButtonBoundingClientRect().height;
					 this.$store.dispatch('user/setBarHeight',titleBarHeight)

      // #endif
    },
    onBackPress(e){
      return true;
    },
    methods: {
         change(e) {
                  // console.log('change', e);
      },
      click(e) {
          console.log('click', e);
          uni.navigateTo({
              url: `/pages/answer/index?id=${e}`,
              success:function(err){
              },
              fail:function(err){
                  console.log(err)
              },
          });
      }
    },
  };
  </script>
  
  <style lang="scss" scoped>
  .page{
    .head{
      text-align:center;
      font-size: 20px;
    }
  }
  </style>
  