import axios from "axios";
import store from "@/store";
import { getToken, removeToken } from "@/utils/auth";

// create an axios instance
const service = axios.create({
  timeout: 5000, // request timeout
});

// request interceptor
service.interceptors.request.use(
  (config) => {
    if (store.getters.token) {
      config.headers["authorization"] = getToken();
    }
    return config;
  },
  (error) => {
    console.log(error); // for debug
    return Promise.reject(error);
  }
);

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
   */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  (response) => {
    const res = response.data;
    if (res.code) {
      if (res.code === 401) {
        // to re-login
        store.dispatch("user/resetToken").then(() => {
          uni.navigateTo({ url: "/pages/login/login" });
        });
        return Promise.reject(new Error(res.message || "Error"));
      }
      return res;
    } else {
      return res;
    }
  },
  (error) => {
    if (error.code === 401) {
      removeToken();
      uni.reLaunch({
        url: "/pages/login/login",
      });
    }
    return Promise.reject(error);
  }
);

//真机获取

axios.defaults.adapter = function (config) {
  // 解决小程序不支持form data
  if (config.headers["Content-Type"] === "application/x-www-form-urlencoded") {
    let { __URLSearchParams__ } = JSON.parse(config.data);
    config.data = new URLSearchParams(__URLSearchParams__).toString();
  }
  return new Promise((resolve, reject) => {
    var settle = require("axios/lib/core/settle");
    var buildURL = require("axios/lib/helpers/buildURL");
    uni.request({
      method: config.method.toUpperCase(),
      url: buildURL(
        config.baseURL + config.url,
        config.params,
        config.paramsSerializer
      ),
      header: config.headers,
      data: config.data,
      dataType: config.dataType,
      responseType: config.responseType,
      sslVerify: config.sslVerify,
      complete: function complete(response) {
        response = {
          data: response.data,
          status: response.statusCode,
          errMsg: response.errMsg,
          header: response.header,
          config: config,
        };
        settle(resolve, reject, response);
      },
      success: function success(response) {
        response = {
          data: response.data,
          status: response.statusCode,
          errMsg: response.errMsg,
          header: response.header,
          config: config,
        };
        settle(resolve, reject, response);
      },
      fail: function fail(response) {
        console.log("fail response::::", response);
        response = {
          data: response.data,
          status: response.statusCode,
          errMsg: response.errMsg,
          header: response.header,
          config: config,
        };
        settle(resolve, reject, response);
      },
    });
  });
};

export default service;
