/*
 * @Author: 吴礼钦
 * @Date: 2021-10-27 17:14:04
 * @LastEditTime: 2021-11-07 21:46:43
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \黑马优购\pages\feedback\index.js
 */
/* 
1 点击 “+” 触发tap点击事件
  1 调用小程序内置的 选择图片的 api
  2 获取到 图片的路径  数组
  3 把图片路径 存到 data的变量中
  4 页面就可以根据 图片数组 进行循环显示 自定义组件
2 点击 自定义图片 组件
  1 获取被点击的元素的索引
  2 获取 data中的图片数组
  3 根据索引 数组中删除对应的元素
  4 把数组重新设置回data中
3 点击 “提交”
  1 获取文本域的内容 类似 输入框的获取
    1 data中定义变量 表示 输入框内容
    2 文本域 绑定 输入事件 事件触发的时候 把输入框的值 存入到变量中 
  2 对这些内容 合法性验证
  3 验证通过 用户选择的图片 上传到专门的图片的服务器 返回图片外网的链接
    1 遍历图片数组 
    2 挨个上传
    3 自己再维护图片数组 存放 图片上传后的外网的链接
  4 文本域 和 外网的图片的路径 一起提交到服务器 前端的模拟 不会发送请求到后台。。。 
  5 清空当前页面
  6 返回上一页 
 */
// pages/feedback/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // tab数据
    tabs: [
      {
        id: 0,
        name: "体验问题",
        isClick: true
      },
      {
        id: 1,
        name: "商品商家投诉",
        isClick: false
      }
    ],

    // 存放图片的数组
    tempImgPaths: [],
    // 文本域的内容
    textVal: ""
  },
  // 外网的图片的路径数组
  UpLoadImgs: [],
  /**
   * @description: 点击tab求换选中效果
   * @param {事件对象} e
   *
   */
  handleTabChenge (e) {
    let { index } = e.detail
    let { tabs } = this.data
    tabs.forEach((v, i) => {
      return i === index ? v.isClick = true : v.isClick = false
    })
    this.setData({
      tabs
    })

  },
  /**
   * @description: 点击加号调用内置API 打开图片或者拍照
   * @param {*}
   * @return {*}
   */
  handleChooseImg () {
    wx.chooseImage({
      // 最大获取数量
      count: 9,
      // 图片格式 原图 压缩过的
      sizeType: ['original', 'compressed'],
      // 图片来源 相册 照相机
      sourceType: ['album', 'camera'],
      success: (res => {
        const { tempFilePaths } = res
        this.setData({
          tempImgPaths: [...this.data.tempImgPaths, ...tempFilePaths]
        })
      })
    })

  },
  /**
   * @description:  点击X号图片删除图片
   * @param {事件对象 为了获取到自定义参数} e
   * @return {*}
   */
  handleDelImg (e) {
    // 获取到点击的索引
    const { index } = e.currentTarget.dataset
    console.log(index)
    // 根据索引删除对应的数据
    let { tempImgPaths } = this.data
    tempImgPaths.splice(index, 1)
    this.setData({
      tempImgPaths
    })
  },

  // 获取文本域输入的值
  handleInputChange (e) {
    this.setData({
      textVal: e.detail.value
    })
  },

  // 点击提交按钮的交互
  handleFromSubmit () {
    // 获取文本域的值
    const { textVal, tempImgPaths } = this.data
    // 判断合法性
    if (!textVal) {
      wx.showToast({
        title: '输入不合法',
        mask: true,
        icon: 'none',
      })
      return
    }
    // 合法通过 提交图片
    // 上传文件的 api 不支持 多个文件同时上传  遍历数组 挨个上传 

    // 显示正在等待的图片
    wx.showLoading({
      title: "正在上传中",
      mask: true
    })

    if (tempImgPaths.length != 0) {
      // 显示正在等待的图片
      tempImgPaths.forEach((v, i) => {
        wx.uploadFile({
          // 图片要上传到哪里
          url: 'https://img.coolcr.cn/api/upload',
          // 被上传的文件的路径
          filePath: v,
          // 上传的文件的名称 后台来获取文件  file
          name: 'image',
          // 顺带的文本信息
          formData: {},
          success: (res) => {
            let url = JSON.parse(res.data)
            // 添加到提交后台数据的数组中
            this.UpLoadImgs.push(url)

            //  所有的图片都上传完毕了才触发  
            if (i === tempImgPaths.length - 1) {
              // 成功后关闭加载
              wx.hideLoading()
              console.log("把文本的内容和外网的图片数组 提交到后台中")
              // 清空图片数组 和 文本域内容
              this.setData({
                textVal: "",
                tempImgPaths: []
              })
              // 放返回上一个页面
              wx.navigateBack({
                delta: 1
              })
            }
          }
        })
      })
    } else {
      wx.hideLoading();
      console.log("只是提交了文本");
      wx.navigateBack({
        delta: 1
      });
    }


  }
})