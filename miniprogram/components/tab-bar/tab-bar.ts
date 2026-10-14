Component({
  properties: { current: { type: String, value: "home" } },
  methods: {
    go(e: WechatMiniprogram.TouchEvent) {
      const url = e.currentTarget.dataset.url as string
      const pages = getCurrentPages()
      const cur = pages[pages.length - 1]
      if (cur && `/${cur.route}` === url) return
      wx.redirectTo({ url })
    },
  },
})
