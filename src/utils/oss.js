import OSS from "ali-oss";
import { GetSTSToken } from "@/api/apis";
// import sparkMD5 from 'spark-md5'

export var store = null;
export var expiration_time = "";
export async function OSSClient() {
  if (store === null) {
    const { accessKeyId, accessKeySecret, stsToken, expiration } =
      await GetSTSToken();
    expiration_time = expiration;
    // eslint-disable-next-line require-atomic-updates
    store = new OSS({
      // 从STS服务获取的临时访问密钥（AccessKey ID和AccessKey Secret）。
      accessKeyId,
      accessKeySecret,
      // 从STS服务获取的安全令牌（SecurityToken）。
      stsToken,
      // 填写Bucket名称。
      bucket: "sport-beijing",
      // 填写Bucket所在地域。以华东1（杭州）为例，yourRegion填写为oss-cn-hangzhou。
      region: "oss-cn-beijing",
    });
  }
  return store;
}

async function fileHash(file) {
  const chunks = [];
  let cur = 0;
  const size = 1 * 1024 * 1024;
  var worker;
  while (cur < file.size) {
    // this.file 为 e.target.files[0]
    chunks.push({ index: cur, file: file.slice(cur, cur + size) }); // 1MB切片
    cur += size;
  }
  return new Promise((resolve) => {
    resolve(uni.$u.guid(20));
    // worker = wx.createWorker("/static/hash.js"); // 开启一个外部进程
    // worker.postMessage({ chunks }); // 给外部进程传递信息
    // worker.onmessage = (e) => {
    //   // 接收外部Worker回传的信息
    //   const { progress, hash } = e.data;
    //   console.log(Number(progress.toFixed(2))); // 计算hash值的进度条
    //   if (hash) {
    //     resolve(hash); // 得到计算出来的hash
    //   }
    // };
  });
}

// async function fileHash(file) {
//   const chunks = []
//   const size = 1 * 1024 * 1024
//   let cur = 0
//   while (cur < file.size) { // this.file 为 e.target.files[0]
//     chunks.push({ index: cur, file: file.slice(cur, cur + size) }) // 1MB/片
//     cur += size
//   }
//   return new Promise(resolve => {
//     const spark = new sparkMD5.ArrayBuffer()
//     let count = 0

//     const appendToSpark = async file => {
//       return new Promise(resolve => {
//         const reader = new FileReader()
//         reader.readAsArrayBuffer(file)
//         reader.onload = e => {
//           spark.append(e.target.result)
//           resolve()
//         }
//       })
//     }
//     const workLoop = async deadline => {
//       while (count < chunks.length && deadline.timeRemaining() > 1) {
//         // 浏览器存在空闲时间
//         await appendToSpark(chunks[count].file)
//         count++
//         if (count < chunks.length) {
//           console.log(Number(((100 * count) / chunks.length).toFixed(2)))
//         } else {
//           resolve(spark.end())
//         }
//       }
//       window.requestIdleCallback(workLoop) // 给 workLoop 函数一个浏览器状态参数 deadline
//     }
//     window.requestIdleCallback(workLoop) // 给 workLoop 函数一个浏览器状态参数 deadline
//   })
// }

export async function upload({ file, dir, successCallback, errCallBack }) {
  const fileName = file.name || "xxx.mp4";
  const uuid = await fileHash(file);
  if (dir.substring(dir.length - 1, 1) !== "/") {
    dir += "/";
  }
  console.log(dir + uuid + fileName.substring(fileName.lastIndexOf(".")));
  store
    .put(dir + uuid + fileName.substring(fileName.lastIndexOf(".")), file)
    .then(
      (res) => {
        successCallback(res);
      },
      (err) => {
        console.error("upload error", err);
        errCallBack(err);
      }
    )
    .catch((err) => {
      console.error("upload error", err.response);
      errCallBack(err);
    });
}
