import { giveBack, loadOrders } from "../../utils/products"
Page({
  data: { orders: [] as any[] },
  onShow() { this.setData({ orders: loadOrders() }) },
  back(e: WechatMiniprogram.TouchEvent) {
    giveBack(e.currentTarget.dataset.id as string)
    this.setData({ orders: loadOrders() })
    wx.showToast({ title: "已归还", icon: "none" })
  },
})
