import {
  PRODUCT_TYPES,
  TYPE_LABEL,
  STATUS_LABEL,
  UNIT_LABEL,
  SEED_PRODUCTS,
  blankProduct,
  isAuthed,
  loadProducts,
  login,
  logout,
  removeProduct,
  saveProducts,
  upsertProduct,
  type Product,
  type ProductType,
  type RentUnit,
} from "../../utils/products"

const STATUS_OPTIONS = ["空闲", "租赁中"]
const TYPE_LABELS = PRODUCT_TYPES.map((t) => TYPE_LABEL[t])
const UNIT_KEYS: RentUnit[] = ["day", "time"]
const UNIT_LABELS = UNIT_KEYS.map((u) => UNIT_LABEL[u])

Page({
  data: {
    authed: false,
    pin: "",
    products: [] as any[],
    listedCount: 0,
    idleCount: 0,
    rentedCount: 0,
    statusOptions: STATUS_OPTIONS,
    typeLabels: TYPE_LABELS,
    unitLabels: UNIT_LABELS,
    editing: false,
    form: {} as any,
    typeIndex: 0,
    unitIndex: 0,
  },
  onShow() {
    this.setData({ authed: isAuthed() })
    if (this.data.authed) this.refresh()
  },
  refresh() {
    const products = loadProducts().map((p) => ({
      ...p,
      typeLabel: TYPE_LABEL[p.type],
      statusLabel: STATUS_LABEL[p.status],
      statusIndex: p.status === "idle" ? 0 : 1,
    }))
    const listed = products.filter((p) => p.listed)
    this.setData({
      products,
      listedCount: listed.length,
      idleCount: listed.filter((p) => p.status === "idle").length,
      rentedCount: listed.filter((p) => p.status === "rented").length,
    })
  },
  onPin(e: WechatMiniprogram.Input) {
    this.setData({ pin: e.detail.value })
  },
  doLogin() {
    if (!login(this.data.pin)) {
      wx.showToast({ title: "口令不正确", icon: "none" })
      return
    }
    this.setData({ authed: true, pin: "" })
    this.refresh()
  },
  doLogout() {
    logout()
    this.setData({ authed: false })
  },
  onReset() {
    saveProducts(JSON.parse(JSON.stringify(SEED_PRODUCTS)))
    this.refresh()
    wx.showToast({ title: "已恢复示例", icon: "none" })
  },
  onStatus(e: WechatMiniprogram.PickerChange) {
    const id = e.currentTarget.dataset.id as string
    const idx = Number(e.detail.value)
    const list = loadProducts()
    const item = list.find((p) => p.id === id)
    if (!item) return
    item.status = idx === 0 ? "idle" : "rented"
    saveProducts(list)
    this.refresh()
  },
  onAdd() {
    this.openForm(blankProduct())
  },
  onEdit(e: WechatMiniprogram.TouchEvent) {
    const id = e.currentTarget.dataset.id as string
    const item = loadProducts().find((p) => p.id === id)
    if (item) this.openForm(item)
  },
  openForm(p: Product) {
    this.setData({
      editing: true,
      form: {
        ...p,
        typeLabel: TYPE_LABEL[p.type],
        unitLabel: UNIT_LABEL[p.rentUnit],
      },
      typeIndex: PRODUCT_TYPES.indexOf(p.type),
      unitIndex: UNIT_KEYS.indexOf(p.rentUnit),
    })
  },
  closeEdit() {
    this.setData({ editing: false })
  },
  noop() {},
  onForm(e: WechatMiniprogram.Input) {
    const key = e.currentTarget.dataset.key as string
    this.setData({ [`form.${key}`]: e.detail.value })
  },
  onFormNum(e: WechatMiniprogram.Input) {
    const key = e.currentTarget.dataset.key as string
    this.setData({ [`form.${key}`]: Number(e.detail.value || 0) })
  },
  onType(e: WechatMiniprogram.PickerChange) {
    const idx = Number(e.detail.value)
    const type = PRODUCT_TYPES[idx] as ProductType
    this.setData({
      typeIndex: idx,
      "form.type": type,
      "form.typeLabel": TYPE_LABEL[type],
    })
  },
  onUnit(e: WechatMiniprogram.PickerChange) {
    const idx = Number(e.detail.value)
    const unit = UNIT_KEYS[idx]
    this.setData({
      unitIndex: idx,
      "form.rentUnit": unit,
      "form.unitLabel": UNIT_LABEL[unit],
    })
  },
  onListed(e: WechatMiniprogram.SwitchChange) {
    this.setData({ "form.listed": e.detail.value })
  },
  chooseImage() {
    wx.chooseMedia({
      count: 1,
      mediaType: ["image"],
      success: (res) => {
        const src = res.tempFiles[0].tempFilePath
        const dest = `${wx.env.USER_DATA_PATH}/${Date.now()}.jpg`
        wx.getFileSystemManager().copyFile({
          srcPath: src,
          destPath: dest,
          success: () => this.setData({ "form.image": dest }),
          fail: () => this.setData({ "form.image": src }),
        })
      },
    })
  },
  saveEdit() {
    const form = this.data.form as Product
    if (!form.name || !String(form.name).trim()) {
      wx.showToast({ title: "请填写名称", icon: "none" })
      return
    }
    upsertProduct(loadProducts(), {
      id: form.id,
      name: form.name,
      type: form.type,
      image: form.image,
      description: form.description || "",
      costPrice: Number(form.costPrice) || 0,
      rentPrice: Number(form.rentPrice) || 0,
      salePrice: Number(form.salePrice) || 0,
      rentUnit: form.rentUnit,
      deposit: Number(form.deposit) || 0,
      status: form.status,
      listed: !!form.listed,
      note: form.note || "",
    })
    this.setData({ editing: false })
    this.refresh()
    wx.showToast({ title: "已保存", icon: "none" })
  },
  deleteEdit() {
    const id = (this.data.form as Product).id
    removeProduct(loadProducts(), id)
    this.setData({ editing: false })
    this.refresh()
    wx.showToast({ title: "已删除", icon: "none" })
  },
})
