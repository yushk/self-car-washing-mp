<template>
	<view class="main-container-user">
		<image src="https://code-grade-server-prd.oss-cn-shenzhen.aliyuncs.com/smart-config-img/close.png" class="close"
			@click="close"></image>
		<view class="user-header">
			<u-upload :fileList="fileList1" @delete="deletePic" border="bottom" @afterRead="afterRead" name="1" multiple
				:maxCount="1" width="250" height="150">
				<image src="../../static/default.png" style="width: 200rpx;height: 200rpx;"></image>
			</u-upload>
			<view class="tip">点击头像开始上传</view>
		</view>

		<view class="nickname">
			<input class="input-content" maxlength="11" v-model="nickName" placeholder="请输入新昵称" type="inputType" />
			<!-- <u--input   v-model="nickName"></u--input> -->
		</view>
		<view class="submit-btn" @click="submit">确定</view>
	</view>
</template>

<script>
	// import uploadApi from '@/api/uploadApi.js'
	// import userApi from '@/api/userApi.js'
	export default {
		name: "updateUserInfo",
		data() {
			return {
				fileList1: [],
				nickName: '',
				userCoverImg: '',
				uploadAction: '',
				dataObj: {
					policy: '',
					signature: '',
					key: '',
					ossaccessKeyId: '',
					dir: '',
					host: '',
				},
				fileName: ''
			};
		},
		methods: {
			close() {
				this.$emit("close")
			},
			// 删除图片
			deletePic(event) {
				this[`fileList${event.name}`].splice(event.index, 1)
			},
			async afterRead(event) {
				// // 获得上传签名
				// let response = await uploadApi.getPolicy()
				// let _self = this
				// if (response.data.wayKey == 1) { //本地tomcat文件上传

				// } else if (response.data.wayKey == 2) {
				// 	let res = response.data.signData
				// 	_self.uploadAction = res.uploadAction
				// 	_self.dataObj.policy = res.policy;
				// 	_self.dataObj.signature = res.signature;
				// 	_self.dataObj.ossaccessKeyId = res.accessid;
				// 	_self.dataObj.key = res.dir + uploadApi.getUUID();
				// 	_self.dataObj.dir = res.dir;
				// 	_self.dataObj.host = res.host;
				// }
				// // 当设置 mutiple 为 true 时, file 为数组格式，否则为对象格式
				// let lists = [].concat(event.file)
				// let fileListLen = this[`fileList${event.name}`].length
				// lists.map((item) => {
				// 	this[`fileList${event.name}`].push({
				// 		...item,
				// 		status: 'uploading',
				// 		message: '上传中'
				// 	})
				// })
				// for (let i = 0; i < lists.length; i++) {
				// 	const result = await this.uploadFilePromise(lists[i].url)
				// 	let item = this[`fileList${event.name}`][fileListLen]
				// 	this[`fileList${event.name}`].splice(fileListLen, 1, Object.assign(item, {
				// 		status: 'success',
				// 		message: '',
				// 		url: result
				// 	}))
				// 	fileListLen++
				// }
			},
			uploadFilePromise(url) {
				let that = this
				let fileType = url.substring(url.lastIndexOf('.')) || '.jpg'
				that.dataObj.key = that.dataObj.key + fileType
				return new Promise((resolve, reject) => {
					let a = uni.uploadFile({
						url: that.uploadAction, // 仅为示例，非真实的接口地址
						filePath: url,
						name: 'file',
						formData: that.dataObj,
						success: (res) => {
							that.userCoverImg = that.dataObj.host + '/' + that.dataObj.key
							setTimeout(() => {
								resolve(res.data.data)
							}, 1000)
						}
					});
				})
			},
			async submit() {
				// if (!this.nickName && !this.userCoverImg) {
				// 	this.close()
				// 	return
				// }
				// let param = {}
				// if (this.nickName) param.nickName = this.nickName
				// if (this.userCoverImg) param.avatar = this.userCoverImg
				// let res = await userApi.updateSmartUserInfo(param)
				// if (this.userCoverImg) getApp().globalData.userInfo.photo = this.userCoverImg
				// if (this.nickName) getApp().globalData.userInfo.nickName = this.nickName
				// this.close()
			}
		}
	}
</script>

<style scope>
	.main-container-user {
		position: fixed;
		height: 560rpx;
		width: 460rpx;
		padding: 20rpx;
		background-color: #ffffff;
		top: 50%;
		margin-top: -300rpx;
		left: 50%;
		margin-left: -250rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
		box-shadow: 0 8px 17px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.15);
		border-radius: 20rpx;
	}

	.input-content {
		display: flex;
		flex-direction: row;
		flex-grow: 1;
		height: 100%;
		font-size: 30rpx;
		align-items: center;
		border-width: 0.5px !important;
		border-color: #dadbde !important;
		border-style: solid;
		padding: 0 10rpx;
		border-radius: 20rpx;
	}

	.user-header {

		margin-top: 40rpx;
		height: 240rpx;
		margin-bottom: 20rpx;
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.nickname {
		z-index: 999;
		height: 80rpx;
		width: 100%;
		margin-top: 40rpx;
	}

	.tip {
		margin: 20rpx 0;
		color: #999999;
		font-size: 26rpx;
	}

	.submit-btn {
		position: absolute;
		bottom: 50rpx;
		width: 360rpx;
		text-align: center;
		padding: 20rpx;
		border-radius: 40rpx;
		background: #55aaff;
		font-size: 30rpx;
		color: #ffffff;
	}

	.close {
		height: 50rpx;
		width: 50rpx;
		position: absolute;
		right: 0;
		top: 0;
	}
</style>
