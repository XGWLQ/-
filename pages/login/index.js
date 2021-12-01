/*
 * @Author: your name
 * @Date: 2021-10-27 17:14:04
 * @LastEditTime: 2021-11-12 16:59:49
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \黑马优购\pages\login\index.js
 */
// pages/login/index.js
Page({
  handlegetUserInfo () {
    // const { userInfo } = e.detail
    // // 保存早本地缓存中
    // wx.setStorageSync("userinfo", userInfo)
    // // 弹出提示框
    // wx.showToast({
    //   title: '登录成功'
    // });
    // // 登录成功跳转会个人中心页面
    // wx.navigateBack({
    //   delta: 1
    // });
    wx.getUserProfile({
      desc: '用于个人信息的展示', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        const { userInfo } = res
        // // 保存早本地缓存中
        wx.setStorageSync("userinfo", userInfo)

        // 登录成功跳转会个人中心页面
        wx.navigateBack({
          delta: 1
        })
        wx.showToast({
          title: '登录成功'
        })
      }
    })

  }
})