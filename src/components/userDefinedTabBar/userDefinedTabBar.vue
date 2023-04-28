<template>
  <view class="bottom_tabBar">
    <u-tabbar
      @change="change"
      :value="current"
    >
    <u-tabbar-item
    v-for="(item, index) in list"
        :key="'tabsss' + index"
        :text="item.text"
        >
        <image
          class="u-page__item__slot-icon imgsize"
          slot="active-icon"
          :src="item.selectedIconPath"
        ></image>
        <image
          class="u-page__item__slot-icon imgsize"
          slot="inactive-icon"
          :src="item.iconPath"
        ></image>
      </u-tabbar-item>
    </u-tabbar>
  </view>
</template>

<script>
export default {
  name: "userDefinedTabBar",
  data() {
    return {
      list: [
        {
          iconPath: "/static/tab/home.png",
          selectedIconPath: "/static/tab/home_s.png",
          text: "首页",
          name: "/pages/home/index",
        },
        {
          iconPath: "/static/tab/me.png",
          selectedIconPath: "/static/tab/me_s.png",
          text: "我的",
          name: "/pages/me/index",
        },
      ]
    
    };
  },
  options: {
    styleIsolation: "shared",
  },
  computed: {
    current() {
      // eslint-disable-next-line no-undef
      let routes = getCurrentPages(); // 获取当前打开过的页面路由数组
      if (!routes.length) return 0;
      let curRoute = routes[routes.length - 1].route; //获取当前页面路由
      console.log("curRoute:", curRoute);

      if (curRoute.indexOf("home") > -1) {
        return 0;
      } else  {
        return 1;
      }
    },

  },
  methods: {
    change(e) {
      uni.reLaunch({
        url:  this.list[e].name,
        success: () => {
        },
        fail: (e) => {
          console.error(e);
        },
      });
    }
  },
};
</script>

<style lang="scss">
.bottom_tabBar {
  width: 100%;
  background-color: #ffffff;
  position: fixed;
  z-index: 2;
  bottom: 0;
  /deep/ .imgsize {
    width: 64rpx;
    height: 64rpx;
  }
  .u-drawer {
    display: flex;
    align-items: flex-end;
    bottom: 10% !important;
    transform: translateY(-1%);

    /deep/ .u-drawer-bottom {
      background: rgba(255, 255, 255, 0) !important;
      height: 240rpx !important;

      .u-drawer__scroll-view {
        .uni-scroll-view {
          .uni-scroll-view {
            overflow: hidden !important;
          }
        }
      }

      .tabbar-box-wrap {
        width: 100%;
        height: 196rpx;
        margin-top: 1%;
        background: rgba(255, 255, 255, 0.9);
        box-shadow: 0px 0px 8rpx 6rpx rgba(184, 184, 184, 0.3);
        // padding: 90rpx 30rpx;
        display: flex;
        flex-direction: column;
        justify-content: center;
        position: relative;

        &:after {
          content: "";
          position: absolute;
          bottom: -12%;
          left: 0;
          right: 0;
          margin: auto;
          width: 60rpx;
          height: 60rpx;
          transform: rotate(45deg);
          background: linear-gradient(
            to right bottom,
            transparent 0%,
            transparent 34%,
            transparent 40%,
            transparent 50%,
            transparent 52%,
            rgba(255, 255, 255, 0.9) 53%,
            rgba(255, 255, 255, 0.9) 59%,
            rgba(255, 255, 255, 0.9) 65%,
            rgba(255, 255, 255, 0.9) 75%,
            rgba(255, 255, 255, 0.9) 85%,
            rgba(255, 255, 255, 0.9) 95%,
            rgba(255, 255, 255, 0.9) 100%
          );
          z-index: 1;
          box-shadow: 6rpx 6rpx 8rpx rgba(184, 184, 184, 0.3);
          border-radius: 4rpx;
        }

        .tabbar-box {
          display: flex;
          justify-content: flex-start;

          .tabbar-box-item {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            margin: 0 30rpx;
            .box-image {
              display: inline-block;
            }

            .explain {
              display: inline-block;
              margin-top: 10rpx;
              font-size: 10px;
              line-height: 14px;
              color: #333333;
            }
          }
        }
      }
    }
  }

  .u-tabbar {
    /deep/ .u-tabbar__content {
      box-shadow: 0px -20rpx 20rpx rgba(0, 0, 0, 0.04);
      background: none !important;
      z-index: 2000;
      // height: calc(100rpx + constant(safe-area-inset-bottom)) !important;
      // height: calc(100rpx + env(safe-area-inset-bottom)) !important;
      .u-tabbar__content__item {
        &:nth-child(2) {
          .u-icon__img {
            width: 80rpx !important;
            height: 80rpx !important;
          }
        }
        padding: 0 !important;

        .u-tabbar__content__item__button {
          top: 10rpx !important;
        }

        .u-tabbar__content__item__text {
          font-size: 20rpx !important;
          bottom: 10rpx !important;
        }
      }

      .u-tabbar__content__circle {
        height: calc(100%);

        .u-tabbar__content__circle__button {
          width: 138rpx;
          height: 138rpx;
          background: linear-gradient(
            to bottom,
            transparent 0%,
            transparent 36%,
            #f6f6f6 37%,
            #f6f6f6 100%
          ) !important;
          top: -50rpx;

          .u-icon {
            .u-icon__img {
              width: 110rpx !important;
              height: 110rpx !important;
              border-radius: 110rpx;
              box-shadow: 0px 6rpx 8rpx rgba(213, 153, 0, 0.25);
            }
          }
        }
      }

      .u-tabbar__content__circle__border {
        background: none !important;
      }
    }
  }
}
</style>
