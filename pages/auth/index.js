// 使用封装的请求函数调用数据
import { requset } from '../../request/index.js';
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({

  /**
   * 页面的初始数据
   */
  data: {
  },

  handlegetUserInfo () {
    // 获取需要的参数
    let params = {}
    wx.getUserProfile({
      desc: '用于付款授权', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        const { encryptedData, rawData, iv, signature } = res
        // 获取登录code
        wx.login({
          timeout: 10000,
          success: async (result) => {
            const { code } = result
            params = {
              encryptedData,
              rawData,
              iv,
              signature,
              code
            }
            // 要有这个要用企业账号所以没有token
            let token = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjIzLCJpYXQiOjE1NjQ3MzAwNzksImV4cCI6MTAwMTU2NDczMDA3OH0.YPt-XeLnjV-_1ITaXGY2FhxmCe4NvXuRnRB8OMCfnPo"
            // 保存自己的token
            wx.setStorageSync("token", token)

            // 跳转会上一页面
            wx.navigateBack({
              delta: 1
            })
          }
        })
      }
    })
  }
})