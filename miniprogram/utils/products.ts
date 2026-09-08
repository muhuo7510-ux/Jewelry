export type ProductType = "set" | "necklace" | "ring" | "earring"
export type ProductStatus = "idle" | "rented"
export type RentUnit = "day" | "time"

export interface Product {
  id: string
  name: string
  type: ProductType
  image: string
  description: string
  costPrice: number
  rentPrice: number
  salePrice: number
  rentUnit: RentUnit
  deposit: number
  status: ProductStatus
  listed: boolean
  note: string
}

export const TYPE_LABEL: Record<ProductType, string> = {
  set: "套装",
  necklace: "项链",
  ring: "戒指",
  earring: "耳环",
}

export const STATUS_LABEL: Record<ProductStatus, string> = {
  idle: "空闲",
  rented: "租赁中",
}

export const UNIT_LABEL: Record<RentUnit, string> = {
  day: "天",
  time: "次",
}

export const PRODUCT_TYPES: ProductType[] = ["set", "necklace", "ring", "earring"]

export const DEFAULT_PIN = "8888"
const STORAGE_KEY = "jewelry.products.v2"
const AUTH_KEY = "jewelry.admin.ok"
const PIN_KEY = "jewelry.admin.pin"

export const SEED_PRODUCTS: Product[] = [
  {
    id: "set-pearl",
    name: "珍珠锆石套装",
    type: "set",
    image: "/images/set-pearl.jpg",
    description: "项链 + 戒指 + 耳环。仿珍珠与锆石花托，镀金保色，适合婚礼、晚宴。",
    costPrice: 880,
    rentPrice: 68,
    salePrice: 1580,
    rentUnit: "day",
    deposit: 400,
    status: "idle",
    listed: true,
    note: "主推套装，锆石成本档",
  },
  {
    id: "set-rose",
    name: "玫瑰金粉锆套装",
    type: "set",
    image: "/images/set-rose.jpg",
    description: "项链 + 戒指 + 耳钉。玫瑰金底镀包镶粉锆，日常与宴会都可。",
    costPrice: 720,
    rentPrice: 58,
    salePrice: 1280,
    rentUnit: "day",
    deposit: 350,
    status: "rented",
    listed: true,
    note: "本周末已租出",
  },
  {
    id: "necklace-diamond",
    name: "金链圆锆吊坠",
    type: "necklace",
    image: "/images/necklace-diamond.jpg",
    description: "古巴链搭配包镶圆锆吊坠，锁骨链长度。",
    costPrice: 280,
    rentPrice: 28,
    salePrice: 480,
    rentUnit: "day",
    deposit: 150,
    status: "idle",
    listed: true,
    note: "",
  },
  {
    id: "necklace-pearl",
    name: "碎珍珠细链",
    type: "necklace",
    image: "/images/necklace-pearl.jpg",
    description: "细链点缀仿珍珠，尾端一颗主珠，轻盈日常款。",
    costPrice: 180,
    rentPrice: 18,
    salePrice: 320,
    rentUnit: "day",
    deposit: 80,
    status: "idle",
    listed: true,
    note: "",
  },
  {
    id: "ring-halo",
    name: "光环锆石戒",
    type: "ring",
    image: "/images/ring-halo.jpg",
    description: "主石围一圈碎锆，镀金戒托。备有可调戒围垫片。",
    costPrice: 460,
    rentPrice: 38,
    salePrice: 780,
    rentUnit: "day",
    deposit: 200,
    status: "idle",
    listed: true,
    note: "拍照出片好",
  },
  {
    id: "ring-three",
    name: "三锆金戒",
    type: "ring",
    image: "/images/ring-three.jpg",
    description: "镀金戒圈嵌三颗圆锆，男女都可戴。",
    costPrice: 320,
    rentPrice: 28,
    salePrice: 560,
    rentUnit: "day",
    deposit: 150,
    status: "rented",
    listed: true,
    note: "",
  },
  {
    id: "earrings-pearl",
    name: "水滴珍珠耳环",
    type: "earring",
    image: "/images/earrings-pearl.jpg",
    description: "水滴仿珍珠配金钩，与珍珠套装可单配。",
    costPrice: 160,
    rentPrice: 16,
    salePrice: 280,
    rentUnit: "day",
    deposit: 80,
    status: "idle",
    listed: true,
    note: "",
  },
]

export function loadProducts(): Product[] {
  try {
    const raw = wx.getStorageSync(STORAGE_KEY)
    if (!raw) return JSON.parse(JSON.stringify(SEED_PRODUCTS))
    const parsed = typeof raw === "string" ? JSON.parse(raw) : raw
    if (!Array.isArray(parsed)) return JSON.parse(JSON.stringify(SEED_PRODUCTS))
    return parsed as Product[]
  } catch {
    return JSON.parse(JSON.stringify(SEED_PRODUCTS))
  }
}

export function saveProducts(list: Product[]) {
  wx.setStorageSync(STORAGE_KEY, list)
}

export function listedOf(list: Product[]) {
  return list.filter((p) => p.listed)
}

export function byType(list: Product[], type: ProductType | "all") {
  const listed = listedOf(list)
  if (type === "all") return listed
  return listed.filter((p) => p.type === type)
}

export function findProduct(list: Product[], id: string) {
  return list.find((p) => p.id === id)
}

export function upsertProduct(list: Product[], input: Product) {
  const next = list.slice()
  const idx = next.findIndex((p) => p.id === input.id)
  if (idx >= 0) next[idx] = { ...input }
  else next.unshift({ ...input })
  saveProducts(next)
  return next
}

export function removeProduct(list: Product[], id: string) {
  const next = list.filter((p) => p.id !== id)
  saveProducts(next)
  return next
}

export function isAuthed() {
  return wx.getStorageSync(AUTH_KEY) === "1"
}

export function login(pin: string) {
  const saved = wx.getStorageSync(PIN_KEY) || DEFAULT_PIN
  if (pin !== saved) return false
  wx.setStorageSync(AUTH_KEY, "1")
  return true
}

export function logout() {
  wx.removeStorageSync(AUTH_KEY)
}

export function blankProduct(): Product {
  return {
    id: `p-${Date.now()}`,
    name: "",
    type: "necklace",
    image: "",
    description: "",
    costPrice: 0,
    rentPrice: 0,
    salePrice: 0,
    rentUnit: "day",
    deposit: 0,
    status: "idle",
    listed: true,
    note: "",
  }
}
