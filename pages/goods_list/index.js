import { requset } from '../../request/index.js';
import regeneratorRuntime, { async } from '../../lib/runtime/runtime';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // tab数据
    tabs: [
      {
        id: 0,
        name: "综合",
        isClick: true
      },
      {
        id: 1,
        name: "销量",
        isClick: false
      },
      {
        id: 2,
        name: "价格",
        isClick: false
      }
    ],
    //商品列表数据
    goodList: [],
    // 获取数据需要的参数
    params: {
      query: "",
      cid: "",
      pagenum: 1,
      pagesize: 10
    },
    // 总页数
    totalNum: 1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.params.cid = options.cid
    this._getGoodList()
  },

  // 点击tab改变
  handleTabChenge (e) {
    /* 
    1、获取tas数据
    2、获取被点击的title索引
    3、根据缩影修改tas中isClick的值
    */
    const { index } = e.detail
    let { tabs } = this.data
    tabs.forEach((v, i) => {
      return i === index ? v.isClick = true : v.isClick = false
    })
    this.setData({
      tabs
    })
  },
  // 获取上平列表数据
  async _getGoodList () {
    const { data: res } = await requset({ url: '/goods/search', data: { ...this.data.params } })
    let num = res.message.total
    this.totalNum = Math.ceil(num / this.data.params.pagesize)
    this.setData({
      // 拼接的数组
      goodList: [...this.data.goodList, ...res.message.goods]
    })

    // 关闭下拉刷新按钮 如果没有调用下拉刷新窗口 直接关闭也不会影响
    wx.stopPullDownRefresh();
  },
  /**
   * 页面上拉触底事件的处理函数
   * 1、找到滚动触底事件
   * 2、判断有没有下一页数据
   *  1) 计算总页数 = 总条数 / 页面容量 Math.ceil(total / pagesize )
   *  2) 获取当前页码 pagenum
   *  3) 判断当前页码是否大于等于总页数 （表示没有下一页数据）
   * 3、如果没有下一页数据跳出一个提示信息
   * 4、如果还有下一页就 加载出下一页 
   *  对当前页码++
   *  重新发送请求
   *  获取回来后的数据 要拼接上去不能覆盖
   */
  onReachBottom: function () {
    if (this.data.params.pagenum >= this.totalNum) { // 没有数据了
      wx.showToast({ title: '没有下一页了' });
    } else {

      this.data.params.pagenum++
      this._getGoodList()
    }
  },
  /**
   * 页面下拉的刷新方法
   * 1、把商品数组清空
   * 2、把页码中重置为 1
   * 3、重新获取数据
   */
  onPullDownRefresh () {
    this.data.params.pagenum = 1
    this.data.goodList = []
    this._getGoodList()
  }

})