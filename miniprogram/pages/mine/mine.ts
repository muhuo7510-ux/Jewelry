import { loadOrders, loadProducts } from "../../utils/products"
Page({
  data: { renting: 0, idle: 0 },
  onShow() {
    const orders = loadOrders()
    const listed = loadProducts().filter((p) => p.listed)
    this.setData({
      renting: orders.filter((o) => o.state === "renting").length,
      idle: listed.filter((p) => p.status === "idle").length,
    })
  },
})
