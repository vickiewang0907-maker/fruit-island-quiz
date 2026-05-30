import { create } from 'zustand'

export type FruitKey = 'Strawberina' | 'Bananito' | 'Aubergino' | 'Passiona' | 'Watermelonito' | 'Appelina'

export interface Option {
  text: string
  scores: Partial<Record<FruitKey, number>>
}

export interface Question {
  title: string
  bgKey: string
  handle: string
  desc: string
  tags: string
  options: Option[]
}

const questionData: Question[] = [
  {
    title: '你發現一則你中獎參加戀愛實境秀的簡訊，你會怎麼想？',
    bgKey: 'q1', handle: '@vickie_fruit_island',
    desc: '第一關來了！你的第一反應是...', tags: '#FruitIsland #AIFruit #戀愛實境秀',
    options: [
      { text: 'A. 詐騙死全家（封鎖）', scores: { Watermelonito: 1, Passiona: 1 } },
      { text: 'B. 太好了我一定要大殺四方！', scores: { Strawberina: 1, Aubergino: 1 } },
      { text: 'C. 我一定得參加嗎QQ？', scores: { Bananito: 1, Appelina: 1 } },
    ],
  },
  {
    title: '你在整理實境秀行李時，一定會帶上什麼？',
    bgKey: 'q2', handle: '@vickie_fruit_island',
    desc: '行李透露你的本性 👀', tags: '#FruitIsland #行李 #水果性格',
    options: [
      { text: 'A. 勾魂的香奈兒香水。', scores: { Strawberina: 1, Aubergino: 1, Passiona: 1 } },
      { text: 'B. 最愛的零食。', scores: { Bananito: 1, Watermelonito: 1 } },
      { text: 'C. 盥洗用品旅行包。', scores: { Appelina: 1 } },
    ],
  },
  {
    title: '主題是AI水果！你覺得自己更可能是哪個水果？',
    bgKey: 'q3', handle: '@vickie_fruit_island',
    desc: '選了就沒有退路了喔 🍓🍌🍆', tags: '#AIFruit #水果測驗 #選邊站',
    options: [
      { text: 'A. 天真無邪蘋果女', scores: { Appelina: 2 } },
      { text: 'B. 中央空調西瓜男', scores: { Watermelonito: 2 } },
      { text: 'C. 狀況之外香蕉男', scores: { Bananito: 2 } },
      { text: 'D. 情緒激動草莓女', scores: { Strawberina: 2 } },
      { text: 'E. 花花公子茄子男', scores: { Aubergino: 2 } },
      { text: 'F. 勾心鬥角百香女', scores: { Passiona: 2 } },
    ],
  },
  {
    title: '營火晚會，大家問你為什麼來參加這個實境秀？',
    bgKey: 'q4', handle: '@vickie_fruit_island',
    desc: '你的理由，決定你的命運', tags: '#營火晚會 #FruitIsland #動機',
    options: [
      { text: 'A. 抽到的（說自己荒謬的中獎經歷）。', scores: { Watermelonito: 1, Bananito: 1 } },
      { text: 'B. 我缺另一半（純粹為了真愛）。', scores: { Appelina: 1, Strawberina: 1 } },
      { text: 'C. 我只是想玩玩（就是想玩）。', scores: { Aubergino: 1, Passiona: 1 } },
    ],
  },
  {
    title: '你看上的人也被你反感的人看上了。你要怎麼做？',
    bgKey: 'q5', handle: '@vickie_fruit_island',
    desc: '戰局開始！你的策略是...', tags: '#三角關係 #FruitIsland #戰略',
    options: [
      { text: 'A. 公平競爭，讓對象先喜歡上你。', scores: { Strawberina: 1, Bananito: 1, Appelina: 1 } },
      { text: 'B. 解決不了問題？解決問題的根源。', scores: { Aubergino: 1, Passiona: 1 } },
      { text: 'C. 管他呢，總還有更好的。', scores: { Watermelonito: 1 } },
    ],
  },
  {
    title: '他選了你！但你發現他其實早就有另一半了……',
    bgKey: 'q6', handle: '@vickie_fruit_island',
    desc: '最終決戰！你怎麼收場？', tags: '#劈腿 #FruitIsland #狗血結局',
    options: [
      { text: 'A. 大哭一場並和朋友大肆抱怨。', scores: { Bananito: 1, Watermelonito: 1, Appelina: 1 } },
      { text: 'B. 找到他的另一半並聯手搞他。', scores: { Passiona: 1 } },
      { text: 'C. 當面對峙並扇他巴掌。', scores: { Strawberina: 1, Aubergino: 1 } },
    ],
  },
]

const initialScores: Record<FruitKey, number> = {
  Strawberina: 0, Bananito: 0, Aubergino: 0,
  Passiona: 0, Watermelonito: 0, Appelina: 0,
}

interface PsyStore {
  scores: Record<FruitKey, number>
  quizData: Question[]
  addScores: (fruitScores: Partial<Record<FruitKey, number>>) => void
  resetGame: () => void
}

export const usePsyStore = create<PsyStore>((set) => ({
  scores: { ...initialScores },
  quizData: questionData,
  addScores: (fruitScores) =>
    set((state) => {
      const newScores = { ...state.scores }
      Object.entries(fruitScores).forEach(([fruit, val]) => {
        newScores[fruit as FruitKey] = (newScores[fruit as FruitKey] || 0) + (val || 0)
      })
      return { scores: newScores }
    }),
  resetGame: () => set({ scores: { ...initialScores } }),
}))
