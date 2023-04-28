<!-- 上传课件组件 -->
<template>
  <view class="text-msg-pic-upload">
    <u-upload :fileList="tempFileList" @delete="deletePic" border="bottom" @afterRead="handleUpload" name="1" multiple
				:maxCount="1" width="250" height="150">
        <view style="background:#eee;padding:30rpx">
          <image src="../../static/upload.png" style="width: 100rpx;height: 80rpx;"></image>
        </view>
		</u-upload>
		<view class="tip">点击开始上传</view>
  </view>
</template>

<script>
import { upload } from '@/utils/oss.js'
export default {
  name: 'UploadImageDemo',
  props: {
    width: {
      type: String,
      default: '240px'
    },
    autoUpload: {
      type: Boolean,
      default: true
    },
    limit: {
      type: Number,
      default: 3
    },
    limitType: {
      type: Array,
      default: () => ['image/jpeg', 'image/png', 'image/jpg']
    },
    disabled: {
      type: Boolean,
      default: false
    },
    imgList: {
      type: Array,
      default: () => []
    },
    tipsFlag: {
      type: Boolean,
      default: false
    },
    tips: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      // 上传文件列表，el-upload使用，临时保存数据。
      tempFileList: this.imgList,
      uploadDisabled: false,
      dialogImageUrl: '',
      dialogVisible: false
    }
  },
  computed: {
    upText() {
      return this.autoUpload ? '上传文件' : '选择文件'
    }
  },
  watch: {
    // 解决第二渲染接口， 图片还保留着原来的问题 JerryYi
    imgList: {
      immediate: true,
      handler(val) {
        this.tempFileList = val
      }
    }
  },
  created() {
  },
  mounted() {},
  methods: {
    	// 删除图片
			deletePic(event) {
				this[`fileList${event.name}`].splice(event.index, 1)
			},
    // 自定义上传操作
    handleUpload(op) {
      const dir = `images`
      const req = {
        file: op.file,
        dir,
        successCallback: res => {
          this.filterFileFn(res)
        },
        errCallBack: err => {
         
          console.log('upload failed:',err)
        }
      }
      upload(req)
    },
    // 返回给接口要用的格式
    filterFileFn(fileList) {
      console.log('fileList', fileList)
      const filterArr = fileList
        .filter(item => !item.status || item.status !== 'ready') // 过滤未上传的文件
        .map(item => {
          const url = item.response ? item.response.url : item.url
          return {
            url: url, // item.url || item.response.url
            name: item.name
          }
        })
      // console.log('fileList', fileList)
      this.$emit('onSuccessFiles', filterArr)
    },
  }
}
</script>

<style lang="scss" scoped>
.text-msg-pic-upload{
    width: 400px;

}
::v-deep .el-upload-list{
    max-height: 120px;
    overflow: auto;
}
.text-msg-pic-upload .el-upload--picture-card,
.text-msg-pic-upload .el-upload-list--picture-card .el-upload-list__item {
    width: 62px;
    height: 62px;
    line-height: 72px;
}
.display .el-upload--picture-card {
    display: none;
}
</style>

