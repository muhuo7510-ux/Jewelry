import {
  TYPE_LABEL,
  STATUS_LABEL,
  UNIT_LABEL,
  byType,
  loadProducts,
  type ProductType,
} from "../../utils/products"

const TABS: Array<{ key: "all" | ProductType; label: string }> = [
  { key: "all", label: "全部" },
  { key: "set", label: "套装" },
  { key: "necklace", label: "项链" },
  { key: "ring", label: "戒指" },
  { key: "earring", label: "耳环" },
]

Page({
  data: {
    tabs: TABS,
    filter: "all" as "all" | ProductType,
    list: [] as any[],
  },
  onShow() {
    this.refresh()
  },
  refresh() {
    const products = loadProducts()
    const list = byType(products, this.data.filter).map((p) => ({
      ...p,
      typeLabel: TYPE_LABEL[p.type],
      statusLabel: STATUS_LABEL[p.status],
      unitLabel: UNIT_LABEL[p.rentUnit],
    }))
    this.setData({ list })
  },
  onFilter(e: WechatMiniprogram.TouchEvent) {
    const key = e.currentTarget.dataset.key as "all" | ProductType
    this.setData({ filter: key }, () => this.refresh())
  },
  openDetail(e: WechatMiniprogram.TouchEvent) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({ url: `/pages/detail/detail?id=${id}` })
  },
})
