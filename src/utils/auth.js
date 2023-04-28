const TokenKey = "sport-analyse-Token";

export function getToken() {
  return uni.getStorageSync(TokenKey);
}

export function setToken(token) {
  uni.setStorageSync(TokenKey, token);
}

export function removeToken() {
  return uni.removeStorageSync(TokenKey);
}
