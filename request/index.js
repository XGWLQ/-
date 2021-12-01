// 请求的次数
let ajaxTime = 0
// 需要获取用户的token 是否已经登录了
const token = wx.getStorageSync("token")
// 2、请求头
const header = { Authorization: token }
export const requset = (params) => {
	ajaxTime++
	wx.showLoading({
		title: "加载中",
		mask: true,
	});
	// 统一公共路径
	const baseURl = 'https://api-hmugo-web.itheima.net/api/public/v1'
	return new Promise((reslove, reject) => {
		wx.request({
			...params,
			header,
			url: baseURl + params.url,
			success: (result) => {
				reslove(result)
			},
			fail: (err) => {
				reject(err)
			},
			complete: () => {
				ajaxTime--
				if (ajaxTime === 0) {
					wx.hideLoading();
				}
			}
		});
	})
}