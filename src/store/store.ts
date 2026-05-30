import { create } from 'zustand'

export type FruitKey = 'Strawberina' | 'Bananito' | 'Aubergino' | 'Passiona' | 'Watermelonito' | 'Appelina'
export type Lang = 'zh' | 'en'

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

const zhQuestionData: Question[] = [
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
    title: '你在整理要去戀愛島的行李時，一定會帶上什麼？',
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

const enQuestionData: Question[] = [
  {
    title: 'you just got a text saying you won a spot on a dating reality show',
    bgKey: 'q1', handle: '@vickie_fruit_island',
    desc: 'first reaction. go.', tags: '#FruitIsland #AIFruit #datingshow',
    options: [
      { text: 'A. bro thought they could scam me 💀 (blocked)', scores: { Watermelonito: 1, Passiona: 1 } },
      { text: 'B. omg I am SO winning this whole thing', scores: { Strawberina: 1, Aubergino: 1 } },
      { text: 'C. wait do I actually have to go?? 😭', scores: { Bananito: 1, Appelina: 1 } },
    ],
  },
  {
    title: "packing your bags for love island. what's making the cut",
    bgKey: 'q2', handle: '@vickie_fruit_island',
    desc: 'your bag says everything 👀', tags: '#FruitIsland #packing #fruitvibes',
    options: [
      { text: 'A. Chanel perfume bc I came here to conquer', scores: { Strawberina: 1, Aubergino: 1, Passiona: 1 } },
      { text: "B. my snacks. that's it. that's the bag.", scores: { Bananito: 1, Watermelonito: 1 } },
      { text: 'C. a full skincare routine like a normal person', scores: { Appelina: 1 } },
    ],
  },
  {
    title: 'pick your fruit alter ego',
    bgKey: 'q3', handle: '@vickie_fruit_island',
    desc: 'no going back after this 🍓🍌🍆', tags: '#AIFruit #fruitquiz #chooseyourside',
    options: [
      { text: 'A. the apple girl (pure, naive, first to get hurt)', scores: { Appelina: 2 } },
      { text: "B. the watermelon guy (everyone's bestie, no one's priority)", scores: { Watermelonito: 2 } },
      { text: 'C. the banana guy (always one episode behind)', scores: { Bananito: 2 } },
      { text: 'D. the strawberry girl (unhinged but make it cute)', scores: { Strawberina: 2 } },
      { text: 'E. the eggplant guy (certified menace to society)', scores: { Aubergino: 2 } },
      { text: 'F. the passion fruit girl (3 steps ahead and she knows it)', scores: { Passiona: 2 } },
    ],
  },
  {
    title: 'bonfire night. someone asks why you signed up',
    bgKey: 'q4', handle: '@vickie_fruit_island',
    desc: 'your answer reveals everything', tags: '#bonfire #FruitIsland #motive',
    options: [
      { text: 'A. bro I literally got randomly selected?? wild', scores: { Watermelonito: 1, Bananito: 1 } },
      { text: 'B. I just want to find my person okay 🥺', scores: { Appelina: 1, Strawberina: 1 } },
      { text: 'C. vibes. just vibes.', scores: { Aubergino: 1, Passiona: 1 } },
    ],
  },
  {
    title: 'your crush is also being pursued by your least favourite person',
    bgKey: 'q5', handle: '@vickie_fruit_island',
    desc: "game on. what's your move 👀", tags: '#drama #FruitIsland #strategy',
    options: [
      { text: 'A. may the best person win I guess (I will win)', scores: { Strawberina: 1, Bananito: 1, Appelina: 1 } },
      { text: 'B. why solve the problem when you can remove the problem', scores: { Aubergino: 1, Passiona: 1 } },
      { text: "C. next. there's always someone better.", scores: { Watermelonito: 1 } },
    ],
  },
  {
    title: "he picked you. turns out he's been taken this whole time",
    bgKey: 'q6', handle: '@vickie_fruit_island',
    desc: 'final episode. how does it end?', tags: '#betrayal #FruitIsland #drama',
    options: [
      { text: 'A. crying in the group chat rn', scores: { Bananito: 1, Watermelonito: 1, Appelina: 1 } },
      { text: 'B. plot twist: me and his partner team up', scores: { Passiona: 1 } },
      { text: 'C. slapped him on national TV no regrets', scores: { Strawberina: 1, Aubergino: 1 } },
    ],
  },
]

export const questionData: Record<Lang, Question[]> = {
  zh: zhQuestionData,
  en: enQuestionData,
}

const initialScores: Record<FruitKey, number> = {
  Strawberina: 0, Bananito: 0, Aubergino: 0,
  Passiona: 0, Watermelonito: 0, Appelina: 0,
}

interface PsyStore {
  scores: Record<FruitKey, number>
  quizData: Question[]
  lang: Lang
  setLang: (lang: Lang) => void
  addScores: (fruitScores: Partial<Record<FruitKey, number>>) => void
  resetGame: () => void
}

export const usePsyStore = create<PsyStore>((set) => ({
  scores: { ...initialScores },
  quizData: zhQuestionData,
  lang: 'zh',
  setLang: (lang) => set({ lang, quizData: questionData[lang] }),
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
