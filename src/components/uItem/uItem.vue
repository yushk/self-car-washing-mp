<template>
    <view class="u-item  ">
        <view class="title">{{title}}</view>
        <view class="desc">{{desc}}</view>
        <view class="u-flex">
            <view class="auther">{{auther}}</view>
            <view class="time">{{time}}</view>
        </view>
    </view>
</template>
<script>
export default {
    props:{
        title:String,
        desc:String,
        auther:String,
        time:String,
        titleColor:{
            type:String,
            default:'#303133'
        }
    },
    created(){
        console.log('card')
    },
    methods:{
        openRight(){
            this.$emit('openRight')
        }
    }
    
}
</script>
<style lang="scss" scoped>
    .u-item{
        box-shadow: 0 4rpx 24rpx 0 #0000001a;
        // border-radius: 20rpx;
        border: 1px solid #ebeef5;
        background-color: #fefefe;
        padding: 14rpx ;
        transition: .3s;
        .title{
                font-size: 32rpx;
            }
        .desc{
            font-size: 28rpx;
            color: #888;
        }
        .auther{
            font-size: 28rpx;
            color: #888;
        }
        .time{
            font-size: 28rpx;
            color: #888;
        }
    }

</style>>