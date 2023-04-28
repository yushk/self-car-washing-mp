import { GetSTSToken } from "@/api/apis";
import crypto from "crypto-js";
import { Base64 } from "js-base64";
export var uploadImageUrl =
  "https://yourong-sport.oss-cn-hangzhou.aliyuncs.com"; //你的阿里云OSS地址  在你当前小程序的公众号后台的uploadFile 合法域名也要配上这个域名
export var securityToken = "";
export var accessKeyId = "";
export var accessKeySecret = "";
export var timeout = 1;
export var maxSize = 100;

// 获取上传接口需要的参数
export function getUploadParams() {
  const policy = getPolicyBase64();
  const sign = computeSignature(policy);
  return {
    OSSAccessKeyId: accessKeyId,
    policy: policy,
    signature: sign,
    "x-oss-security-token": securityToken,
  };
}

export function getPolicyBase64() {
  let date = new Date();
  // 设置policy过期时间。
  date.setHours(date.getHours() + timeout);
  let srcT = date.toISOString();
  const policyText = {
    expiration: srcT,
    conditions: [
      // 限制上传文件大小。
      ["content-length-range", 0, maxSize * 1024 * 1024],
    ],
  };
  return Base64.encode(JSON.stringify(policyText));
}
// 获取签名
export function computeSignature(policyBase64) {
  return crypto.enc.Base64.stringify(
    crypto.HmacSHA1(policyBase64, accessKeySecret)
  );
}

// 服务端获取上传秘钥 和 临时授权
export async function GetOSSKeyInfo() {
  const res = await GetSTSToken();
  securityToken = res.stsToken;
  accessKeyId = res.accessKeyId;
  accessKeySecret = res.accessKeySecret;
}

// 上传文件  filePath 文件的临时地址 dir 文件夹 生成的文件反正那个文件夹下 方便管理
export function uploadFile(filePath, dir = "videos") {
  return new Promise((resolve, reject) => {
    if (!filePath) {
      reject({
        Code: 501,
        Msg: "上传失败,请稍后再试",
      });
      return;
    }
    // 设置文件存放的地址以及为文件命名 随机数防止文件重名被覆盖
    const aliyunFileKey =
      dir + "/" + new Date().getTime() + Math.floor(Math.random() * 150);
    wx.uploadFile({
      url: uploadImageUrl, //开发者服务器 url
      filePath: filePath, //要上传文件资源的路径
      name: "file", //必须填file
      formData: {
        key: aliyunFileKey, // 设置文件上传至OSS后的文件路径
        success_action_status: "200",
        ...getUploadParams(),
      },
      success: function (res) {
        if (res.statusCode == 200) {
          resolve({
            Code: 200,
            Data: "/" + aliyunFileKey,
          });
        } else {
          reject({
            Code: 501,
            Msg: "上传失败,请稍后再试",
          });
        }
      },
      fail: function (err) {
        reject({
          Code: 501,
          Msg: "上传失败,请稍后再试",
        });
      },
    });
  });
}
