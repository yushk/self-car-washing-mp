<template>
	<view>
        <u-navbar title="上传视频" :autoBack="true" ></u-navbar>
        <u-status-bar></u-status-bar>
		<view class="page-index pt160" :style="{height: windowHeight+'px', position: 'relative'}">
			<!-- 录制视频区域 -->
			<camera v-if="!videoSrc.length" :device-position="direction" flash="off" binderror="error"
				:style="{width:'100%',height: windowHeight+'px'}">
				<view class="time-clycle" v-if="showTimer">{{timeStamp===0?"开始":timeStamp}}</view>
				<!-- 录制视频时间显示 -->
				<view class="video-time"><span>00:<span v-if="videoTime<10">0</span><span>{{videoTime}}</span></span>
				</view>
			</camera>
			<!-- 查看录制视频 -->
			<video :style="{width:cameraWidth+'px',height: windowHeight+'px'}" v-else :src="videoSrc" controls></video>
		</view>
 
        <view class="u-flex u-flex-center">
		<u-button :disabled="disStartBtn" class="video-operate" type="primary" v-if="showStartBtn" @click="handleStartCamera()">
			开始录制
		</u-button>
		
		<u-button class="video-operate" v-if="showStopBtn" type="warning" @click="handleStopCamera()">
			结束录制
		</u-button>
        </view>
		<!-- 上传 -->
		<view v-if="videoSrc.length" class="video-result">
			<u-button :custom-style="firstButtonStyle" style="width: 35%" type="primary" hover-class="active"
				@click="removeVedio()">
				重新录制
			</u-button>
			<u-button :custom-style="secondButtonStyle" style="width: 65%" type="primary"
				@click="uploadVedio()">确定上传</u-button>
		</view>
	</view>
 
</template>
 
<script>
import {  UpdateSolution, GetSolution } from '@/api/apis'
import {GetOSSKeyInfo ,uploadFile} from "@/utils/upload";
	export default {
		components: {},
		data() {
			return {
                videoFile:null,
                videoSrc:'',
				ctx:null,
                listener:null,
                cameraWidth:400,
                windowHeight:400,
                videoTimer:null,
                videoTime:0,
                timeId:null,
                showTimer:false,
                timeStamp:3,
                timeStampStart:0,
                timeStampEnd:0,
                showStartBtn:true,
                showStopBtn:false,
                disStartBtn:false,
                minRecordTime:2*1000,
                maxRecordTime:30*1000,
                startTime:null,
                endTime:null,
                workId:'',
				direction:'back'
			}
		},
        onLoad(e) {
            const {  id } = e
            if(id){
                this.workId = id
            }
			GetOSSKeyInfo()
			this.setCameraSize();
			this.ctx = wx.createCameraContext();
			// 获取 Camera 实时帧数据
			this.listener = this.ctx.onCameraFrame((frame) => {
				this.videoFile = frame.data;
			})
		},
		methods: {
			/**
			 * 上传视频 
			 */
			async uploadVedio() {
				this.handleUploadFile(this.videoSrc);
			},
 	        /**
			 * 上传文件 
			 */
             async handleUploadFile(file) {
                const {Code,Data} = await uploadFile(file)
				
				this.saveVideoFileInfo({name:'',url:'http://www.yourong.tech'+Data})
			},
			/**
			 * 保存录制的视频到后台
			 * @param {Object} params
			 */
			async saveVideoFileInfo(params) {
                const so = await GetSolution({ id: this.workId })
                let obj = Object.assign({},so)
				
				params.name = `${so.title}_（${this.$store.state.user.name}）_上传作业`
				if(obj.content&&obj.content.length){
					obj.content = JSON.parse(obj.content) || []
					obj.content.push(params)
				}else{
					obj.content=[params]
				}
				obj.content=JSON.stringify(obj.content)

                delete obj.id
                UpdateSolution({ id: this.workId, body: obj }).then(res=>{
                    uni.showModal({
						title: '提示',
						content: '录制视频已上传成功',
						showCancel: false,
						confirmText: '知道了',
						success: function(res) {
							if (res.confirm) {
								uni.navigateBack()
							}
						}
					})
                })
	
			},
			/**
			 * 获取系统信息 设置相机的大小适应屏幕
			 */
			setCameraSize() {
				//获取设备信息
				uni.getWindowInfo().then(res=>{
                    //获取屏幕的可使用宽高，设置给相机
                    this.cameraWidth = res.windowWidth;
                    this.windowHeight = res.windowHeight - res.statusBarHeight;
                })
			},
 			/**
			 * 开始录制
			 */
             async handleStartCamera() {
				this.disStartBtn = true;
				// 判断是否授权了麦克风
				const authorizePass = await this.getSetting();
				if (!authorizePass) {
					wx.showToast({
						title: `录像失败,麦克风未授权`,
						icon: 'none',
						duration: 4000
					});
					this.removeVedio();
					return
				}
				this.showTimer = true;
				this.timeStamp = this.timeStampStart;
				// 倒计时3s后，调用开始录像方法
				this.startVideoTimer();
			},
 
			/**
			 * 结束录制
			 */
			handleStopCamera() {
				this.endTime = new Date().getTime();
				if ((this.endTime - this.startTime) < this.minRecordTime) {
					wx.showToast({
						title: `录制时间太短,请重新录制`,
						icon: 'none',
						duration: 3000
					});
					// 停止录像
					this.ctx.stopRecord();
					this.removeVedio();
				} else if ((this.endTime - this.startTime) > this.maxRecordTime) {
					wx.showToast({
						title: `录制时间超过30s,请重新录制`,
						icon: 'none',
						duration: 3000
					});
					this.removeVedio();
				} else {
					this.showStartBtn = false;
					this.showStopBtn = false;
					this.stopShootVideo();
				}
			},

			/**
			 * 录制视频计时器
			 */
			videoTimeInterval() {
				this.videoTimer =
					setInterval(() => {
						++this.videoTime;
					}, 1000)
			},
 
			/**
			 * 倒计时录像
			 */
			startVideoTimer() {
				this.timeId = setInterval(() => {
					if (this.timeStamp > this.timeStampEnd) {
						this.timeStamp--;
					} else if (this.timeStamp === this.timeStampEnd) {
						this.showTimer = false;
						this.clearTimer()
						// 开始录像
						this.startShootVideo();
					} else {
						this.clearTimer()
					}
				}, 1000)
			},
 
			/**
			 * 倒计时重置
			 */
			clearTimer() {
				this.showTimer = false;
				clearInterval(this.timeId);
				this.timeId = null;
				this.timeStamp = this.timeStampStart;
			},
 
			/**
			 * 重新录制
			 */
			removeVedio() {
				this.videoSrc = '';
				this.showStartBtn = true;
				this.showStopBtn = false;
				this.disStartBtn = false;
				// 倒计时重置
				clearInterval(this.timeId);
				this.timeId = null;
				this.timeStamp = this.timeStampStart;
				// 录制时间重置
				clearInterval(this.videoTimer);
				this.videoTimer = null;
				this.videoTime = this.timeStampEnd;
				this.listener.stop();
			},
			/**
			 * 开始录像的方法
			 */
			startShootVideo() {
				this.startTime = new Date().getTime();
				this.showStopBtn = true;
				this.showStartBtn = false;
				this.listener.start();
				this.videoSrc = ''
				let that = this;
				this.ctx.startRecord({
					success: (res) => {
						that.videoTimeInterval()
					},
					fail(err) {
						wx.showToast({
							title: `开始录像失败${err.errMsg},请重新扫码进入`,
							icon: 'none',
							duration: 4000
						});
						that.removeVedio();
					}
				})
			},
			/**
			 * 结束录像的方法
			 */
			stopShootVideo() {
				let that = this;
				clearInterval(that.videoTimer);
				this.ctx.stopRecord({
					compressed: false, //压缩视频
					success: (res) => {
						that.videoSrc = res.tempVideoPath;
					},
					fail(err) {
						wx.showToast({
							title: `结束录像失败${err.errMsg},请重新扫码进入`,
							icon: 'none',
							duration: 4000
						});
						that.removeVedio();
					}
				});
			},
			/**
			 * 获取麦克风权限
			 */
			getSetting() {
				return new Promise((resolve, reject) => {
					wx.getSetting({
						success(res) {
							if (!res.authSetting['scope.record']) {
								wx.authorize({
									scope: 'scope.record',
									success() {
										resolve(true)
										// 用户已经同意小程序使用录音功能，后续调用 wx.startRecord 接口不会弹窗询问
									},
									fail(err) {
										resolve(false)
									}
								})
							} else {
								resolve(true)
							}
						},
						fail(err) {
							resolve(false)
						}
					})
				})
 
			},
 

		},
	}
</script>
 
<style lang="scss" scoped>
	.page-index {
		position: relative;
 
		.time-clycle {
			position: absolute;
			display: block;
			top: 50%;
			left: 50%;
			transform: translateX(-50%);
			color: #fff;
			font-size: 80rpx;
			text-align: center;
			text-shadow: 5rpx 5rpx 5rpx #333;
		}
 
		.video-time {
			position: absolute;
			color: #fff;
			right: 0;
			bottom: 0;
			widows: 100rpx;
			height: 60rpx;
			background-color: red;
		}
	}
 
	.video-operate {
		height: 120rpx;
		line-height: 120rpx;
	}
 
	.video-result {
		position: fixed;
		display: flex;
		text-align: center;
		left: 0;
		right: 0;
		padding-bottom: 68rpx;
		height: 120rpx;
		line-height: 120rpx;
	}
</style>