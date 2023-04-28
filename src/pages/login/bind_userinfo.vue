<template>
	<view class="app">
		<u-navbar title="绑定信息" :autoBack="true"> </u-navbar>
    <u-status-bar></u-status-bar>
	
		<view class="pt160"></view>
		<u--form
				labelPosition="left"
				:model="model1"
				:rules="rules"
				ref="form1"
				labelWidth="100"
		>
			<u-form-item
					label="登录账号"
					prop="name"
					borderBottom
					ref="item1"
			>
				<u--input
						v-model="model1.name"
						border="none"
				></u--input>
			</u-form-item>
			<u-form-item
					label="设置密码"
					prop="ps"
					borderBottom
					ref="item1"
			>
				<u--input
						v-model="model1.ps"
						type="password"
						border="none"
				></u--input>
			</u-form-item>
			<u-form-item
					label="确认密码"
					prop="reps"
					borderBottom
					ref="item1"
			>
				<u--input
						v-model="model1.reps"
						type="password"
						border="none"
				></u--input>
			</u-form-item>
			<u-form-item
					label="手机号码"
					prop="phone"
					borderBottom
					ref="item1"
			>
				<u-input
						v-model="model1.phone"
						border="none"
				>
				<!-- <template slot="suffix">
					<u-button type="success" size="mini"  open-type="getPhoneNumber" @getphonenumber="getPhoneNumber" >获取手机号</u-button>
				</template> -->
			</u-input>

			</u-form-item>
			<u-form-item
					label="邮箱"
					prop="email"
					borderBottom
					ref="item1"
			>
				<u--input
						v-model="model1.email"
						border="none"
				></u--input>
			</u-form-item>
			<u-form-item
					label="角色"
					prop="role"
					borderBottom
					@click="showSex = true; hideKeyboard()"
					ref="item1"
			>
				<u--input
						v-model="role"
						disabled
						disabledColor="#ffffff"
						placeholder="请选择角色"
						border="none"
				></u--input>
				<u-icon
						slot="right"
						name="arrow-right"
				></u-icon>
			</u-form-item>
		</u--form>
		<u-action-sheet
				:show="showSex"
				:actions="actions"
				title="请选择角色"
				@close="showSex = false"
				@select="sexSelect"
		>
		</u-action-sheet>
		<view class="mt20"></view>
		<u-button  type="success" @click="submit">
			保存
		</u-button>
	</view>
</template>

<script>
	import {UpdateUser,ChangeUserPassword,GetPhoneNumber} from '@/api/apis'
const defaultAvatarUrl = 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'
	export default {
		data() {
			return {
				avatarUrl: defaultAvatarUrl,
				nickName: '',
				titleStyle:{
					width:'160rpx',
					textAlign:'left',
					flex:'0 1 auto'
				},
				showSex: false,
				role: '学生',
			model1: {
				name: '',
				role: 'student',
				ps: '',
				reps: '',
				phone: '',
				email: '',
			},
			actions: [{
					name: '学生',
					value: 'student',
				},
				{
					name: '老师',
					value: 'teacher',
				}
			],
			rules: {
				'name': [
					{
						type: 'string',
						required: true,
						message: '请填写账号',
						trigger: ['blur', 'change']
					},
						// 正则判断为字母或数字
					{
						pattern: /^[0-9a-zA-Z]*$/g,
						// 正则检验前先将值转为字符串
						transform(value) {
							return String(value);
						},
						message: '只能包含字母或数字'
					},
					// 6-8个字符之间的判断
					{
						min: 6,
						max: 16,
						message: '长度在6-16个字符之间'
					},
				],
				'ps': [
					{
						type: 'string',
						required: true,
						message: '请填写登录密码',
						trigger: ['blur', 'change']
					},
					// 6-8个字符之间的判断
					{
						min: 6,
						max: 20,
						message: '长度在6-20个字符之间'
					},
				],
				'reps': [
					{
						type: 'string',
						required: true,
						message: '请确认登录密码',
						trigger: ['blur', 'change']
					},
					{
						validator: (rule, value, callback) => {
							return value===this.model1.ps;
						},
						message: '密码输入不一致"'
					},
				],
				'role': {
					type: 'string',
					required: true,
					message: '请选择角色',
					trigger: ['blur', 'change']
				},
				'phone': [
					{
						type: 'string',
						required: true,
						message: '请填写手机号',
						trigger: ['blur', 'change']
					},
					{
						validator: (rule, value, callback) => {
							return uni.$u.test.mobile(value);
						},
						message: '手机号格式错误"'
					},
				],
				'email': [
					{
						type: 'string',
						required: true,
						message: '请填写邮箱',
						trigger: ['blur', 'change']
					},
					{
						validator: (rule, value, callback) => {
							return uni.$u.test.email(value);
						},
						message: '邮箱格式错误"'
					},
				],
			},
			}
		},
		mounted() {
		//如果需要兼容微信小程序，并且校验规则中含有方法等，只能通过setRules方法设置规则。
    		this.$refs.form1.setRules(this.rules)
			// this.getUser()
    	},
		methods: {
			sexSelect(e) {
				this.model1.role = e.value
				this.role = e.name
			},
			submit(){
				this.$refs.form1.validate().then(res => {
					let obj=Object.assign({},this.userInfo,this.model1)
					delete obj.id
					delete obj.reps
					delete obj.openid
					delete obj.unionid
					obj.nickName = this.username
					obj.avatar = this.avatar
					UpdateUser({id:this.userInfo.id,body:obj}).then(res=>{
						ChangeUserPassword({ id: res.id,openid:res.openid, username: obj.name, password: obj.ps }).then(res1 => {
							uni.$u.toast('设置成功')
							this.$store.dispatch('user/getInfo')
							setTimeout(()=>{
								uni.reLaunch({url:'/pages/home/index'})
							},1000)
              			})
					})
			}).catch(errors => {
				console.log('errors:',errors)
			})
			},
			hideKeyboard(){
				uni.hideKeyboard()
			},
			//获取手机号
			getPhoneNumber(e) {
				console.log('phone e :',e)
				if(!this.decodePhoneParams.code || !e.detail.encryptedData){
						return false;
				}
				GetPhoneNumber({code:e}).then(
					res => {
						console.log(res, '[地址管理-获取用户手机号]');
						this.params.mobile = res.data.phoneNumber
					})
					.catch(err => {
						console.log(err);
					});
			},
			
			getUser(){
				wx.getUserProfile({
					desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
					success: (res) => {
						console.log('wx 会员资料:',res.userInfo)
						this.$store.dispatch('user/setUserInfo', res.userInfo)
					},
					fail: (res) => {
						console.log('获取用户信息失败:',res)
						// this.$store.dispatch('user/setUserInfo', res.userInfo)
					}
				})

				// wx.getSetting({
				// 	success: (res)=>{
				// 		if (res.authSetting['scope.userInfo']) {
				// 			// 已经授权，可以直接调用 getUserInfo 获取头像昵称
				// 			wx.getUserInfo({
				// 					success: (res1) =>{
				// 					console.log('wx userinfo:',res1.userInfo)
				// 					this.$store.dispatch('user/setUserInfo', res1.userInfo)
				// 					}
				// 				})
						
				// 		}else{
				// 			wx.authorize({
				// 				scope: 'scope.userInfo',
				// 					success :()=> {
				// 						wx.getUserInfo({
				// 							success: (res1) =>{
				// 							console.log('wx userinfo:',res1.userInfo)
				// 							this.$store.dispatch('user/setUserInfo', res1.userInfo)
				// 							}
				// 						})
				// 					}
				// 				})
				// 			}
				// 		}
				// 	})
				}
		}
	}
</script>

<style lang="scss" scoped>
	.app {
		text-align: center;
		padding: 20px;

		.avatar-wrapper {
			width: 200rpx;
			height: 200rpx;
			margin: 50px auto;
			padding: 0;
			image {
				width: 100%;
				height: 100%;
				border-radius: 50%;
			}
		}

		::v-deep.u-cell__body__content{
			flex:0 1 auto
		}

	}
</style>
