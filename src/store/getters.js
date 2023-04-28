const getters = {
  token: (state) => state.user.token,
  avatar: (state) => state.user.avatar,
  name: (state) => state.user.name,
  nickName: (state) => state.user.nickName,
  roles: (state) => state.user.roles,
  userid: (state) => state.user.userid,
  userInfo: (state) => state.user.userInfo,
  titleBarHeight: (state) => state.user.titleBarHeight,
};
export default getters;
