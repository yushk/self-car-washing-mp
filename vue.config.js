// vue.config.js，如没有此文件则手动创建
module.exports = {
  runtimeCompiler: true,
  transpileDependencies: ["uview-ui"],
  configureWebpack: {
    devServer: {
      // 调试时允许内网穿透，让外网的人访问到本地调试的H5页面
      disableHostCheck: true,
      proxy: {
        "/api": {
          target: "http://localhost:7000/",
          changeOrigin: true,
          pathRewrite: {
            "^/api": "/api",
          },
        },
      },
    },
  },

  chainWebpack: (config) => {
    config.plugin("define").tap((args) => {
      args[0]["process.env"].BUILD_ENV = JSON.stringify(process.env.BUILD_ENV);
      return args;
    });
  },
};
