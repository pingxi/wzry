const config = require('./config/config.js');

App({
  globalData: {
    info:''
  },
  onLaunch: function () {
    this.logIn();
    this.getdata();
  },
  logIn: function () {
    console.log("logInloginlogin");
    return new Promise(function (resolve, reject) {
      wx.login({
        success: (res) => {
          let code = res.code
          console.log(code);
          if (code) {
                wx.setStorageSync('user', res.userInfo)
                wx.request({
                  url: `${config.api}/login`,
                  method: 'POST',
                  data: {
                    code: code
                  },
                  header: {
                    'content-type': 'application/json'
                  },
                  success: function (res) {
                    console.log(res.data.token)
                    wx.setStorageSync('token', res.data.token)
                    resolve(res)
                  }
                })
          } else {
            console.log('获取用户登录态失败！' + res.errMsg)
            reject(err)
          }
        }
      });
    })
    
  },
  getdata: function () {
    var that = this;
    wx.request({
      url: `${config.api}`,
      method: 'GET',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        that.globalData.info = res.data.model[0]
      }
    })
  },
  checkToken: function () {
    console.log('Promise');
    const token = wx.getStorageSync('token')
    return new Promise(function (resolve, reject) {
      wx.request({
        url: `${config.api}/auth`,
        header: {
          'authorization': token
        },
        method: 'POST',
        success(res) {
          console.log(res);
          resolve(res)
        },
        fail(err) {
          console.log(err);
          reject(err)
        }
      })
    })
  }
})
