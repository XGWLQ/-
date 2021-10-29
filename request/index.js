// 请求的次数
let ajaxTime = 0
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