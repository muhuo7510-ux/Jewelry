import { TYPE_LABEL, STATUS_LABEL, findProduct, loadProducts, rentProduct } from "../../utils/products"
Page({
  data: {
    product: null as any,
    typeLabel: "",
    statusLabel: "",
    days: 3,
    dayOptions: [3, 7, 15],
    total: 0,
  },
  onLoad(query: Record<string, string | undefined>) {
    this.id = query.id || ""
    this.load()
  },
  id: "",
  load() {
    const product = findProduct(loadProducts(), this.id)
    if (!product) {
      wx.showToast({ title: "商品不存在", icon: "none" })
      return
    }
    this.setData({
      product,
      typeLabel: TYPE_LABEL[product.type],
      statusLabel: STATUS_LABEL[product.status],
      total: product.rentPrice * this.data.days,
    })
  },
  pick(e: WechatMiniprogram.TouchEvent) {
    const days = Number(e.currentTarget.dataset.d)
    const product = this.data.product
    this.setData({ days, total: product ? product.rentPrice * days : 0 })
  },
  rent() {
    if (!rentProduct(this.id, this.data.days)) {
      wx.showToast({ title: "这件正在出租", icon: "none" })
      this.load()
      return
    }
    wx.showToast({ title: "已下单", icon: "none" })
    wx.redirectTo({ url: "/pages/orders/orders" })
  },
})
