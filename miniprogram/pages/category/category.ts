import { STATUS_LABEL, byType, loadProducts, type ProductType } from "../../utils/products"
const TABS = [
  { key: "all", label: "全部" },
  { key: "set", label: "套装" },
  { key: "necklace", label: "项链" },
  { key: "ring", label: "戒指" },
  { key: "earring", label: "耳环" },
]
Page({
  data: { tabs: TABS, cat: "all", list: [] as any[] },
  onShow() { this.refresh() },
  refresh() {
    const list = byType(loadProducts(), this.data.cat as "all" | ProductType).map((p) => ({
      ...p, statusLabel: STATUS_LABEL[p.status],
    }))
    this.setData({ list })
  },
  onCat(e: WechatMiniprogram.TouchEvent) { this.setData({ cat: e.currentTarget.dataset.key }, () => this.refresh()) },
  open(e: WechatMiniprogram.TouchEvent) { wx.navigateTo({ url: `/pages/detail/detail?id=${e.currentTarget.dataset.id}` }) },
})
