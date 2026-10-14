Component({
  options: {
    virtualHost: true,
  },
  properties: {
    current: { type: String, value: "home" },
  },
  methods: {
    go(e: WechatMiniprogram.TouchEvent) {
      const url = String(e.currentTarget.dataset.url || "")
      if (!url) return
      const pages = getCurrentPages()
      const cur = pages[pages.length - 1]
      if (cur && `/${cur.route}` === url) return
      wx.reLaunch({ url })
    },
  },
})
