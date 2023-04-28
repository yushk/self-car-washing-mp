import App from "./App.vue";

// #ifndef VUE3
import Vue from "vue";
import store from "./store";
import uView from "uview-ui";
import { result } from "@/config";
import request from "@/utils/request";
import { setDomain, setAxiosInstance } from "@/api/apis";
import mixin from "./common/minx.js";
import util from "./common/util";
Vue.use(uView);
Vue.use(mixin);

setDomain(result.baseUrl);
setAxiosInstance(request);

Vue.config.productionTip = false;
Vue.prototype.$request = request;

App.mpType = "app";
const app = new Vue({
  ...App,
  store,
});
Vue.use(util, app);
app.$mount();
// #endif
