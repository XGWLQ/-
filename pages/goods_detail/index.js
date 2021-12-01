/* 
1 发送请求获取数据 
2 点击轮播图 预览大图
  1 给轮播图绑定点击事件
  2 调用小程序的api  previewImage 
3 点击 加入购物车
  1 先绑定点击事件
  2 获取缓存中的购物车数据 数组格式 
  3 先判断 当前的商品是否已经存在于 购物车
  4 已经存在 修改商品数据  执行购物车数量++ 重新把购物车数组 填充回缓存中
  5 不存在于购物车的数组中 直接给购物车数组添加一个新元素 新元素 带上 购买数量属性 num  重新把购物车数组 填充回缓存中
  6 弹出提示
4 商品收藏
  1 页面onShow的时候  加载缓存中的商品收藏的数据
  2 判断当前商品是不是被收藏 
    1 是 改变页面的图标
    2 不是 。。
  3 点击商品收藏按钮 
    1 判断该商品是否存在于缓存数组中
    2 已经存在 把该商品删除
    3 没有存在 把商品添加到收藏数组中 存入到缓存中即可
 */
import { requset } from '../../request/index.js';
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 商品详情数据
    goodDetail: {},
    // 判断该商品是否被选中
    isCollect: false
  },

  // 商品对象
  GoodsObj: {},
  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function () {
    // 获取到当前页面的参数
    let curPages = getCurrentPages();
    let page = curPages[curPages.length - 1]
    const { goods_id } = page.options
    this._getGoodDetailList(goods_id)

  },
  async _getGoodDetailList (goods_id) {
    const { data } = await requset({ url: '/goods/detail', data: { goods_id } })
    // 保存商品信息
    this.GoodsObj = data.message


    // 判断缓存中是否有商品的收藏数据
    const collect = wx.getStorageSync("collect") || []
    // 判断当前商品是否被收藏
    let isCollect = collect.some(v => v.goods_id === this.GoodsObj.goods_id)


    //  用到的数据不用那么多，只需要存储用用到的数据
    this.setData({
      goodDetail: {
        goods_name: data.message.goods_name,
        goods_price: data.message.goods_price,
        /* 
        替换符富文本中的 .webp 因为iphone 不支持这种格式
        两种方式 
          1、和后台沟通 能不能换
          2、自己把后缀名替换掉
        
        */
        goods_introduce: data.message.goods_introduce.replace(/\.webp/g, ".jpg"),
        pics: data.message.pics
      },
      isCollect
    })
  },

  // 点击查看大图
  handlePrevewImage (e) {
    /* 
      current: '', // 你点击出来大哪一张图片
      urls: [], //要展示的图片数组
     */
    const { url } = e.currentTarget.dataset

    const urlarr = this.data.goodDetail.pics.map(v => v.pics_mid)
    wx.previewImage({
      current: url,
      urls: [...urlarr],
    });
  },

  // 点击添加商品
  hanbleCartAdd () {
    /**
     * 1、绑定事件
     * 2、获取缓存中的购物车数据
     * 3、判断当前商品是否存在于购物车中
     * 4、如果存在 上平数量加1 
     * 5、不存在 将该商品添加到购物出中
     * 6、存到缓存中
     * 7、弹出提示信息
     */

    // 、获取缓存中的购物车数据 刚开始可能没有
    const cart = wx.getStorageSync("cart") || [];
    // 判断当前商品是否存在于购物车中 
    // 找缓存中是否有改商品
    let index = cart.findIndex(v => v.goods_id === this.GoodsObj.goods_id)

    if (index === -1) {//没有
      // 不存在 将该商品添加到购物出中
      this.GoodsObj.num = 1
      this.GoodsObj.checked = true
      cart.push(this.GoodsObj)
    } else {// 有
      // 如果存在 缓存中对应cart上平数量加1 
      cart[index].num++
    }
    // 、存到缓存中
    wx.setStorageSync('cart', cart)

    // 提示信息
    wx.showToast({
      title: '添加成功',
      icon: 'success',
      // 防抖 防止用户多点 会有1.5秒的缓冲时间
      mask: true
    });
  },

  // 点击收藏商品
  handleCollectShow () {
    let { isCollect } = this.data
    isCollect = !isCollect
    // 1、判断缓存中是否有该数组
    const collect = wx.getStorageSync("collect") || []
    // 2、查索引看在缓存中是否有改商品 如果没有返回-1
    const index = collect.findIndex(v => v.goods_id === this.GoodsObj.goods_id)

    // 判断存不存储
    if (index !== -1) { // 存在商品 把改商品删除
      collect.splice(index, 1)
      this.showToast("取消成功")
    } else {
      // 商品不存在 添加到缓存中
      collect.push(this.GoodsObj)
      this.showToast("收藏成功")
    }
    wx.setStorageSync("collect", collect);
    this.setData({
      isCollect
    })
  },
  //提示框
  showToast (title) {
    wx.showToast({
      title,
      icon: 'succes',
      mask: true
    });
  }


})