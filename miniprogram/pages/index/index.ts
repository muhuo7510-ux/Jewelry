import { TYPE_LABEL, STATUS_LABEL, byType, loadProducts, type ProductType } from "../../utils/products"
const TABS = [
  { key: "all", label: "全部" },
  { key: "set", label: "套装" },
  { key: "necklace", label: "项链" },
  { key: "ring", label: "戒指" },
  { key: "earring", label: "耳环" },
]
function decorate(list: ReturnType<typeof loadProducts>) {
  return list.map((p) => ({ ...p, typeLabel: TYPE_LABEL[p.type], statusLabel: STATUS_LABEL[p.status] }))
}
Page({
  data: { tabs: TABS, cat: "all", query: "", list: [] as any[] },
  onShow() { this.refresh() },
  refresh() {
    const cat = this.data.cat as "all" | ProductType
    const q = (this.data.query || "").trim()
    const list = decorate(byType(loadProducts(), cat)).filter((p) => !q || p.name.indexOf(q) >= 0)
    this.setData({ list })
  },
  onQuery(e: WechatMiniprogram.Input) { this.setData({ query: e.detail.value }, () => this.refresh()) },
  onCat(e: WechatMiniprogram.TouchEvent) { this.setData({ cat: e.currentTarget.dataset.key }, () => this.refresh()) },
  open(e: WechatMiniprogram.TouchEvent) { wx.navigateTo({ url: `/pages/detail/detail?id=${e.currentTarget.dataset.id}` }) },
})
