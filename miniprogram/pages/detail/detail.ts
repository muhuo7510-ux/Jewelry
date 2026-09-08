import {
  TYPE_LABEL,
  STATUS_LABEL,
  UNIT_LABEL,
  findProduct,
  loadProducts,
} from "../../utils/products"

Page({
  data: {
    product: null as any,
    typeLabel: "",
    statusLabel: "",
    unitLabel: "",
  },
  onLoad(query: Record<string, string | undefined>) {
    const id = query.id || ""
    const product = findProduct(loadProducts(), id)
    if (!product) {
      wx.showToast({ title: "商品不存在", icon: "none" })
      return
    }
    this.setData({
      product,
      typeLabel: TYPE_LABEL[product.type],
      statusLabel: STATUS_LABEL[product.status],
      unitLabel: UNIT_LABEL[product.rentUnit],
    })
  },
  consult() {
    const p = this.data.product
    if (!p) return
    const text = `你好，想咨询「${p.name}」租赁，租金 ¥${p.rentPrice}/${this.data.unitLabel}，当前${this.data.statusLabel}`
    wx.setClipboardData({
      data: text,
      success: () => wx.showToast({ title: "已复制咨询文案", icon: "none" }),
    })
  },
})
