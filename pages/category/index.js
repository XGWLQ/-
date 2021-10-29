// 使用封装的请求函数调用数据
import { requset } from '../../request/index.js';
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({
  /**
   * 页面的初始数据
   */
  data: {
    // 左侧菜单
    leftItem: [],
    // 右侧菜单
    rigthItem: [],
    // 被点击的菜单
    currenIndex: 0,
    // 每次点击左侧菜单时右侧距离顶部的位置
    scrollTop: 0

  },
  // 整体获取到的数据
  cateList: [],
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    /* 
    0 web中的本地存储和 小程序中的本地存储的区别
      1 写代码的方式不一样了 
        web: localStorage.setItem("key","value") localStorage.getItem("key")
    小程序中: wx.setStorageSync("key", "value"); wx.getStorageSync("key");
      2:存的时候 有没有做类型转换
        web: 不管存入的是什么类型的数据，最终都会先调用以下 toString(),把数据变成了字符串 再存入进去
      小程序: 不存在 类型转换的这个操作 存什么类似的数据进去，获取的时候就是什么类型
    1 先判断一下本地存储中有没有旧的数据
      {time:Date.now(),data:[...]}
    2 没有旧数据 直接发送新请求 
    3 有旧的数据 同时 旧的数据也没有过期 就使用 本地存储中的旧数据即可
     */
    // 1 先判断一下本地存储中有没有旧的数据
    const cateList = wx.getStorageSync("cateLists");
    // 判断有没有数据
    if (!cateList) { //就获取
      this._getCateList()
    } else { //有数据
      if (Date.now() - cateList.timer > 1000 * 10) {//判断是否超时 如果超时重新获取
        this._getCateList()
      } else { // 有数据没超时使用旧数据
        console.log("有数据没超时使用旧数据");
        this.cateList = cateList.data
        let leftItem = this.cateList.map((item) => { return item.cat_name })
        let rigthItem = this.cateList[0].children;
        this.setData({
          leftItem,
          rigthItem
        })
      }

    }

  },
  // 获取菜单数据
  async _getCateList () {
    // 没修改之前
    // requset({ url: "/categories" })
    //   .then(res => {
    //     this.cateList = res.data.message
    //     // 获取到数据 使用本地存储存起来
    //     wx.setStorageSync('cateLists', { timer: Date.now(), data: this.cateList });

    //     let leftItem = this.cateList.map((item) => { return item.cat_name })
    //     let rigthItem = this.cateList[0].children;
    //     this.setData({
    //       leftItem,
    //       rigthItem
    //     })
    //   })
    // 修改之后
    const {data} = await requset({ url: "/categories" })
    this.cateList = data.message
    // 获取到数据 使用本地存储存起来
    wx.setStorageSync('cateLists', { timer: Date.now(), data: this.cateList });

    let leftItem = this.cateList.map((item) => { return item.cat_name })
    let rigthItem = this.cateList[0].children;
    this.setData({
      leftItem,
      rigthItem
    })
  },
  // 点击左侧菜单改变数据
  handleIItemTap (e) {
    /* 
    1、获取左侧菜单索引
    2、给currenIndex设置获取到的索引值
    3、动态改变 右侧商品信息
     */
    let { index } = e.currentTarget.dataset
    let rigthItem = this.cateList[index].children;
    this.setData({
      currenIndex: index,
      rigthItem,
      // 重新设置每次点击左侧菜单时右侧距离顶部的位置
      scrollTop: 0
    })
  }
})