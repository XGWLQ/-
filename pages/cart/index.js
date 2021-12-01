/* 
1 获取用户的收货地址
  1 绑定点击事件
  2 调用小程序内置 api  获取用户的收货地址  wx.chooseAddress

  2 获取 用户 对小程序 所授予 获取地址的  权限 状态 scope
    1 假设 用户 点击获取收货地址的提示框 确定  authSetting scope.address 
      scope 值 true 直接调用 获取收货地址
    2 假设 用户 从来没有调用过 收货地址的api 
      scope undefined 直接调用 获取收货地址
    3 假设 用户 点击获取收货地址的提示框 取消   
      scope 值 false 
      1 诱导用户 自己 打开 授权设置页面(wx.openSetting) 当用户重新给与 获取地址权限的时候 
      2 获取收货地址
    4 把获取到的收货地址 存入到 本地存储中 
2 页面加载完毕
  0 onLoad  onShow 
  1 获取本地存储中的地址数据
  2 把数据 设置给data中的一个变量
3 onShow 
  0 回到了商品详情页面 第一次添加商品的时候 手动添加了属性
    1 num=1;
    2 checked=true;
  1 获取缓存中的购物车数组
  2 把购物车数据 填充到data中
4 全选的实现 数据的展示
  1 onShow 获取缓存中的购物车数组
  2 根据购物车中的商品数据 所有的商品都被选中 checked=true  全选就被选中
5 总价格和总数量
  1 都需要商品被选中 我们才拿它来计算
  2 获取购物车数组
  3 遍历
  4 判断商品是否被选中
  5 总价格 += 商品的单价 * 商品的数量
  5 总数量 +=商品的数量
  6 把计算后的价格和数量 设置回data中即可
6 商品的选中
  1 绑定change事件
  2 获取到被修改的商品对象
  3 商品对象的选中状态 取反
  4 重新填充回data中和缓存中
  5 重新计算全选。总价格 总数量。。。
7 全选和反选
  1 全选复选框绑定事件 change
  2 获取 data中的全选变量 allChecked
  3 直接取反 allChecked=!allChecked
  4 遍历购物车数组 让里面 商品 选中状态跟随  allChecked 改变而改变
  5 把购物车数组 和 allChecked 重新设置回data 把购物车重新设置回 缓存中 
8 商品数量的编辑
  1 "+" "-" 按钮 绑定同一个点击事件 区分的关键 自定义属性 
    1 “+” "+1"
    2 "-" "-1"
  2 传递被点击的商品id goods_id
  3 获取data中的购物车数组 来获取需要被修改的商品对象
  4 当 购物车的数量 =1 同时 用户 点击 "-"
    弹窗提示(showModal) 询问用户 是否要删除
    1 确定 直接执行删除
    2 取消  什么都不做 
  4 直接修改商品对象的数量 num
  5 把cart数组 重新设置回 缓存中 和data中 this.setCart
9 点击结算
  1 判断有没有收货地址信息
  2 判断用户有没有选购商品
  3 经过以上的验证 跳转到 支付页面！ 
 */
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isShowAddressBtn: true,
    // 存储收货地址
    address: {},
    // 购物车中的数据
    cart: [],
    // 底部全选按钮的变量
    allChecked: false,
    // 总价格 总数量
    totalPrice: 0,
    totalNum: 0
  },
  // 页面显示的时候
  onShow () {
    // 1、判断本地存储是否有收货地址
    const address = wx.getStorageSync("address")
    // 获取本地存储中的购物车数据
    const cart = wx.getStorageSync('cart') || []
    // 将地址存储起来
    this.setData({ address })
    this.setPrice(cart)

  },
  // 小程序获取地址方法
  handleChooseAddress () {
    // 有时候用户点击可可能是取消 后面就获取不到地址了
    // 1、获取状态
    wx.getSetting({
      success: (res) => {
        const scope = res.authSetting["scope.address"]
        // 点击确定 或者 没有调用过api
        if (!scope) {
          // 授权设置页面(wx.openSetting)
          wx.openSetting({
            success: (res) => { this.getChooseAddress() }
          })
        }
        this.getChooseAddress()
      }
    })
  },
  // 商品单选按钮的选中和重新计算价格和数量
  handleItemChange (e) {
    // 获取到选中商品的id
    const { id } = e.currentTarget.dataset
    // 获取自己的购物车出具
    const { cart } = this.data
    // 商品对象的选中状态 取反
    const index = cart.findIndex(v => v.goods_id === id)

    // 如果商品的数量为0时，用户点击单选框时标识他想添加这件商品 把他的num 变为1
    if (cart[index].num === 0) {
      cart[index].num = 1
    }
    cart[index].checked = !cart[index].checked

    this.setPrice(cart)
  },

  // 全选按钮的方法
  handleAllCheck () {
    // 1 获取data中的数据
    let { cart, allChecked } = this.data;
    // 2 修改值
    allChecked = !allChecked;
    // 3 循环修改cart数组 中的商品选中状态
    cart.forEach(v => v.checked = allChecked);

    this.setPrice(cart)
  },

  // 点击商品加减按钮进行商品数量和总价更改
  goodNumEdit (e) {
    // flag 为true 标识商品数量加1 反之建议
    const { flag, id } = e.currentTarget.dataset
    // 获取data中的购物车数据
    let { cart } = this.data
    // 找到修改对应商品的索引
    const index = cart.findIndex(v => v.goods_id === id)
    // 根据传过来的参数进行调用
    if (flag === 'true') {
      cart[index].num++
    } else {
      cart[index].num--
      // 当商品数量等于0时 弹出提示框
      if (cart[index].num == 0) {
        wx.showModal({
          title: '是否删除商品？',
          content: '当前商品数量为0',
          success: (result) => {
            if (result.confirm) {
              cart.splice(index, 1)
            } else {
              // 点击取消后 商品的复选框取消掉
              cart[index].checked = false
            }
            this.setPrice(cart)
          }
        })
        // 商品在零后没法在减少了
      } else if (cart[index].num < 0) {
        cart[index].num = 0
        this.showToast("该宝贝不能减少了哟~")
      }
    }
    this.setPrice(cart)
  },

  //商品的结算
  orderPayTap () {
    // 1 判断有没有收货地址信息
    const { address, totalNum } = this.data
    // 2 判断用户有没有选购商品
    if (totalNum === 0) {
      return this.showToast("您还没有选购商品")
    }
    if (!address.userName) {
      // 没有提示用户
      return this.showToast("请先添加收货地址")
    }

    // 3 经过以上的验证 跳转到 支付页面！ 
    wx.navigateTo({ url: '/pages/pay/index' })
  },

  // 封装获取地址的api
  getChooseAddress () {
    wx.chooseAddress({
      success: (res) => {
        // 保存到本地存储
        wx.setStorageSync("address", res);
      }
    })
  },
  // 封装修改商品价格数量的方法
  setPrice (cart) {

    // 根据购物车中的商品数据 所有的商品都被选中 checked=true  全选就被选中
    /* 
    every 数组方法会遍历 接收一个数组每一个回调都返回true 那么 方法就返回true 
    只要有一项返回false 方法就中断循环返回 false
    如果遍历的是空数组 那他返回的也是true
    */
    // const allChecked = cart.length?cart.every(v=>v.checked):false
    // 总价格 总数量
    let allChecked = true
    let totalPrice = 0
    let totalNum = 0
    cart.forEach(v => {
      if (v.checked) {
        totalPrice += v.num * v.goods_price
        totalNum += v.num
      } else {
        allChecked = false
      }
    })
    // 上面数组没有数据的时候 不执行 所以要改变他的值
    allChecked = cart.length == 0 ? false : allChecked
    // 将地址存储起来
    this.setData({
      cart,
      allChecked,
      totalPrice,
      totalNum
    })
    // 重新保存缓存
    wx.setStorageSync("cart", cart)
  },
  // 封装提示用户的弹窗
  showToast (title) {
    wx.showToast({
      title: title,
      icon: 'none',
    })
  }
})