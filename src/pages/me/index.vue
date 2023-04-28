<template>
	<view class="center">
		<view class="center_top"
			:style="{background: `url(${avatar?avatar:defaultImg}) no-repeat`,backgroundSize:'cover'}">
			<view class="mask"></view>
		</view>
		<view class="center_box_bg">
			<view class="profily">
				<view class="base">
					<view class="profily_header"
						:style="{backgroundImage: `url(${avatar?avatar:defaultImg})`}" style="background-repeat: no-repeat;background-size: 100% 100%;">
					</view>
					<text>{{username=='微信用户'?userInfo.name:username }}</text>
					<view style="flex-grow: 1;"></view>
					<image src="https://code-grade-server-prd.oss-cn-shenzhen.aliyuncs.com/smart-config-img/setting.png"
						lazy-load @click="updateDia = true" ></image>
				</view>
			</view>
			<view class="baiban"></view>
			<view class="center_menu">
				<view class="menu_item" v-for="item in menus" @click="clickItem(item)" :key="item.key">
					<image :src="item.icon" mode="aspectFill"></image>
					<text>{{item.name}}</text>
				</view>
			</view>
      <view style="padding:40rpx" @click="logout(4)">
        <u-button type="primary" text="退出"></u-button>
      </view>
		</view>
		<updateUserInfo v-if="updateDia" @close="close"></updateUserInfo>
    <userDefinedTabBar></userDefinedTabBar>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				updateDia: false,
				isLogin: true,
				defaultImg: 'https://code-grade-server-prd.oss-cn-shenzhen.aliyuncs.com/smart-config-img/default.png',
				menus:[],
        allmenus: [
          //学生 
        // {
		// 				name: '我的课程',
		// 				icon: 'https://code-grade-server-prd.oss-cn-shenzhen.aliyuncs.com/smart-config-img/jl.png',
		// 				key: 1,
		// 				role:'student',
		// 				path:'/pages/subpackages/student/my_course_list'
		// 				},
					{
						name: '我的作业',
						icon: 'https://code-grade-server-prd.oss-cn-shenzhen.aliyuncs.com/smart-config-img/yj.png',
						key: 3,
						role:['student'],
						path:'/pages/subpackages/student/my_work_list'
					},
          			{
						name: '我的评论',
						icon: 'https://code-grade-server-prd.oss-cn-shenzhen.aliyuncs.com/smart-config-img/me.png',
						key: 6,
						role:['student'],
						path:'/pages/invitate_review_list'
					},
          // 老师
					{
						name: '我的课程',
						icon: 'https://code-grade-server-prd.oss-cn-shenzhen.aliyuncs.com/smart-config-img/me.png',
						key: 4,
						role:['teacher'],
						path:'/pages/subpackages/teacher/my_course_list'
					},
					{
						name: '学生作业',
						icon: 'https://code-grade-server-prd.oss-cn-shenzhen.aliyuncs.com/smart-config-img/mz.png',
						key: 5,
						role:['teacher'],
						path:'/pages/subpackages/teacher/student_work_list'
					},
					{
						name: '我的评论',
						icon: 'https://code-grade-server-prd.oss-cn-shenzhen.aliyuncs.com/smart-config-img/yj.png',
						key: 7,
						role:['teacher'],
						path:'/pages/invitate_review_list'
					},
					{
						name: '个人信息',
						icon: 'https://code-grade-server-prd.oss-cn-shenzhen.aliyuncs.com/smart-config-img/yj.png',
						key: 8,
						role:['teacher','root','student'],
						path:'/pages/me/user_info'
					},
				]
			};
		},
    onLoad(){
      this.menus = this.allmenus.filter((e)=>(e.role.includes(this.roles[0])))
    },
	onShow() {
	},
	methods: {
		close() {
			this.updateDia = false
		},
		logout() {
			this.$store.dispatch('user/logout').then(res=>{
				uni.navigateTo({
					url: '/pages/login/login'
				})
			})
		},
		clickItem(item) {
			uni.navigateTo({
				url: item.path
			})
		}
	}
}
</script>

<style lang="scss">
	page {
		height: 100%;
	}

	.profily,
	.profily_header {
		border-radius: 8px;
	}

	.center {
		height: 100%;

		&_top {
			height: 35%;

			.mask {
				background: rgba(0, 0, 0, .4);
				height: 100%;
			}
		}

		&_box_bg {
			background: #F9F9F9;
			position: relative;

			.profily {
				position: absolute;
				width: 90%;
				// border:1px solid #F7F7F7;
				margin: 0 auto;
				top: -100upx;
				left: 5%;
				background: #FEFEFE;
				padding: 35upx;
				box-sizing: border-box;
				box-shadow: 0px 2px 5px #EDEDED;
			}
		}
	}

	.base {
		display: flex;
		align-items: center;
		// border-bottom: 2px solid #F6F6F6;
		padding-bottom: 35upx;
		position: relative;

		.profily_header {
			height: 120upx;
			width: 120upx;

			background-size: 100%;
		}

		text {
			margin-left: 20px;
			font-size: 30upx;
		}

		image {
			height: 40upx;
			width: 40upx;
			right: 0px;
			top: 0px;
		}
	}

	.order_status {
		display: flex;
		justify-content: space-between;
		margin-top: 35upx;

		.status {
			width: 140upx;
			font-size: 24upx;
			text-align: center;
			letter-spacing: .5px;
			display: flex;
			flex-direction: column;

			.icon {
				width: 50upx;
				height: 50upx;
				margin: 0 auto;
				margin-bottom: 5px;

			}
		}
	}

	.baiban {
		background: #FEFEFE;
		height: 200upx;
	}

	.center_menu {
		width: 100%;
		display: inline-block;

		.menu_item {
			font-size: 28upx;
			letter-spacing: 1px;
			padding: 14px 5%;
			background: #FEFEFE;
			overflow: hidden;
			box-sizing: border-box;
			display: flex;
			align-items: center;
			position: relative;
			border-bottom: 1px solid #EFEFEF;

			&:hover {
				background: #F6F6F6 !important;
			}

			&::after {
				content: '';
				width: 30upx;
				height: 30upx;
				position: absolute;
				right: 5%;
				background: url('https://code-grade-server-prd.oss-cn-shenzhen.aliyuncs.com/smart-config-img/right.png') no-repeat;
				background-size: 100%;
			}

			text:nth-of-type(1) {
				margin-left: 10px;
			}

			image {
				width: 40upx;
				height: 40upx;
			}

			&:nth-of-type(4) {
				margin-top: 10px;
			}
		}
	}
</style>
