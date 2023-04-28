<template>
    <view class="u-card u-flex-y ">
        <view class="u-header u-flex u-flex-between">
            <slot name="left"  :style="{color:titleColor}">
                <view class="title">{{title}}</view>
            </slot>
            <slot name="right">
                <view @click="openRight" class="u-flex u-flex-items-center right-title">
                    <text>查看全部</text><u-icon name="arrow-right" size="16"></u-icon>
                </view>
            </slot>
        </view>
        <view class="u-body">
            <slot name="body">

            </slot>
        </view>
        <view class="u-footer">
            <slot name="footer">

            </slot>
        </view>
    </view>
    
</template>
<script>
export default {
    props:{
        title:String,
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
    .u-card{
        box-shadow: 0 4rpx 24rpx 0 #0000001a;
        border-radius: 20rpx;
        border: 1px solid #ebeef5;
        background-color: #fefefe;
        padding: 18rpx ;
        transition: .3s;
        .u-header{
            padding: 18rpx 20rpx;
            border-bottom: 1px solid #ebeef5;
            box-sizing: border-box;
            .title{
                font-size: 32rpx;
            }
            .right-title{
                font-size: 28rpx;
                color: #888;
            }
        }
        .u-body{
            padding: 18rpx 20rpx;
        }
        .u-footer{

        }
    }

</style>>