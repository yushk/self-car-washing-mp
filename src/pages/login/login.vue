<template>
	<view class="app page">
		<div class="imgDiv">
			<image :src="logo" mode="aspectFill"></image>
		</div>
		
		<u-button type="success" class="mt20" @click="getUserInfo">
			微信账号一键登录
		</u-button>
		<view class="mt20 blue">中体智训系统
			<!-- <br />xxxxxxxxxxxx -->
		</view>
	</view>
</template>

<script>
	import logo from '@/static/logo.png'
	export default {
		data() {
			return {
				logo,
				code:''
			}
		},
		onLoad() {

		},
		mounted(){
			this.getLoginCode().then(
				res=>{
					let {code} = res
					this.code = code
					this.getRole()
			})
		},
		methods: {
			getLoginCode(){
				return new Promise((resolve, reject) => {
					wx.login({  
						success (res) {    
							if (res.code) {      
								console.log('登录成功！');   
								resolve({code:res.code}) 
							} else {      
								console.log('登录失败！' + res.errMsg)  
								reject(res)  
							}  
						},fail (res) {    
							console.log('登录失败！' + res.errMsg)  
							reject(res)  
						}
						})
				})
			},
			async getRole() {
				console.log('code',this.code)
				await this.$store.dispatch('user/wxlogin', this.code)
				const {role} = await this.$store.dispatch('user/getInfo')
				console.log('用户角色：',role)
			},

			// 适配新旧版本获取个人信息
			async getUserInfo() {
				// wx.getUserProfile
				if(this.roles.length){
					uni.reLaunch({url:'/pages/home/index'})
					return 
				}
				if(wx.getUserProfile){
						wx.getUserProfile({
							lang: "zh_CN",
							desc: '用于完善会员资料',
							success: (res) => {
								console.log('getUserProfile:',res)
								this.$store.dispatch('user/setUserInfo', res.userInfo)
								uni.reLaunch({url:'/pages/login/bind_userinfo'})
							},fail: (res) => {
								console.log('getUserProfile 获取用户信息失败:',res)
							}
							// 失败回调根据自己项目去设计
						})
				}
				// wx.getUserInfo
				else{
						wx.getUserInfo({
							provider: 'weixin',
							lang: "zh_CN",
							success: (res) => {
								this.$store.dispatch('user/setUserInfo', res.userInfo)
								uni.reLaunch({url:'/pages/login/bind_userinfo'})
								console.log('getUserInfo:',res)
							},fail: (res) => {
								console.log('getUserInfo 获取用户信息失败:',res)
							}
							// 失败回调根据自己项目去设计
					})
				}
			},
			
			
		}
	}
</script>


<style scoped lang='scss'>
	.app {
		text-align: center;
		padding: 20px;
		height: 100vh;
	}

	.imgDiv {
		width: 200rpx;
		height: 200rpx;
		margin:200rpx auto;

		image {
			width: 100%;
			height: 100%;
			border-radius: 50%;
		}
	}
	.blue{
		color:#5ac725;
	}
</style>
