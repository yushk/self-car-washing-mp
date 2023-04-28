import { mapGetters } from "vuex";
export default {
  install(Vue) {
    Vue.mixin({
      computed: {
        ...mapGetters({
          roles: "roles",
          userid: "userid",
          username: "nickName",
          titleBarHeight: "titleBarHeight",
          userInfo: "userInfo",
          avatar: "avatar",
        }),
      },
    });
  },
};
