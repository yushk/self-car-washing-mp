<template>
	<view class="app">
		<u-navbar title="个人信息" :autoBack="true"> </u-navbar>
    	<u-status-bar></u-status-bar>
	
		<view class="pt160"></view>
		<u-form
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
				<u-input
						v-model="model1.name"
						border="none"
				></u-input>
			</u-form-item>
			<!-- <u-form-item
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
			</u-form-item> -->
			<u-form-item
					label="手机号码"
					prop="phone"
					borderBottom
					ref="item1"
			>
				<u-input
						v-model="model1.phone"
						border="none"
				></u-input>
			</u-form-item>
			<u-form-item
					label="邮箱"
					prop="email"
					borderBottom
					ref="item1"
			>
				<u-input
						v-model="model1.email"
						border="none"
				></u-input>
			</u-form-item>
			<u-form-item
					label="角色"
					prop="role"
					borderBottom
					ref="item1"
			>
				<u-input
						v-model="model1.role"
						disabled
						disabledColor="#ffffff"
						placeholder="请选择角色"
						border="none"
				></u-input>
			</u-form-item>
		</u-form>
		<u-action-sheet
				:show="showSex"
				:actions="actions"
				title="请选择角色"
				@close="showSex = false"
				@select="sexSelect"
		>
		</u-action-sheet>
			<!-- <button class="avatar-wrapper" open-type="chooseAvatar" @chooseavatar="onChooseAvatar">
		  <image class="avatar" :src="avatarUrl"></image>
		</button> 
		<u-cell  title="昵称" :titleStyle="titleStyle">
			<u-input slot="value" v-model="nickName" type="nickname" class="weui-input" placeholder="请输入昵称" border="none"/>
		</u-cell>
		<u-cell  title="登录账号" :titleStyle="titleStyle">
			<u-input slot="value"  class="weui-input" placeholder="请设置登录账号" border="none">
				<template slot="suffix">
					<u-button slot="right-icon" type="success" size="mini"  open-type="getPhoneNumber" @getphonenumber="getPhoneNumber" >获取手机号</u-button>
				</template>
			</u-input>
		</u-cell>
		<u-cell  title="设置密码" :titleStyle="titleStyle">
			<u-input slot="value" password  class="weui-input" placeholder="请输入登录密码" border="none"/>
		</u-cell>
		<u-cell  title="确认密码" :titleStyle="titleStyle">
			<u-input slot="value"  password class="weui-input" placeholder="请输入确认登录密码" border="none" :customStyle="customStyle"/>
		</u-cell> -->
		<view class="mt20"></view>
		<!-- <u-button  type="success" @click="submit">
			保存
		</u-button> -->
	</view>
</template>

<script>
	import {UpdateUser,ChangeUserPassword} from '@/api/apis'
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
				},
				{
					name: '管理员',
					value: 'root',
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
			this.model1 = this.userInfo
    	},
		methods: {
			sexSelect(e) {
				this.model1.role = e.value
				this.role = e.name
			},
			onChooseAvatar(e) {
			    const { avatarUrl } = e.detail 
				this.avatarUrl =avatarUrl 
			    // this.setData({
			    //   avatarUrl,
			    // })
			  },
			  submit(){
				this.$refs.form1.validate().then(res => {
					let obj=Object.assign({},this.userInfo,this.model1)
					delete obj.id
					delete obj.reps
					delete obj.openid
					delete obj.unionid
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
		}
			  	// 获取code
			// getCode() {
			// 		uni.login({
			// 				provider: 'weixin',
			// 				success: loginRes => {
			// 					this.decodePhoneParams.code = loginRes.code
			// 				}
			// 		});
			// },
			// 获取手机号
			// getPhoneNumber(e) {
			// 		// this.getCode();
			// 		if(!this.decodePhoneParams.code || !e.detail.encryptedData){
			// 				return false;
			// 		}
			// 		this.decodePhoneParams.encryptedData = e.detail.encryptedData;
			// 		this.decodePhoneParams.iv = e.detail.iv;
			// 		this.$u.api.postDecodeUserInfo(this.decodePhoneParams)
			// 				.then(res => {
			// 						console.log(res, '[地址管理-获取用户手机号]');
			// 						this.params.mobile = res.data.phoneNumber
			// 				})
			// 				.catch(err => {
			// 						console.log(err);
			// 				});
			// },
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
