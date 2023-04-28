const install = (Vue, vm) => {
  // 将各个定义的接口名称，统一放进对象挂载到vm.$u.api(因为vm就是this，也即this.$u.api)下
  vm.$u.util = {
    friendlyDate(timestamp) {
      var formats = {
        year: "%n% 年前",
        month: "%n% 月前",
        day: "%n% 天前",
        hour: "%n% 小时前",
        minute: "%n% 分钟前",
        second: "%n% 秒前",
      };

      var now = Date.now();
      var seconds = Math.floor((now - timestamp) / 1000);
      var minutes = Math.floor(seconds / 60);
      var hours = Math.floor(minutes / 60);
      var days = Math.floor(hours / 24);
      var months = Math.floor(days / 30);
      var years = Math.floor(months / 12);

      var diffType = "";
      var diffValue = 0;
      if (years > 0) {
        diffType = "year";
        diffValue = years;
      } else {
        if (months > 0) {
          diffType = "month";
          diffValue = months;
        } else {
          if (days > 0) {
            diffType = "day";
            diffValue = days;
          } else {
            if (hours > 0) {
              diffType = "hour";
              diffValue = hours;
            } else {
              if (minutes > 0) {
                diffType = "minute";
                diffValue = minutes;
              } else {
                diffType = "second";
                diffValue = seconds === 0 ? (seconds = 1) : seconds;
              }
            }
          }
        }
      }
      return formats[diffType].replace("%n%", diffValue);
    },
    controlSize(str, count) {
      if (str) {
        return str.length > count ? str.substr(0, count) + "..." : str;
      } else {
        return "";
      }
    },
    goCoursePage(e,type){
      console.log('item',e)
      if(type==='course'){
        uni.navigateTo({
          url:`/pages/subpackages/student/course_page?courseid=${e.id}`
        })
      }else{
        uni.navigateTo({
          url:`/pages/subpackages/student/course_page?courseid=${e.work_id}&workid=${e.id}`
        })
      }
    },
    workType: { 0: "未完成", 1: "已完成" },
    parseTime(time, cFormat) {
      if (arguments.length === 0 || !time) {
        return null;
      }
      const format = cFormat || "{y}-{m}-{d} {h}:{i}:{s}";
      let date;
      if (typeof time === "object") {
        date = time;
      } else {
        if (typeof time === "string") {
          if (/^[0-9]+$/.test(time)) {
            // support "1548221490638"
            time = parseInt(time);
          } else {
            // support safari
            // https://stackoverflow.com/questions/4310953/invalid-date-in-safari
            time = time.replace(new RegExp(/-/gm), "/");
          }
        }

        if (typeof time === "number" && time.toString().length === 10) {
          time = time * 1000;
        }
        date = new Date(time);
      }
      const formatObj = {
        y: date.getFullYear(),
        m: date.getMonth() + 1,
        d: date.getDate(),
        h: date.getHours(),
        i: date.getMinutes(),
        s: date.getSeconds(),
        a: date.getDay(),
      };
      const time_str = format.replace(/{([ymdhisa])+}/g, (result, key) => {
        const value = formatObj[key];
        // Note: getDay() returns 0 on Sunday
        if (key === "a") {
          return ["日", "一", "二", "三", "四", "五", "六"][value];
        }
        return value.toString().padStart(2, "0");
      });
      return time_str;
    },
  };
};

export default {
  install,
};
