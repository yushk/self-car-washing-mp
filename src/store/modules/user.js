import { Login, Logout, GetUserInfo, WXLogin } from "@/api/apis";
import { getToken, setToken, removeToken } from "@/utils/auth";

const getDefaultState = () => {
  return {
    token: getToken(),
    userInfo: {},
    name: "",
    nickName: "",
    userid: "",
    avatar: "",
    introduction: "",
    roles: [],
    titleBarHeight: 0,
  };
};

const state = getDefaultState();

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState());
  },
  SET_TOKEN: (state, token) => {
    state.token = token;
  },
  SET_INTRODUCTION: (state, introduction) => {
    state.introduction = introduction;
  },
  SET_NAME: (state, { name, userid }) => {
    state.name = name;
    state.userid = userid;
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar;
  },
  SET_NICKNAME: (state, nickName) => {
    state.nickName = nickName;
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles;
  },
  SET_BARH: (state, e) => {
    state.titleBarHeight = e;
  },
  SET_USERINFO: (state, e) => {
    state.userInfo = e;
  },
};

// 全局方法
const actions = {
  async setUserData({ state, commit }, data) {
    const { role, name, id } = data;
    if (!response) {
      return reject("Verification failed, please Login again.");
    }
    // 必须保证不是一个空的数组
    if (!role) {
      reject("getInfo: roles must be a non-null array!");
    }
    // 修改用户登录信息 调用 commit方法
    commit("SET_ROLES", [role]);
    commit("SET_NAME", { name, userid: id });
    uni.setStorageSync("userInfo", data);
  },
  // user login  登录方法
  login({ commit }, userInfo) {
    const { phone, password } = userInfo;
    return new Promise((resolve, reject) => {
      Login({ username: phone.trim(), password: password })
        .then((data) => {
          commit("SET_TOKEN", data.token_type + " " + data.access_token);
          setToken(data.token_type + " " + data.access_token);
          resolve();
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  // user login  登录方法
  wxlogin({ commit }, code) {
    return new Promise((resolve, reject) => {
      WXLogin({ code })
        .then((data) => {
          commit("SET_TOKEN", data.token_type + " " + data.access_token);
          setToken(data.token_type + " " + data.access_token);
          resolve();
        })
        .catch((error) => {
          reject(error);
        });
    });
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      GetUserInfo()
        .then((response) => {
          if (!response) {
            removeToken();
            return reject("Verification failed, please Login again.");
          }
          const { role, name, id, avatar, nickName } = response;
          // 修改用户登录信息 调用 commit方法
          commit("SET_USERINFO", response);
          uni.setStorageSync("userInfo", JSON.stringify(response));
          if (role) {
            commit("SET_ROLES", [role]);
          }
          commit("SET_NAME", { name, userid: id });
          commit("SET_NICKNAME", nickName);
          commit("SET_AVATAR", avatar);
          resolve({ role: role, name: name });
        })
        .catch((error) => {
          reject(error);
        });
    });
  },

  // user logout  退出登录部分
  logout({ commit, state, dispatch }) {
    return new Promise((resolve, reject) => {
      Logout(state.token)
        .then(() => {
          commit("SET_TOKEN", "");
          commit("SET_ROLES", []);
          removeToken(); // must remove  token  first
          commit("SET_USERINFO", {});
          // reset visited views and cached views
          // to fixed https://github.com/PanJiaChen/vue-element-admin/issues/2485
          // dispatch('tagsView/delAllViews', null, { root: true })
          // commit('RESET_STATE')
          resolve();
        })
        .catch((error) => {
          reject(error);
        });
    });
  },

  // remove token 清除登录信息 token什么的
  resetToken({ commit }) {
    return new Promise((resolve) => {
      commit("SET_TOKEN", "");
      commit("SET_ROLES", []);
      removeToken(); // must remove  token  first
      resolve();
    });
  },
  setBarHeight({ commit }, e) {
    return new Promise((resolve) => {
      commit("SET_BARH", e);
      resolve();
    });
  },
  setUserInfo({ commit }, e) {
    return new Promise((resolve) => {
      let { nickName, avatarUrl } = e;
      commit("SET_NICKNAME", nickName);
      commit("SET_AVATAR", avatarUrl);
      resolve();
    });
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
