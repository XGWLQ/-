// 使用封装的请求函数调用数据
import { requset } from '../../request/index.js';
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({
  /**
  * 页面的初始数据
  */
  data: {
    // 查询到的数组
    searchList: [],
    // 按钮的显示影藏
    isFocus: false,
    // 输入框的值
    inpValue: ""
  },
  offTimer: null,
  // 输入框输入值触发事件
  HandleInput (e) {
    // 获取到输入的值
    let { value } = e.detail
    let { isFocus } = this.data
    // 去空格
    const val = value.replace(/\s+/g, "")

    // 有值是按钮显示

    // 根据输入的文字发请求
    // 使用防抖使他搜索别谈频繁
    clearTimeout(this.offTimer)
    this.offTimer = setTimeout(() => {
      this.setData({
        isFocus: val ? isFocus = true : isFocus = false
      })
      this._getQsearch(val)
    }, 1000)
  },
  // 获取查询到的数据
  async _getQsearch (query) {
    const { data } = await requset({ url: '/goods/qsearch', data: { query } })
    const searchList = data.message
    this.setData({
      searchList
    })
  },
  // 按钮的点击时间
  handleCancel () {
    this.setData({
      isFocus: false,
      searchList: [],
      inpValue: ""
    })
  }
})