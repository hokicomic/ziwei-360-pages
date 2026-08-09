"use strict";

const STEMS = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"];
const BRANCHES = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"];
const PALACE_BRANCHES = ["寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥", "子", "丑"];
const HOURS = BRANCHES;
const WHEEL_DISPLAY_ROTATION = 210;
let yearInputLastChanged = "none";
const PALACE_NAMES = ["命宮", "兄弟宮", "夫妻宮", "子女宮", "財帛宮", "疾厄宮", "遷移宮", "僕役宮", "官祿宮", "田宅宮", "福德宮", "父母宮"];
const BRANCH_ELEMENTS = { 子: "水", 丑: "土", 寅: "木", 卯: "木", 辰: "土", 巳: "火", 午: "火", 未: "土", 申: "金", 酉: "金", 戌: "土", 亥: "水" };
const BRANCH_HIDDEN_STEMS = {
  子: ["癸"], 丑: ["己", "癸", "辛"], 寅: ["甲", "丙", "戊"], 卯: ["乙"], 辰: ["戊", "乙", "癸"], 巳: ["丙", "庚", "戊"],
  午: ["丁", "己"], 未: ["己", "丁", "乙"], 申: ["庚", "壬", "戊"], 酉: ["辛"], 戌: ["戊", "辛", "丁"], 亥: ["壬", "甲"]
};
const STAR_ELEMENTS = { 紫微: "土", 天府: "土", 天機: "木", 太陽: "火", 武曲: "金", 天同: "水", 廉貞: "火", 太陰: "水", 貪狼: "木/水", 巨門: "水/土", 天相: "水", 天梁: "土", 七殺: "金", 破軍: "水" };
const FOUR_TRANSFORMATIONS_WEI = {
  甲: { 祿: "廉貞", 權: "破軍", 科: "武曲", 忌: "太陽" }, 乙: { 祿: "天機", 權: "天梁", 科: "紫微", 忌: "太陰" },
  丙: { 祿: "天同", 權: "天機", 科: "文昌", 忌: "廉貞" }, 丁: { 祿: "太陰", 權: "天同", 科: "天機", 忌: "巨門" },
  戊: { 祿: "貪狼", 權: "太陰", 科: "右弼", 忌: "天機" }, 己: { 祿: "武曲", 權: "貪狼", 科: "天梁", 忌: "文曲" },
  庚: { 祿: "太陽", 權: "武曲", 科: "天府", 忌: "天同" }, 辛: { 祿: "巨門", 權: "太陽", 科: "文曲", 忌: "文昌" },
  壬: { 祿: "天梁", 權: "紫微", 科: "左輔", 忌: "武曲" }, 癸: { 祿: "破軍", 權: "巨門", 科: "太陰", 忌: "貪狼" }
};
const LU_CUN_BY_STEM = { 甲: "寅", 乙: "卯", 丙: "巳", 戊: "巳", 丁: "午", 己: "午", 庚: "申", 辛: "酉", 壬: "亥", 癸: "子" };
const KUI_YUE_BY_STEM = {
  甲: { 天魁: "丑", 天鉞: "未" }, 戊: { 天魁: "丑", 天鉞: "未" }, 庚: { 天魁: "丑", 天鉞: "未" },
  乙: { 天魁: "子", 天鉞: "申" }, 己: { 天魁: "子", 天鉞: "申" }, 丙: { 天魁: "亥", 天鉞: "酉" },
  丁: { 天魁: "亥", 天鉞: "酉" }, 壬: { 天魁: "卯", 天鉞: "巳" }, 癸: { 天魁: "卯", 天鉞: "巳" },
  辛: { 天魁: "午", 天鉞: "寅" }
};
const MAIN_STAR_OFFSETS_FROM_ZIWEI = { 紫微: 0, 天機: -1, 太陽: -3, 武曲: -4, 天同: -5, 廉貞: -8 };
const TIANFU_BRANCH_BY_ZIWEI_BRANCH = { 寅: "寅", 卯: "丑", 辰: "子", 巳: "亥", 午: "戌", 未: "酉", 申: "申", 酉: "未", 戌: "午", 亥: "巳", 子: "辰", 丑: "卯" };
const MAIN_STAR_OFFSETS_FROM_TIANFU = { 天府: 0, 太陰: 1, 貪狼: 2, 巨門: 3, 天相: 4, 天梁: 5, 七殺: 6, 破軍: 10 };
const REFERENCE_19710812 = {
  inputKey: "1971-08-12 11:30 male",
  note: "依使用者提供之文墨天機截圖人工錄入，作為硬參考盤。",
  stars: {
    紫微: "卯", 天機: "寅", 太陽: "子", 武曲: "亥", 天同: "戌", 廉貞: "未",
    天府: "丑", 太陰: "寅", 貪狼: "卯", 巨門: "辰", 天相: "巳", 天梁: "午", 七殺: "未", 破軍: "亥",
    左輔: "酉", 右弼: "巳", 文昌: "辰", 文曲: "戌", 祿存: "酉", 擎羊: "戌", 陀羅: "申", 天魁: "午", 天鉞: "寅",
    火星: "卯", 鈴星: "辰", 地空: "巳", 地劫: "巳", 天刑: "寅", 天哭: "午", 天虛: "巳",
    天馬: "巳", 紅鸞: "辰", 天喜: "戌", 龍池: "卯", 鳳閣: "亥",
    長生: "申", 沐浴: "未", 冠帶: "午", 臨官: "巳", 帝旺: "辰", 衰: "卯", 病: "寅", 死: "丑", 墓: "子", 絕: "亥", 胎: "戌", 養: "酉",
    博士: "酉", 力士: "申", 青龍: "未", 小耗: "午", 將軍: "巳", 奏書: "辰", 飛廉: "卯", 喜神: "寅", 病符: "丑", 大耗: "子", 伏兵: "亥", 官符: "戌"
  },
  strengths: {
    紫微: "旺", 天機: "得", 太陽: "陷", 武曲: "平", 天同: "平", 廉貞: "利", 天府: "廟", 太陰: "旺", 貪狼: "利", 巨門: "陷",
    天相: "得", 天梁: "廟", 七殺: "廟", 破軍: "平", 文昌: "陷", 文曲: "平"
  },
  palaces: { 命宮: "丑", 身宮: "丑" },
  bureau: "土五局",
  ziweiBranch: "卯"
};
const SCREENSHOT_STAR_COVERAGE = [
  ["十四正曜", ["紫微", "天機", "太陽", "武曲", "天同", "廉貞", "天府", "太陰", "貪狼", "巨門", "天相", "天梁", "七殺", "破軍"], "implemented"],
  ["六吉星", ["左輔", "右弼", "文昌", "文曲", "天魁", "天鉞"], "implemented-needs-check"],
  ["六煞星", ["擎羊", "陀羅"], "implemented-needs-check"],
  ["六煞星", ["火星", "鈴星", "地空", "地劫"], "implemented-needs-check"],
  ["年系小星", ["天馬", "天空", "紅鸞", "天喜", "龍池", "鳳閣", "孤辰", "寡宿"], "implemented-needs-check"],
  ["年干貴曜", ["天官", "天福", "天廚"], "implemented-needs-check"],
  ["年/月/日/時小星", ["天才", "天壽", "台輔", "封誥"], "implemented-needs-check"],
  ["年/月/日/時小星", ["三台", "八座", "恩光", "天貴"], "implemented-needs-check"],
  ["博士十二神", ["博士", "力士", "青龍", "小耗", "將軍", "奏書", "飛廉", "喜神", "病符", "大耗", "伏兵", "官符"], "implemented-needs-check"],
  ["長生十二神", ["長生", "沐浴", "冠帶", "臨官", "帝旺", "衰", "病", "死", "墓", "絕", "胎", "養"], "implemented-needs-check"],
  ["歲前/將前等神煞", ["劫煞", "大耗", "蜚廉", "破碎", "華蓋", "咸池", "龍德", "月德", "天德"], "implemented-needs-check"],
  ["歲前/將前等神煞", ["歲建", "晦氣", "喪門", "貫索", "官符", "小耗", "大耗", "白虎", "弔客", "病符"], "implemented-needs-check"],
  ["歲前/將前等神煞", ["將星", "攀鞍", "歲驛", "息神", "災煞", "天煞", "指背", "月煞", "亡神"], "implemented-needs-check"],
  ["空曜與雜曜", ["旬空", "截空", "天傷", "天使", "天刑", "天哭", "天虛"], "implemented-needs-check"],
  ["空曜與雜曜", ["年解"], "implemented-needs-check"],
  ["空曜與雜曜", ["天姚", "解神", "天巫", "天月", "陰煞"], "implemented-needs-check"]
];
const NAYIN_PAIRS = [
  ["甲子", "乙丑", "海中金", "金"], ["丙寅", "丁卯", "爐中火", "火"], ["戊辰", "己巳", "大林木", "木"], ["庚午", "辛未", "路旁土", "土"], ["壬申", "癸酉", "劍鋒金", "金"],
  ["甲戌", "乙亥", "山頭火", "火"], ["丙子", "丁丑", "澗下水", "水"], ["戊寅", "己卯", "城頭土", "土"], ["庚辰", "辛巳", "白蠟金", "金"], ["壬午", "癸未", "楊柳木", "木"],
  ["甲申", "乙酉", "泉中水", "水"], ["丙戌", "丁亥", "屋上土", "土"], ["戊子", "己丑", "霹靂火", "火"], ["庚寅", "辛卯", "松柏木", "木"], ["壬辰", "癸巳", "長流水", "水"],
  ["甲午", "乙未", "砂中金", "金"], ["丙申", "丁酉", "山下火", "火"], ["戊戌", "己亥", "平地木", "木"], ["庚子", "辛丑", "壁上土", "土"], ["壬寅", "癸卯", "金箔金", "金"],
  ["甲辰", "乙巳", "覆燈火", "火"], ["丙午", "丁未", "天河水", "水"], ["戊申", "己酉", "大驛土", "土"], ["庚戌", "辛亥", "釵釧金", "金"], ["壬子", "癸丑", "桑柘木", "木"],
  ["甲寅", "乙卯", "大溪水", "水"], ["丙辰", "丁巳", "沙中土", "土"], ["戊午", "己未", "天上火", "火"], ["庚申", "辛酉", "石榴木", "木"], ["壬戌", "癸亥", "大海水", "水"]
];
const BUREAU_BY_ELEMENT = { 水: { name: "水二局", number: 2 }, 木: { name: "木三局", number: 3 }, 金: { name: "金四局", number: 4 }, 土: { name: "土五局", number: 5 }, 火: { name: "火六局", number: 6 } };
const NAYIN = Object.fromEntries(NAYIN_PAIRS.flatMap(([a, b, name, element]) => [[a, { name, element }], [b, { name, element }]]));
const LESSON_STORAGE_KEY = "ziwei360.lesson.v1";
const INPUT_COLLAPSED_STORAGE_KEY = "ziwei360.inputCollapsed.v1";
let lessonState = { currentStepId: "load-input", completedStepIds: [], expanded: false };
let currentChart = null;
let selectedWheelStarKey = "";
const TEACHING_STEP_STARS = {
  "place-ziwei": ["紫微"],
  "place-tianji": ["天機"],
  "place-taiyang": ["太陽"],
  "place-wuqu": ["武曲"],
  "place-tiantong": ["天同"],
  "place-lianzhen": ["廉貞"],
  "place-tianfu": ["天府"],
  "place-taiyin": ["太陰"],
  "place-tanlang": ["貪狼"],
  "place-jumen": ["巨門"],
  "place-tianxiang": ["天相"],
  "place-tianliang": ["天梁"],
  "place-qisha": ["七殺"],
  "place-pojun": ["破軍"],
  "place-zuofu": ["左輔"],
  "place-youbi": ["右弼"],
  "place-wenqu": ["文曲"],
  "place-wenchang": ["文昌"],
  "place-dijie": ["地劫"],
  "place-dikong": ["地空"],
  "place-kui-yue": ["天魁", "天鉞"],
  "place-lucun-yang-tuo": ["祿存", "擎羊", "陀羅"],
  "place-fire-bell": ["火星", "鈴星"],
  "place-tian-guan-fu": ["天官", "天福"],
  "place-tianchu": ["天廚"],
  "place-jiekong": ["截空"],
  "place-xunkong": ["旬空"],
  "place-tianma-tiankong": ["天馬", "天空"],
  "place-cry-void": ["天哭", "天虛"],
  "place-red-happy": ["紅鸞", "天喜"],
  "place-lonely-widow": ["孤辰", "寡宿"],
  "place-dragon-phoenix": ["龍池", "鳳閣"],
  "place-jiesha": ["劫煞"],
  "place-dahao": [{ name: "大耗", category: "年支神煞" }],
  "place-feilian": ["蜚廉"],
  "place-posui": ["破碎"],
  "place-huagai": ["華蓋"],
  "place-xianchi": ["咸池"],
  "place-longde": ["龍德"],
  "place-yuede": ["月德"],
  "place-tiande": ["天德"],
  "place-nianjie": ["年解"],
  "place-tiancai": ["天才"],
  "place-tianshou": ["天壽"],
  "place-taifu": ["台輔"],
  "place-fenggao": ["封誥"],
  "place-tianxing": ["天刑"],
  "place-tianyao": ["天姚"],
  "place-jieshen": ["解神"],
  "place-tianwu": ["天巫"],
  "place-tianyue-minor": ["天月"],
  "place-yinsha": ["陰煞"],
  "place-tianshang-tianshi": ["天傷", "天使"],
  "place-santai": ["三台"],
  "place-bazuo": ["八座"],
  "place-enguang": ["恩光"],
  "place-tiangui": ["天貴"],
  "place-changsheng": ["長生", "沐浴", "冠帶", "臨官", "帝旺", "衰", "病", "死", "墓", "絕", "胎", "養"]
};
const ZIWEI_SERIES_OFFSETS = { 紫微: 0, 天機: -1, 太陽: -3, 武曲: -4, 天同: -5, 廉貞: -8 };
const TIANFU_SERIES_OFFSETS = { 天府: 0, 太陰: 1, 貪狼: 2, 巨門: 3, 天相: 4, 天梁: 5, 七殺: 6, 破軍: 10 };

function normalizeTeachingStarSpec(spec) {
  return typeof spec === "string" ? { name: spec } : spec;
}

function teachingStarSpecsForStep(stepId) {
  const doctorMatch = String(stepId).match(/^place-doctor-(\d+)$/);
  if (doctorMatch) {
    const names = ["博士", "力士", "青龍", "小耗", "將軍", "奏書", "飛廉", "喜神", "病符", "大耗", "伏兵", "官符"];
    return [{ name: names[Number(doctorMatch[1]) - 1], category: "博士十二神" }];
  }
  const suiqianMatch = String(stepId).match(/^place-suiqian-(\d+)$/);
  if (suiqianMatch) {
    const names = ["歲建", "晦氣", "喪門", "貫索", "官符", "小耗", "大耗", "龍德", "白虎", "天德", "弔客", "病符"];
    return [{ name: names[Number(suiqianMatch[1]) - 1], category: "歲前十二神" }];
  }
  const jiangqianMatch = String(stepId).match(/^place-jiangqian-(\d+)$/);
  if (jiangqianMatch) {
    const names = ["將星", "攀鞍", "歲驛", "息神", "華蓋", "劫煞", "災煞", "天煞", "指背", "咸池", "月煞", "亡神"];
    return [{ name: names[Number(jiangqianMatch[1]) - 1], category: "將前十二神" }];
  }
  return (TEACHING_STEP_STARS[stepId] || []).map(normalizeTeachingStarSpec);
}

function starMatchesTeachingSpec(star, spec) {
  return star.name === spec.name && (!spec.category || star.category === spec.category);
}

function annualCycleTrace(stepId, input) {
  const yearBranch = input.yearBranch;
  const yearBranchIndex = branchIndex(yearBranch);
  const cycleSpecs = {
    "place-huagai": {
      title: "安華蓋",
      starName: "華蓋",
      cycle: ["辰", "丑", "戌", "未"],
      result: huagaiPalace(yearBranch),
      mnemonic: "辰丑戌未輪華蓋。華蓋子年由辰宮起，按辰丑戌未輪排十二支。",
      formula: 'huagaiPalace = ["辰", "丑", "戌", "未"][yearBranchIndex % 4]',
      plain: "華蓋取三合局的墓庫位。申子辰局墓在辰，巳酉丑局墓在丑，寅午戌局墓在戌，亥卯未局墓在未。"
    },
    "place-xianchi": {
      title: "安咸池",
      starName: "咸池",
      cycle: ["酉", "午", "卯", "子"],
      result: xianchiPalace(yearBranch),
      mnemonic: "酉午卯子布咸池。咸池由酉宮起子年，按酉午卯子輪排十二支。",
      formula: 'xianchiPalace = ["酉", "午", "卯", "子"][yearBranchIndex % 4]',
      plain: "咸池按年支三合局取桃花位：申子辰局在酉，巳酉丑局在午，寅午戌局在卯，亥卯未局在子。"
    }
  };
  const countSpecs = {
    "place-longde": {
      title: "安龍德",
      starName: "龍德",
      start: "未",
      result: palaceFromZiYearStart(yearBranch, "未"),
      mnemonic: "龍德起羊。龍德由未宮起子年，順輪十二年支。",
      formula: "longdePalace = moveBranch('未', yearBranchIndex)",
      plain: "羊即未宮。以未宮代表子年，年支每前進一位，宮位也順行一位。"
    },
    "place-yuede": {
      title: "安月德",
      starName: "月德",
      start: "巳",
      result: palaceFromZiYearStart(yearBranch, "巳"),
      mnemonic: "月起巳。月德由巳宮起子年，順輪十二年支。",
      formula: "yuedePalace = moveBranch('巳', yearBranchIndex)",
      plain: "以巳宮代表子年，按出生年支索引順行同樣步數。"
    },
    "place-tiande": {
      title: "安天德",
      starName: "天德",
      start: "酉",
      result: palaceFromZiYearStart(yearBranch, "酉"),
      mnemonic: "天德星君起酉宮，順至生年定其蹤。",
      formula: "tiandePalace = moveBranch('酉', yearBranchIndex)",
      plain: "以酉宮代表子年，順數至出生年支對應步數，即為天德落宮。"
    },
    "place-nianjie": {
      title: "安年解",
      starName: "年解",
      start: "戌",
      result: palaceFromZiYearStartReverse(yearBranch, "戌"),
      mnemonic: "年解戌宮逆行去，數至生年可解凶。",
      formula: "nianjiePalace = moveBranch('戌', -yearBranchIndex)",
      plain: "以戌宮代表子年，按出生年支索引逆行同樣步數。"
    }
  };
  const cycleSpec = cycleSpecs[stepId];
  if (cycleSpec) {
    const remainder = yearBranchIndex % cycleSpec.cycle.length;
    return traceObject(stepId, cycleSpec.title, {
      inputs: { 出生年支: yearBranch, 年支順序: BRANCHES, 年支索引: yearBranchIndex, 循環表: cycleSpec.cycle, 取餘數: `${yearBranchIndex} % 4 = ${remainder}` },
      mnemonic: [cycleSpec.mnemonic],
      ruleExplanation: [
        `出生年支 ${yearBranch} 的零起算索引是 ${yearBranchIndex}。`,
        `用 ${yearBranchIndex} % 4 = ${remainder} 取循環表第 ${remainder} 格，得到 ${cycleSpec.result}。`,
        `白話：${cycleSpec.plain}`
      ],
      formula: cycleSpec.formula,
      normalizedFormula: `${cycleSpec.result} = ${JSON.stringify(cycleSpec.cycle)}[${yearBranchIndex} % 4]`,
      path: [`${yearBranch}:年支`, `${cycleSpec.result}:${cycleSpec.starName}`],
      highlightPath: [`${cycleSpec.result}:${cycleSpec.starName}`],
      intermediateValues: [
        { label: "出生年支", value: yearBranch },
        { label: "年支索引", value: yearBranchIndex },
        { label: "循環表", value: cycleSpec.cycle.join("、") },
        { label: "取餘數", value: `${yearBranchIndex} % 4 = ${remainder}` },
        { label: "最終落宮", value: cycleSpec.result }
      ],
      result: { starName: cycleSpec.starName, palace: cycleSpec.result, label: `${cycleSpec.starName}安於${cycleSpec.result}宮` },
      sourceReferences: [sourceReference(cycleSpec.title, cycleSpec.mnemonic)]
    });
  }
  const countSpec = countSpecs[stepId];
  if (!countSpec) return null;
  const isReverse = stepId === "place-nianjie";
  const path = buildPath(countSpec.start, yearBranchIndex + 1, isReverse ? "reverse" : "forward", true);
  return traceObject(stepId, countSpec.title, {
    inputs: { 出生年支: yearBranch, 年支順序: BRANCHES, 年支索引: yearBranchIndex, 子年起點: countSpec.start },
    mnemonic: [countSpec.mnemonic],
    ruleExplanation: [
      `出生年支 ${yearBranch} 的零起算索引是 ${yearBranchIndex}。`,
      `以 ${countSpec.start} 宮起子年，${isReverse ? "逆行" : "順行"} ${yearBranchIndex} 步，落在 ${countSpec.result}。`,
      `白話：${countSpec.plain}`
    ],
    formula: countSpec.formula,
    normalizedFormula: `${countSpec.result} = moveBranch(${countSpec.start}, ${isReverse ? -yearBranchIndex : yearBranchIndex})`,
    path,
    highlightPath: [`${countSpec.result}:${countSpec.starName}`],
    intermediateValues: [
      { label: "出生年支", value: yearBranch },
      { label: "年支索引", value: yearBranchIndex },
      { label: "子年起點", value: countSpec.start },
      { label: isReverse ? "逆數步數" : "順數步數", value: yearBranchIndex },
      { label: "最終落宮", value: countSpec.result }
    ],
    result: { starName: countSpec.starName, palace: countSpec.result, label: `${countSpec.starName}安於${countSpec.result}宮` },
    sourceReferences: [sourceReference(countSpec.title, countSpec.mnemonic)]
  });
}

function derivedSmallStarTrace(stepId, chart) {
  const input = chart.input;
  const yearBranchIndex = branchIndex(input.yearBranch);
  const dayOffset = Number(input.lunarDay) - 1;
  const specs = {
    "place-tiancai": {
      title: "安天才",
      starName: "天才",
      baseLabel: "命宮",
      baseBranch: chart.palaces.find((palace) => palace.isMing)?.branch,
      direction: "forward",
      mnemonic: "命宮起子天才順。",
      formula: "tiancaiPalace = moveBranch(mingBranch, yearBranchIndex)",
      plain: "命宮代表子年，出生年支每前進一位，天才宮位也順行一位。"
    },
    "place-tianshou": {
      title: "安天壽",
      starName: "天壽",
      baseLabel: "身宮",
      baseBranch: chart.palaces.find((palace) => palace.isShen)?.branch,
      direction: "forward",
      mnemonic: "身宮起子天壽堂。",
      formula: "tianshouPalace = moveBranch(shenBranch, yearBranchIndex)",
      plain: "身宮代表子年，出生年支每前進一位，天壽宮位也順行一位。"
    },
    "place-taifu": {
      title: "安台輔",
      starName: "台輔",
      baseLabel: "文曲",
      baseBranch: starBranch(chart, "文曲", "六吉星"),
      offset: 2,
      mnemonic: "曲前二位是台輔。",
      formula: "taifuPalace = moveBranch(wenquBranch, 2)",
      plain: "前二位沿地支順序前進二宮。"
    },
    "place-fenggao": {
      title: "安封誥",
      starName: "封誥",
      baseLabel: "文曲",
      baseBranch: starBranch(chart, "文曲", "六吉星"),
      offset: -2,
      mnemonic: "曲後二位封誥鄉。",
      formula: "fenggaoPalace = moveBranch(wenquBranch, -2)",
      plain: "後二位沿地支順序後退二宮。"
    },
    "place-santai": {
      title: "安三台",
      starName: "三台",
      baseLabel: "左輔",
      baseBranch: starBranch(chart, "左輔", "六吉星"),
      offset: dayOffset,
      mnemonic: "三台左輔起初一，數至生日是台宮。",
      formula: "santaiPalace = moveBranch(zuofuBranch, lunarDay - 1)",
      plain: "左輔宮作初一，農曆生日每加一天順行一宮。"
    },
    "place-bazuo": {
      title: "安八座",
      starName: "八座",
      baseLabel: "右弼",
      baseBranch: starBranch(chart, "右弼", "六吉星"),
      offset: -dayOffset,
      mnemonic: "八座右弼逆初一，數至生日定其蹤。",
      formula: "bazuoPalace = moveBranch(youbiBranch, -(lunarDay - 1))",
      plain: "右弼宮作初一，農曆生日每加一天逆行一宮。"
    },
    "place-enguang": {
      title: "安恩光",
      starName: "恩光",
      baseLabel: "文昌",
      baseBranch: starBranch(chart, "文昌", "六吉星"),
      offset: dayOffset - 1,
      mnemonic: "文昌順數至生日，退後一步是恩光。",
      formula: "enguangPalace = moveBranch(wenchangBranch, lunarDay - 2)",
      plain: "文昌宮順數至生日後，再退後一位。"
    },
    "place-tiangui": {
      title: "安天貴",
      starName: "天貴",
      baseLabel: "文曲",
      baseBranch: starBranch(chart, "文曲", "六吉星"),
      offset: dayOffset - 1,
      mnemonic: "文曲順數至生日，退後一步天貴方。",
      formula: "tianguiPalace = moveBranch(wenquBranch, lunarDay - 2)",
      plain: "文曲宮順數至生日後，再退後一位。"
    }
  };
  const spec = specs[stepId];
  if (!spec?.baseBranch) return null;
  const offset = spec.offset ?? yearBranchIndex;
  const result = moveBranch(spec.baseBranch, offset);
  const path = buildPath(spec.baseBranch, Math.abs(offset) + 1, offset < 0 ? "reverse" : "forward", true);
  return traceObject(stepId, spec.title, {
    inputs: { 出生年支: input.yearBranch, 年支索引: yearBranchIndex, 農曆日: input.lunarDay, 起點: `${spec.baseLabel}${spec.baseBranch}`, 位移: offset },
    mnemonic: [spec.mnemonic],
    ruleExplanation: [
      `${spec.baseLabel}在 ${spec.baseBranch}。`,
      spec.offset === undefined ? `出生年支 ${input.yearBranch} 的索引為 ${yearBranchIndex}，由 ${spec.baseBranch} 順行 ${yearBranchIndex} 步至 ${result}。` : `由 ${spec.baseBranch} ${offset > 0 ? "前進" : "後退"} ${Math.abs(offset)} 位至 ${result}。`,
      `白話：${spec.plain}`
    ],
    formula: spec.formula,
    normalizedFormula: `${result} = moveBranch(${spec.baseBranch}, ${offset})`,
    path,
    highlightPath: [`${result}:${spec.starName}`],
    intermediateValues: [
      { label: "起點", value: `${spec.baseLabel}${spec.baseBranch}` },
      { label: "位移", value: offset },
      { label: "最終落宮", value: result }
    ],
    result: { starName: spec.starName, palace: result, label: `${spec.starName}安於${result}宮` },
    sourceReferences: [sourceReference(spec.title, spec.mnemonic)]
  });
}

function monthStarTrace(stepId, chart) {
  const month = chart.input.effectiveLunarMonth || chart.input.lunarMonth;
  const specs = {
    "place-tianyao": {
      title: "安天姚",
      starName: "天姚",
      result: moveBranch("丑", month - 1),
      mnemonic: "天姚丑上順正月。",
      formula: "tianyaoPalace = moveBranch('丑', effectiveMonth - 1)",
      mode: "count",
      start: "丑",
      plain: "丑宮作正月，月份每加一月順行一宮。"
    },
    "place-tianwu": {
      title: "安天巫",
      starName: "天巫",
      result: tianwuPalace(month),
      mnemonic: "巳申寅亥天巫位，分輪十二月星君。",
      formula: 'tianwuPalace = ["巳", "申", "寅", "亥"][(effectiveMonth - 1) % 4]',
      mode: "cycle",
      cycle: ["巳", "申", "寅", "亥"],
      plain: "十二月分成巳、申、寅、亥四宮循環。"
    },
    "place-jieshen": {
      title: "安解神",
      starName: "解神",
      result: jieshenPalace(month),
      mnemonic: "單月沖宮覓解神，雙月還依單月辰。",
      formula: "jieshenPalace = moveBranch('申', Math.floor((effectiveMonth - 1) / 2) * 2)",
      mode: "pair",
      cycle: ["申", "申", "戌", "戌", "子", "子", "寅", "寅", "辰", "辰", "午", "午"],
      plain: "正二月同在申，三四月在戌，五六月在子；每兩個月共用一宮。"
    },
    "place-tianyue-minor": {
      title: "安天月",
      starName: "天月",
      result: tianyueMinorPalace(month),
      mnemonic: "一犬二蛇三在龍，四虎五羊六兔宮，七豬八羊九在虎，十馬冬犬臘寅中。",
      formula: "tianyuePalace = month lookup table",
      mode: "table",
      cycle: ["戌", "巳", "辰", "寅", "未", "卯", "亥", "未", "寅", "午", "戌", "寅"],
      plain: "犬為戌，蛇為巳，龍為辰，虎為寅，羊為未，兔為卯，豬為亥，馬為午；冬月為十一月，臘月為十二月。"
    },
    "place-yinsha": {
      title: "安陰煞",
      starName: "陰煞",
      result: yinshaPalace(month),
      mnemonic: "寅子戌，申午辰，分六月，陰煞臨。",
      formula: 'yinshaPalace = ["寅", "子", "戌", "申", "午", "辰"][(effectiveMonth - 1) % 6]',
      mode: "cycle",
      cycle: ["寅", "子", "戌", "申", "午", "辰"],
      plain: "六宮為一輪，七月回到寅宮重排。"
    }
  };
  const spec = specs[stepId];
  if (!spec) return null;
  const offset = month - 1;
  const remainder = spec.mode === "pair" ? Math.floor(offset / 2) : spec.cycle ? offset % spec.cycle.length : null;
  const path = spec.mode === "count" ? buildPath(spec.start, month, "forward", true) : [`${month}:月`, `${spec.result}:${spec.starName}`];
  return traceObject(stepId, spec.title, {
    inputs: { 有效農曆月: month, 查表或起點: spec.cycle || spec.start, 月份索引: offset, 餘數: remainder },
    mnemonic: [spec.mnemonic],
    ruleExplanation: [
      `有效農曆月為 ${month} 月，零起算月份索引為 ${offset}。`,
      spec.mode === "count"
        ? `由 ${spec.start} 宮起正月，順行 ${offset} 步，落在 ${spec.result}。`
        : spec.mode === "pair"
          ? `兩個月同宮，pairIndex = floor(${offset} / 2) = ${remainder}，落在 ${spec.result}。`
        : `按表取值，得到 ${spec.result}。`,
      `白話：${spec.plain}`
    ],
    formula: spec.formula,
    normalizedFormula: spec.mode === "count" ? `${spec.result} = moveBranch(${spec.start}, ${offset})` : spec.mode === "pair" ? `${spec.result} = table[pairIndex ${remainder}]` : `${spec.result} = table[${offset}${remainder === null ? "" : ` % ${spec.cycle.length} = ${remainder}`}]`,
    path,
    highlightPath: [`${spec.result}:${spec.starName}`],
    intermediateValues: [
      { label: "有效農曆月", value: month },
      { label: "月份索引", value: offset },
      ...(remainder === null ? [] : [{ label: spec.mode === "pair" ? "兩月一組" : "取餘數", value: spec.mode === "pair" ? `floor(${offset} / 2) = ${remainder}` : `${offset} % ${spec.cycle.length} = ${remainder}` }]),
      { label: "最終落宮", value: spec.result }
    ],
    result: { starName: spec.starName, palace: spec.result, label: `${spec.starName}安於${spec.result}宮` },
    sourceReferences: [sourceReference(spec.title, spec.mnemonic)]
  });
}

function zhuTrace(stepId, chart) {
  const specs = {
    "place-mingzhu": {
      title: "安命主",
      label: "命主",
      value: chart.metadata.mingZhu?.star,
      mnemonic: "子屬貪狼丑亥門，寅戌生人屬祿存，卯酉屬文巳未武，辰申廉宿午破軍。",
      table: {
        貪狼: ["子"],
        巨門: ["丑", "亥"],
        祿存: ["寅", "戌"],
        文曲: ["卯", "酉"],
        武曲: ["巳", "未"],
        廉貞: ["辰", "申"],
        破軍: ["午"]
      }
    },
    "place-shenzhu": {
      title: "安身主",
      label: "身主",
      value: chart.metadata.shenZhu?.star,
      mnemonic: "子午安身鈴火宿，丑未天相寅申梁，卯酉天同身主是，巳亥天機辰戌昌。",
      table: {
        鈴星: ["子"],
        火星: ["午"],
        天相: ["丑", "未"],
        天梁: ["寅", "申"],
        天同: ["卯", "酉"],
        天機: ["巳", "亥"],
        文昌: ["辰", "戌"]
      }
    }
  };
  const spec = specs[stepId];
  if (!spec) return null;
  return traceObject(stepId, spec.title, {
    inputs: { 出生年支: chart.input.yearBranch, 查表: spec.table },
    mnemonic: [spec.mnemonic],
    ruleExplanation: [
      `出生年支為 ${chart.input.yearBranch}。`,
      `依口訣查表，${spec.label} = ${spec.value}。`,
      `${spec.label}是命盤屬性，不是另安一顆星到某個宮位，因此本步不框宮。`
    ],
    formula: `${spec.label} = lookup(yearBranch)`,
    path: [`${chart.input.yearBranch}:年支`, `${spec.label}:${spec.value}`],
    highlightPath: [],
    intermediateValues: [
      { label: "出生年支", value: chart.input.yearBranch },
      { label: spec.label, value: spec.value }
    ],
    result: { label: `${spec.label}為${spec.value}` },
    sourceReferences: [sourceReference(spec.title, spec.mnemonic)]
  });
}

function huagaiPalace(yearBranch) {
  return ["辰", "丑", "戌", "未"][branchIndex(yearBranch) % 4];
}

function xianchiPalace(yearBranch) {
  return ["酉", "午", "卯", "子"][branchIndex(yearBranch) % 4];
}

function palaceFromZiYearStart(yearBranch, startBranch) {
  return moveBranch(startBranch, branchIndex(yearBranch));
}

function palaceFromZiYearStartReverse(yearBranch, startBranch) {
  return moveBranch(startBranch, -branchIndex(yearBranch));
}

function starBranch(chart, starName, category = null) {
  const star = chart.stars.find((item) => item.name === starName && (!category || item.category === category));
  return star?.branch || null;
}

function mingZhuByYearBranch(yearBranch) {
  return {
    子: "貪狼", 丑: "巨門", 亥: "巨門",
    寅: "祿存", 戌: "祿存",
    卯: "文曲", 酉: "文曲",
    巳: "武曲", 未: "武曲",
    辰: "廉貞", 申: "廉貞",
    午: "破軍"
  }[yearBranch];
}

function shenZhuByYearBranch(yearBranch) {
  return {
    子: "鈴星", 午: "火星",
    丑: "天相", 未: "天相",
    寅: "天梁", 申: "天梁",
    卯: "天同", 酉: "天同",
    巳: "天機", 亥: "天機",
    辰: "文昌", 戌: "文昌"
  }[yearBranch];
}

function tianwuPalace(month) {
  return ["巳", "申", "寅", "亥"][mod(month - 1, 4)];
}

function tianyueMinorPalace(month) {
  return ["戌", "巳", "辰", "寅", "未", "卯", "亥", "未", "寅", "午", "戌", "寅"][month - 1];
}

function yinshaPalace(month) {
  return ["寅", "子", "戌", "申", "午", "辰"][mod(month - 1, 6)];
}

function jieshenPalace(month) {
  return moveBranch("申", Math.floor((month - 1) / 2) * 2);
}

function mod(value, divisor) { return ((value % divisor) + divisor) % divisor; }
function branchIndex(branch) { const index = BRANCHES.indexOf(branch); if (index < 0) throw new Error(`Unknown branch: ${branch}`); return index; }
function branchByPalaceIndex(index) { return PALACE_BRANCHES[mod(index, 12)]; }
function moveBranch(branch, steps) { return BRANCHES[mod(branchIndex(branch) + steps, 12)]; }
function hourIndex(hourBranch) { return HOURS.indexOf(hourBranch); }
function palaceBaseDegree(palaceIndex) { return mod(palaceIndex, 12) * 30; }
function degreeInPalace(minutesPassedInHourBranch) { return (Math.max(0, Math.min(119.999, Number(minutesPassedInHourBranch || 0))) / 120) * 30; }
function normalizeDegree(degree) { return mod(degree, 360); }
function intensityFromDegreeInPalace(localDegree) { return Number((1 - (Math.abs(15 - localDegree) / 15) * 0.5).toFixed(4)); }
function boundaryEffect(localDegree, threshold = 2) {
  if (localDegree <= threshold) return { side: "previous", weight: Number(((threshold - localDegree) / threshold).toFixed(4)) };
  if (30 - localDegree <= threshold) return { side: "next", weight: Number(((threshold - (30 - localDegree)) / threshold).toFixed(4)) };
  return null;
}
function stemBranchKey(stem, branch) { return `${stem}${branch}`; }
function displayDegree(degree) { return normalizeDegree(degree + WHEEL_DISPLAY_ROTATION); }

function buildPath(start, count, direction, inclusiveStart = true) {
  const path = [];
  for (let i = 0; i < count; i += 1) {
    const step = inclusiveStart ? i : i + 1;
    path.push(moveBranch(start, direction === "reverse" ? -step : step));
  }
  return path;
}

function traceObject(stepId, title, fields = {}) {
  return {
    stepId,
    title,
    inputs: fields.inputs || {},
    mnemonic: fields.mnemonic || [],
    ruleExplanation: fields.ruleExplanation || [],
    formula: fields.formula || "",
    normalizedFormula: fields.normalizedFormula || "",
    startPalace: fields.startPalace || "",
    direction: fields.direction || "lookup",
    inclusiveStart: fields.inclusiveStart ?? null,
    count: fields.count ?? null,
    path: fields.path || [],
    highlightPath: fields.highlightPath || fields.path || [],
    intermediateValues: fields.intermediateValues || [],
    result: fields.result || null,
    sourceReferences: fields.sourceReferences || [],
    warnings: fields.warnings || []
  };
}

function sourceReference(section, text, verificationStatus = "verified") {
  return {
    bookTitle: "安星法及推斷實例",
    chapter: "紫微斗數安星訣與推斷架構",
    section,
    sourceFile: "OEBPS/text00003.html",
    paragraphIndex: null,
    text,
    verificationStatus
  };
}

function sexagenaryFromGregorianYear(year) {
  const stem = STEMS[mod(year - 4, 10)];
  const branch = BRANCHES[mod(year - 4, 12)];
  return { stem, branch };
}

function compatibleBranchForStem(stem, branch) {
  return STEMS.indexOf(stem) % 2 === BRANCHES.indexOf(branch) % 2;
}

function renderYearStemOptions(preferredStem, restrictedByBranch = null) {
  const select = document.querySelector("[name='yearStem']");
  select.innerHTML = STEMS.map((stem) => `<option value="${stem}"${restrictedByBranch && !compatibleBranchForStem(stem, restrictedByBranch) ? " disabled" : ""}>${stem}</option>`).join("");
  select.value = !restrictedByBranch || compatibleBranchForStem(preferredStem, restrictedByBranch) ? preferredStem : STEMS.find((stem) => compatibleBranchForStem(stem, restrictedByBranch));
}

function renderYearBranchOptions(stem, preferredBranch) {
  const select = document.querySelector("[name='yearBranch']");
  select.innerHTML = BRANCHES.map((branch) => `<option value="${branch}"${compatibleBranchForStem(stem, branch) ? "" : " disabled"}>${branch}</option>`).join("");
  select.value = compatibleBranchForStem(stem, preferredBranch) ? preferredBranch : BRANCHES.find((branch) => compatibleBranchForStem(stem, branch));
}

function gregorianYearsForSexagenaryYear(stem, branch) {
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let year = 1500; year <= currentYear + 120; year += 1) {
    const value = sexagenaryFromGregorianYear(year);
    if (value.stem === stem && value.branch === branch) years.push(year);
  }
  return years;
}

function closestYearToToday(years) {
  const currentYear = new Date().getFullYear();
  return years.reduce((closest, year) => Math.abs(year - currentYear) < Math.abs(closest - currentYear) ? year : closest, years[0]);
}

function syncGregorianYearOptions() {
  const form = document.querySelector("#birth-form");
  const select = form.elements.gregorianYear;
  const years = gregorianYearsForSexagenaryYear(form.elements.yearStem.value, form.elements.yearBranch.value);
  const previous = Number(select.value);
  select.innerHTML = years.map((year) => `<option value="${year}">${year} 年</option>`).join("");
  select.value = years.includes(previous) ? String(previous) : String(closestYearToToday(years));
}

function syncDefaultBirthName(form, lunar = null) {
  const name = form.elements.name;
  if (!/^\d{4}-\d{2}-\d{2} \d{2}:\d{2} [男女]命$/.test(name.value) && !/^[甲乙丙丁戊己庚辛壬癸][子丑寅卯辰巳午未申酉戌亥]年 農曆/.test(name.value)) return;
  if (lunar) {
    name.value = `${form.elements.solarDate.value} ${form.elements.clockTime.value} ${form.elements.gender.value === "male" ? "男" : "女"}命`;
    return;
  }
  name.value = `${form.elements.yearStem.value}${form.elements.yearBranch.value}年 農曆${form.elements.lunarMonth.value}月${form.elements.lunarDay.value}日 ${form.elements.gender.value === "male" ? "男" : "女"}命`;
}

function defaultFlowYear() {
  const year = new Date().getFullYear();
  return { year, ...sexagenaryFromGregorianYear(year) };
}

function chineseMonthNumber(value) {
  const text = String(value).replace("閏", "").replace("月", "");
  const map = { 正: 1, 一: 1, 二: 2, 三: 3, 四: 4, 五: 5, 六: 6, 七: 7, 八: 8, 九: 9, 十: 10, 冬: 11, 十一: 11, 臘: 12, 腊: 12, 十二: 12 };
  if (map[text]) return map[text];
  const numeric = Number(text);
  if (numeric >= 1 && numeric <= 12) return numeric;
  throw new Error(`無法解析農曆月份：${value}`);
}

function dateFromInput(dateText) {
  const [year, month, day] = dateText.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function solarToLunar(dateText) {
  const date = dateFromInput(dateText);
  const parts = new Intl.DateTimeFormat("zh-TW-u-ca-chinese", {
    year: "numeric",
    month: "long",
    day: "numeric"
  }).formatToParts(date);
  const relatedYear = parts.find((part) => part.type === "relatedYear")?.value;
  const monthText = parts.find((part) => part.type === "month")?.value;
  const dayText = parts.find((part) => part.type === "day")?.value;
  const formatted = new Intl.DateTimeFormat("zh-TW-u-ca-chinese", {
    year: "numeric",
    month: "long",
    day: "numeric"
  }).format(date);
  const stemBranchMatch = formatted.match(/\(([甲乙丙丁戊己庚辛壬癸])([子丑寅卯辰巳午未申酉戌亥])\)/);
  const fallback = sexagenaryFromGregorianYear(Number(relatedYear || date.getFullYear()));
  return {
    yearStem: stemBranchMatch ? stemBranchMatch[1] : fallback.stem,
    yearBranch: stemBranchMatch ? stemBranchMatch[2] : fallback.branch,
    lunarMonth: chineseMonthNumber(monthText),
    lunarDay: Number(dayText),
    isLeapMonth: String(monthText).includes("閏"),
    formatted
  };
}

function findSolarDateForLunarDate(gregorianYear, yearStem, yearBranch, lunarMonth, lunarDay, isLeapMonth) {
  const start = new Date(gregorianYear, 0, 1);
  const end = new Date(gregorianYear + 1, 2, 1);
  for (let date = new Date(start); date < end; date.setDate(date.getDate() + 1)) {
    const isoDate = [date.getFullYear(), String(date.getMonth() + 1).padStart(2, "0"), String(date.getDate()).padStart(2, "0")].join("-");
    const lunar = solarToLunar(isoDate);
    if (lunar.yearStem === yearStem && lunar.yearBranch === yearBranch && lunar.lunarMonth === lunarMonth && lunar.lunarDay === lunarDay && lunar.isLeapMonth === isLeapMonth) {
      return isoDate;
    }
  }
  return null;
}

function clockTimeToHourBranch(timeText) {
  const [hour, minute] = timeText.split(":").map(Number);
  const totalMinutes = hour * 60 + minute;
  const index = Math.floor((totalMinutes + 60) / 120) % 12;
  return {
    hourBranch: BRANCHES[index],
    minutesPassedInHourBranch: (totalMinutes + 60) % 120
  };
}

function isYangStem(stem) {
  return ["甲", "丙", "戊", "庚", "壬"].includes(stem);
}

function fortuneDirection(yearStem, gender) {
  const yang = isYangStem(yearStem);
  const forward = (yang && gender === "male") || (!yang && gender === "female");
  return {
    forward,
    label: forward ? "陽男陰女順行" : "陰男陽女逆行"
  };
}

function isYangBranch(branch) {
  return ["子", "寅", "辰", "午", "申", "戌"].includes(branch);
}

function emptyWeightNote(yearStem, branch) {
  const samePolarity = isYangStem(yearStem) === isYangBranch(branch);
  return samePolarity ? "正空" : "傍空";
}

function effectiveLunarMonth(input) {
  const original = Number(input.lunarMonth);
  if (!input.isLeapMonth) {
    return {
      month: original,
      adjusted: false,
      rule: "非閏月，直接採用顯示農曆月。"
    };
  }
  const beforeCutoff = Number(input.lunarDay) <= 15;
  const month = mod(original - 1 + (beforeCutoff ? -1 : 1), 12) + 1;
  return {
    month,
    adjusted: true,
    rule: beforeCutoff
      ? "閏月一日至十五日亥時，照前一個月份推算。"
      : "閏月十六日子時至月底，作下一個月份推算。"
  };
}

function correctedTime(input) {
  const longitude = input.longitude === undefined ? 120 : Number(input.longitude);
  const timezoneLongitude = input.timezoneLongitude === undefined ? 120 : Number(input.timezoneLongitude);
  const equationOfTimeMinutes = Number(input.equationOfTimeMinutes || 0);
  const clockMinutesInHourBranch = Number(input.minutesPassedInHourBranch || 0);
  const longitudeOffset = (longitude - timezoneLongitude) * 4;
  const corrected = clockMinutesInHourBranch + longitudeOffset + equationOfTimeMinutes;
  const branchShift = Math.floor(corrected / 120);
  return {
    sourceHourBranch: input.hourBranch,
    hourBranch: moveBranch(input.hourBranch, branchShift),
    minutesPassedInHourBranch: mod(corrected, 120),
    longitudeOffsetMinutes: Number(longitudeOffset.toFixed(4)),
    equationOfTimeMinutes
  };
}

function palaceStemAtBranch(yearStem, branch) {
  const yinStemByYearStem = { 甲: "丙", 己: "丙", 乙: "戊", 庚: "戊", 丙: "庚", 辛: "庚", 丁: "壬", 壬: "壬", 戊: "甲", 癸: "甲" };
  const yinStemIndex = STEMS.indexOf(yinStemByYearStem[yearStem]);
  return STEMS[mod(yinStemIndex + mod(branchIndex(branch) - branchIndex("寅"), 12), 10)];
}

function mingAndShenBranches(lunarMonth, hourBranch) {
  const monthBase = moveBranch("寅", lunarMonth - 1);
  const h = hourIndex(hourBranch);
  return { mingBranch: moveBranch(monthBase, -h), shenBranch: moveBranch(monthBase, h) };
}

function palaceNameByMing(mingBranch, palaceBranch) {
  return PALACE_NAMES[mod(branchIndex(mingBranch) - branchIndex(palaceBranch), 12)];
}

function buildPalaces(input, timeInfo) {
  const month = input.effectiveLunarMonth || input.lunarMonth;
  const { mingBranch, shenBranch } = mingAndShenBranches(month, timeInfo.hourBranch);
  const direction = fortuneDirection(input.yearStem, input.gender);
  const mingIndex = PALACE_BRANCHES.indexOf(mingBranch);
  return PALACE_BRANCHES.map((branch, index) => {
    const distance = direction.forward ? mod(index - mingIndex, 12) : mod(mingIndex - index, 12);
    return ({
    id: index,
    branch,
    stem: palaceStemAtBranch(input.yearStem, branch),
    name: palaceNameByMing(mingBranch, branch),
    isMing: branch === mingBranch,
    isShen: branch === shenBranch,
    hiddenStems: BRANCH_HIDDEN_STEMS[branch],
    element: BRANCH_ELEMENTS[branch],
    baseDegree: palaceBaseDegree(index),
    majorLimit: {
      start: null,
      end: null,
      order: distance,
      direction: direction.label
    },
    stars: []
  });
  });
}

function determineBureau(yearStem, mingBranch) {
  const key = stemBranchKey(palaceStemAtBranch(yearStem, mingBranch), mingBranch);
  const nayin = NAYIN[key];
  return { palaceStemBranch: key, nayin: nayin.name, element: nayin.element, ...BUREAU_BY_ELEMENT[nayin.element] };
}

function ziweiBranchByDay(lunarDay, bureauNumber) {
  const supplement = mod(bureauNumber - mod(lunarDay, bureauNumber), bureauNumber);
  const adjustedDay = lunarDay + supplement;
  const quotient = adjustedDay / bureauNumber;
  let branch = moveBranch("寅", quotient - 1);
  if (supplement !== 0) branch = moveBranch(branch, supplement % 2 === 1 ? -supplement : supplement);
  return branch;
}

function ziweiRuleTrace(lunarDay, bureauNumber) {
  const supplement = mod(bureauNumber - mod(lunarDay, bureauNumber), bureauNumber);
  const adjustedDay = lunarDay + supplement;
  const quotient = adjustedDay / bureauNumber;
  const base = moveBranch("寅", quotient - 1);
  const direction = supplement === 0 ? "不移動" : supplement % 2 === 1 ? "奇數補數逆行" : "偶數補數順行";
  const result = supplement === 0 ? base : moveBranch(base, supplement % 2 === 1 ? -supplement : supplement);
  return { rule: "生日補足可整除局數；商數由寅順數；補數奇逆偶順", lunarDay, bureauNumber, supplement, adjustedDay, quotient, base, direction, result };
}

function addStar(chart, name, branch, category, options = {}) {
  const palace = chart.palaces.find((item) => item.branch === branch);
  const localDegree = options.localDegree === undefined ? 15 : Math.max(0, Math.min(29.999, Number(options.localDegree)));
  const star = {
    name, category, branch, palaceId: palace.id, palaceName: palace.name,
    degree: normalizeDegree(palace.baseDegree + localDegree),
    localDegree: Number(localDegree.toFixed(4)),
    intensity: intensityFromDegreeInPalace(localDegree),
    boundaryEffect: boundaryEffect(localDegree),
    transformations: [],
    element: STAR_ELEMENTS[name] || null,
    notes: options.notes || []
  };
  star.rule = options.rule || "";
  star.ruleInput = options.ruleInput || "";
  palace.stars.push(star);
  chart.stars.push(star);
}

function branchByGroups(yearBranch, groups) {
  return Object.entries(groups).find(([, branches]) => branches.includes(yearBranch))?.[0];
}

function jiangqianStartBranch(yearBranch) {
  return branchByGroups(yearBranch, {
    子: ["申", "子", "辰"],
    酉: ["巳", "酉", "丑"],
    午: ["寅", "午", "戌"],
    卯: ["亥", "卯", "未"]
  });
}

function placeStarAtPalaceName(chart, name, palaceName, category, options = {}) {
  const palace = chart.palaces.find((item) => item.name === palaceName);
  if (palace) addStar(chart, name, palace.branch, category, options);
}

function placeMainStars(chart, input, bureau) {
  const ziweiBranch = ziweiBranchByDay(input.lunarDay, bureau.number);
  chart.debug.ziwei = ziweiRuleTrace(input.lunarDay, bureau.number);
  Object.entries(MAIN_STAR_OFFSETS_FROM_ZIWEI).forEach(([star, offset]) => addStar(chart, star, moveBranch(ziweiBranch, offset), "十四正曜", {
    rule: "紫微系：由紫微所在宮依固定偏移安星",
    ruleInput: `紫微=${ziweiBranch}, offset=${offset}`
  }));
  const tianfuBranch = TIANFU_BRANCH_BY_ZIWEI_BRANCH[ziweiBranch];
  Object.entries(MAIN_STAR_OFFSETS_FROM_TIANFU).forEach(([star, offset]) => addStar(chart, star, moveBranch(tianfuBranch, offset), "十四正曜", {
    rule: "天府系：由天府所在宮依固定偏移安星",
    ruleInput: `天府=${tianfuBranch}, offset=${offset}`
  }));
  chart.metadata.ziweiBranch = ziweiBranch;
  chart.metadata.tianfuBranch = tianfuBranch;
}

function placeYearSmallStars(chart, input) {
  const horseBranch = branchByGroups(input.yearBranch, {
    申: ["寅", "午", "戌"],
    寅: ["申", "子", "辰"],
    亥: ["巳", "酉", "丑"],
    巳: ["亥", "卯", "未"]
  });
  addStar(chart, "天馬", horseBranch, "年系小星", { rule: "年支三合驛馬：寅午戌馬申，申子辰馬寅，巳酉丑馬亥，亥卯未馬巳", ruleInput: `年支=${input.yearBranch}` });
  addStar(chart, "天空", moveBranch(input.yearBranch, 1), "空曜", { rule: "天空：出生年支前一宮", ruleInput: `年支=${input.yearBranch}` });

  const redPhoenix = {
    子: "卯", 丑: "寅", 寅: "丑", 卯: "子", 辰: "亥", 巳: "戌",
    午: "酉", 未: "申", 申: "未", 酉: "午", 戌: "巳", 亥: "辰"
  }[input.yearBranch];
  addStar(chart, "紅鸞", redPhoenix, "年系小星", { rule: "紅鸞：卯上起子逆行", ruleInput: `年支=${input.yearBranch}` });
  addStar(chart, "天喜", moveBranch(redPhoenix, 6), "年系小星", { rule: "天喜：紅鸞對宮", ruleInput: `紅鸞=${redPhoenix}` });

  addStar(chart, "龍池", moveBranch("辰", branchIndex(input.yearBranch)), "年系小星", { rule: "龍池：辰上起子順行", ruleInput: `年支=${input.yearBranch}` });
  addStar(chart, "鳳閣", moveBranch("戌", -branchIndex(input.yearBranch)), "年系小星", { rule: "鳳閣：戌上起子逆行", ruleInput: `年支=${input.yearBranch}` });

  const cryVoid = {
    子: ["午", "午"], 丑: ["巳", "未"], 寅: ["辰", "申"], 卯: ["卯", "酉"], 辰: ["寅", "戌"], 巳: ["丑", "亥"],
    午: ["子", "子"], 未: ["亥", "丑"], 申: ["戌", "寅"], 酉: ["酉", "卯"], 戌: ["申", "辰"], 亥: ["午", "巳"]
  }[input.yearBranch];
  addStar(chart, "天哭", cryVoid[0], "年系小星", { rule: "天哭：午宮起子，依年支逆行", ruleInput: `年支=${input.yearBranch}` });
  addStar(chart, "天虛", cryVoid[1], "年系小星", { rule: "天虛：午宮起子，依年支順/對照表", ruleInput: `年支=${input.yearBranch}` });

  const lonely = {
    寅: ["巳", "丑"], 卯: ["巳", "丑"], 辰: ["巳", "丑"],
    巳: ["申", "辰"], 午: ["申", "辰"], 未: ["申", "辰"],
    申: ["亥", "未"], 酉: ["亥", "未"], 戌: ["亥", "未"],
    亥: ["寅", "戌"], 子: ["寅", "戌"], 丑: ["寅", "戌"]
  }[input.yearBranch];
  addStar(chart, "孤辰", lonely[0], "年系小星", { rule: "孤辰寡宿：依年支方局安孤辰", ruleInput: `年支=${input.yearBranch}` });
  addStar(chart, "寡宿", lonely[1], "年系小星", { rule: "孤辰寡宿：依年支方局安寡宿", ruleInput: `年支=${input.yearBranch}` });
}

function placeYearBranchShaStars(chart, input) {
  const jieSha = branchByGroups(input.yearBranch, {
    巳: ["申", "子", "辰"],
    申: ["亥", "卯", "未"],
    亥: ["寅", "午", "戌"],
    寅: ["巳", "酉", "丑"]
  });
  addStar(chart, "劫煞", jieSha, "年支神煞", {
    rule: "劫煞：依年支三合局取絕位；申子辰巳，亥卯未申，寅午戌亥，巳酉丑寅",
    ruleInput: `年支=${input.yearBranch} => 劫煞=${jieSha}`
  });

  const opposite = moveBranch(input.yearBranch, 6);
  const daHao = moveBranch(opposite, isYangBranch(input.yearBranch) ? 1 : -1);
  addStar(chart, "大耗", daHao, "年支神煞", {
    rule: "大耗：依年支對宮，再按陽支順、陰支逆移一宮",
    ruleInput: `年支=${input.yearBranch}, 對宮=${opposite}, ${isYangBranch(input.yearBranch) ? "陽支順一宮" : "陰支逆一宮"} => 大耗=${daHao}`
  });

  const feiLian = {
    子: "申", 丑: "酉", 寅: "戌",
    卯: "巳", 辰: "午", 巳: "未",
    午: "寅", 未: "卯", 申: "辰",
    酉: "亥", 戌: "子", 亥: "丑"
  }[input.yearBranch];
  addStar(chart, "蜚廉", feiLian, "年支神煞", {
    rule: "蜚廉：子丑寅在申酉戌；卯辰巳在巳午未；午未申在寅卯辰；酉戌亥在亥子丑",
    ruleInput: `年支=${input.yearBranch} => 蜚廉=${feiLian}`
  });

  const poSui = branchByGroups(input.yearBranch, {
    巳: ["子", "午", "卯", "酉"],
    酉: ["寅", "申", "巳", "亥"],
    丑: ["辰", "戌", "丑", "未"]
  });
  addStar(chart, "破碎", poSui, "年支神煞", {
    rule: "破碎：子午卯酉在巳；寅申巳亥在酉；辰戌丑未在丑",
    ruleInput: `年支=${input.yearBranch} => 破碎=${poSui}`
  });

  const huagai = huagaiPalace(input.yearBranch);
  addStar(chart, "華蓋", huagai, "年支神煞", {
    rule: "華蓋：辰丑戌未輪華蓋；華蓋子年由辰宮起，按辰丑戌未輪排十二支",
    ruleInput: `年支=${input.yearBranch}, index=${branchIndex(input.yearBranch)}, index % 4=${branchIndex(input.yearBranch) % 4} => 華蓋=${huagai}`
  });

  const xianchi = xianchiPalace(input.yearBranch);
  addStar(chart, "咸池", xianchi, "年支神煞", {
    rule: "咸池：酉午卯子布咸池；咸池由酉宮起子年，按酉午卯子輪排十二支",
    ruleInput: `年支=${input.yearBranch}, index=${branchIndex(input.yearBranch)}, index % 4=${branchIndex(input.yearBranch) % 4} => 咸池=${xianchi}`
  });

  const longde = palaceFromZiYearStart(input.yearBranch, "未");
  addStar(chart, "龍德", longde, "年支神煞", {
    rule: "龍德：龍德起羊；由未宮起子年順數至年支",
    ruleInput: `年支=${input.yearBranch}, index=${branchIndex(input.yearBranch)}, 未宮起子順數 => 龍德=${longde}`
  });

  const yuede = palaceFromZiYearStart(input.yearBranch, "巳");
  addStar(chart, "月德", yuede, "年支神煞", {
    rule: "月德：月起巳；由巳宮起子年順數至年支",
    ruleInput: `年支=${input.yearBranch}, index=${branchIndex(input.yearBranch)}, 巳宮起子順數 => 月德=${yuede}`
  });

  const tiande = palaceFromZiYearStart(input.yearBranch, "酉");
  addStar(chart, "天德", tiande, "年支神煞", {
    rule: "天德：天德星君起酉宮，順至生年定其蹤",
    ruleInput: `年支=${input.yearBranch}, index=${branchIndex(input.yearBranch)}, 酉宮起子順數 => 天德=${tiande}`
  });

  const nianjie = palaceFromZiYearStartReverse(input.yearBranch, "戌");
  addStar(chart, "年解", nianjie, "年支神煞", {
    rule: "年解：年解戌宮逆行去，數至生年可解凶",
    ruleInput: `年支=${input.yearBranch}, index=${branchIndex(input.yearBranch)}, 戌宮起子逆數 => 年解=${nianjie}`
  });
}

function placeDerivedSmallStars(chart, input) {
  const yearOffset = branchIndex(input.yearBranch);
  const ming = chart.palaces.find((palace) => palace.isMing);
  const shen = chart.palaces.find((palace) => palace.isShen);
  const wenqu = starBranch(chart, "文曲", "六吉星");
  const zuofu = starBranch(chart, "左輔", "六吉星");
  const youbi = starBranch(chart, "右弼", "六吉星");
  const wenchang = starBranch(chart, "文昌", "六吉星");
  const dayOffset = Number(input.lunarDay) - 1;

  const tiancai = moveBranch(ming.branch, yearOffset);
  addStar(chart, "天才", tiancai, "年/月/日/時小星", {
    rule: "天才：命宮起子天才順",
    ruleInput: `命宮=${ming.branch}, 年支=${input.yearBranch}, index=${yearOffset} => 天才=${tiancai}`
  });

  const tianshou = moveBranch(shen.branch, yearOffset);
  addStar(chart, "天壽", tianshou, "年/月/日/時小星", {
    rule: "天壽：身宮起子天壽堂",
    ruleInput: `身宮=${shen.branch}, 年支=${input.yearBranch}, index=${yearOffset} => 天壽=${tianshou}`
  });

  if (wenqu) {
    addStar(chart, "台輔", moveBranch(wenqu, 2), "年/月/日/時小星", {
      rule: "台輔：曲前二位是台輔",
      ruleInput: `文曲=${wenqu} => 台輔=${moveBranch(wenqu, 2)}`
    });
    addStar(chart, "封誥", moveBranch(wenqu, -2), "年/月/日/時小星", {
      rule: "封誥：曲後二位封誥鄉",
      ruleInput: `文曲=${wenqu} => 封誥=${moveBranch(wenqu, -2)}`
    });
  }

  if (zuofu) {
    addStar(chart, "三台", moveBranch(zuofu, dayOffset), "年/月/日/時小星", {
      rule: "三台：三台左輔起初一，數至生日是台宮",
      ruleInput: `左輔=${zuofu}, 農曆日=${input.lunarDay}, offset=${dayOffset} => 三台=${moveBranch(zuofu, dayOffset)}`
    });
  }

  if (youbi) {
    addStar(chart, "八座", moveBranch(youbi, -dayOffset), "年/月/日/時小星", {
      rule: "八座：八座右弼逆初一，數至生日定其蹤",
      ruleInput: `右弼=${youbi}, 農曆日=${input.lunarDay}, offset=-${dayOffset} => 八座=${moveBranch(youbi, -dayOffset)}`
    });
  }

  if (wenchang) {
    addStar(chart, "恩光", moveBranch(wenchang, dayOffset - 1), "年/月/日/時小星", {
      rule: "恩光：文昌順數至生日，退後一步是恩光",
      ruleInput: `文昌=${wenchang}, 農曆日=${input.lunarDay}, offset=${dayOffset - 1} => 恩光=${moveBranch(wenchang, dayOffset - 1)}`
    });
  }

  if (wenqu) {
    addStar(chart, "天貴", moveBranch(wenqu, dayOffset - 1), "年/月/日/時小星", {
      rule: "天貴：文曲順數至生日，退後一步天貴方",
      ruleInput: `文曲=${wenqu}, 農曆日=${input.lunarDay}, offset=${dayOffset - 1} => 天貴=${moveBranch(wenqu, dayOffset - 1)}`
    });
  }
}

function placeHourMalefics(chart, input, timeInfo) {
  const hourOffset = hourIndex(timeInfo.hourBranch);
  const fireStart = branchByGroups(input.yearBranch, {
    丑: ["寅", "午", "戌"],
    寅: ["申", "子", "辰"],
    卯: ["巳", "酉", "丑"],
    酉: ["亥", "卯", "未"]
  });
  const bellStart = branchByGroups(input.yearBranch, {
    卯: ["寅", "午", "戌"],
    戌: ["申", "子", "辰", "巳", "酉", "丑", "亥", "卯", "未"]
  });
  addStar(chart, "火星", moveBranch(fireStart, hourOffset), "六煞星", { rule: "火星：依年支三合定起點，子時起順行", ruleInput: `年支=${input.yearBranch}, 時=${timeInfo.hourBranch}, 起${fireStart}` });
  addStar(chart, "鈴星", moveBranch(bellStart, hourOffset), "六煞星", { rule: "鈴星：依年支三合定起點，子時起順行", ruleInput: `年支=${input.yearBranch}, 時=${timeInfo.hourBranch}, 起${bellStart}` });
  addStar(chart, "地空", moveBranch("亥", -hourOffset), "六煞星", { rule: "地空：亥上起子時逆行", ruleInput: `時=${timeInfo.hourBranch}` });
  addStar(chart, "地劫", moveBranch("亥", hourOffset), "六煞星", { rule: "地劫：亥上起子時順行", ruleInput: `時=${timeInfo.hourBranch}` });
}

function placeMonthStars(chart, input) {
  const month = input.effectiveLunarMonth || input.lunarMonth;
  addStar(chart, "天刑", moveBranch("酉", month - 1), "月系小星", { rule: "天刑：酉上起正月順行", ruleInput: `有效農曆月=${month}` });
  addStar(chart, "天姚", moveBranch("丑", month - 1), "月系小星", { rule: "天姚：天姚丑上順正月", ruleInput: `有效農曆月=${month}` });
  addStar(chart, "天巫", tianwuPalace(month), "月系小星", { rule: "天巫：巳申寅亥天巫位，分輪十二月星君", ruleInput: `有效農曆月=${month}` });
  addStar(chart, "天月", tianyueMinorPalace(month), "月系小星", { rule: "天月：一犬二蛇三在龍，四虎五羊六兔宮，七豬八羊九在虎，十馬冬犬臘寅中", ruleInput: `有效農曆月=${month}` });
  addStar(chart, "陰煞", yinshaPalace(month), "月系小星", { rule: "陰煞：寅子戌，申午辰，分六月，陰煞臨", ruleInput: `有效農曆月=${month}` });
  addStar(chart, "解神", jieshenPalace(month), "月系小星", { rule: "解神：單月沖宮覓解神，雙月還依單月辰；正二月同在申", ruleInput: `有效農曆月=${month}` });
}

function assignMingShenZhu(chart, input) {
  chart.metadata.mingZhu = {
    star: mingZhuByYearBranch(input.yearBranch),
    rule: "命主：子屬貪狼丑亥門，寅戌生人屬祿存，卯酉屬文巳未武，辰申廉宿午破軍",
    ruleInput: `年支=${input.yearBranch}`
  };
  chart.metadata.shenZhu = {
    star: shenZhuByYearBranch(input.yearBranch),
    rule: "身主：子午安身鈴火宿，丑未天相寅申梁，卯酉天同身主是，巳亥天機辰戌昌",
    ruleInput: `年支=${input.yearBranch}`
  };
}

function placeXunKong(chart, input) {
  const stemIndex = STEMS.indexOf(input.yearStem);
  const branchIdx = branchIndex(input.yearBranch);
  const cycleIndex = mod(branchIdx - stemIndex, 12);
  const emptyBranchesByCycleStart = {
    0: ["戌", "亥"],
    10: ["申", "酉"],
    8: ["午", "未"],
    6: ["辰", "巳"],
    4: ["寅", "卯"],
    2: ["子", "丑"]
  };
  const empties = emptyBranchesByCycleStart[cycleIndex] || [];
  empties.forEach((branch) => addStar(chart, "旬空", branch, "空曜", {
    notes: [emptyWeightNote(input.yearStem, branch)],
    rule: "旬空：依年干年支順數至癸後二位，並按年干陰陽分正空/傍空",
    ruleInput: `${input.yearStem}${input.yearBranch}, ${branch}=${emptyWeightNote(input.yearStem, branch)}`
  }));
}

function placeJieKong(chart, input) {
  const branchesByStem = {
    戊: ["子", "丑"], 癸: ["子", "丑"],
    丁: ["寅", "卯"], 壬: ["寅", "卯"],
    丙: ["辰", "巳"], 辛: ["辰", "巳"],
    乙: ["午", "未"], 庚: ["午", "未"],
    甲: ["申", "酉"], 己: ["申", "酉"]
  };
  const branches = branchesByStem[input.yearStem] || [];
  branches.forEach((branch) => addStar(chart, "截空", branch, "空曜", {
    notes: [emptyWeightNote(input.yearStem, branch)],
    rule: "截空：戊癸子丑起，推至甲己止；申酉是截空，戌亥不論此；按年干陰陽分正空/傍空",
    ruleInput: `年干=${input.yearStem}, ${branch}=${emptyWeightNote(input.yearStem, branch)}`
  }));
}

function placeStemNobles(chart, input) {
  const tianGuanFu = {
    甲: ["未", "酉"], 乙: ["辰", "申"], 丙: ["巳", "子"], 丁: ["寅", "亥"], 戊: ["卯", "卯"],
    己: ["酉", "寅"], 庚: ["亥", "午"], 辛: ["酉", "巳"], 壬: ["戌", "午"], 癸: ["午", "巳"]
  }[input.yearStem];
  addStar(chart, "天官", tianGuanFu[0], "年干貴曜", { rule: "安天官天福貴人訣：年干取天官", ruleInput: `年干=${input.yearStem}` });
  addStar(chart, "天福", tianGuanFu[1], "年干貴曜", { rule: "安天官天福貴人訣：年干取天福", ruleInput: `年干=${input.yearStem}` });

  const tianChu = { 甲: "巳", 丁: "巳", 乙: "午", 戊: "午", 辛: "午", 丙: "子", 己: "申", 庚: "寅", 壬: "酉", 癸: "亥" }[input.yearStem];
  addStar(chart, "天廚", tianChu, "年干貴曜", { rule: "安天廚訣：甲丁蛇、乙戊辛馬、丙鼠、己猴、庚虎、壬雞、癸豬", ruleInput: `年干=${input.yearStem}` });
}

function placeTianShangTianShi(chart, input) {
  const direction = fortuneDirection(input.yearStem, input.gender);
  const normal = direction.forward;
  placeStarAtPalaceName(chart, "天傷", normal ? "僕役宮" : "疾厄宮", "空曜", {
    rule: "安傷使：陽男陰女天傷奴僕；陰男陽女天傷疾厄",
    ruleInput: `${input.yearStem}${input.gender === "male" ? "男" : "女"} => ${direction.label}`
  });
  placeStarAtPalaceName(chart, "天使", normal ? "疾厄宮" : "僕役宮", "空曜", {
    rule: "安傷使：陽男陰女天使疾厄；陰男陽女天使奴僕",
    ruleInput: `${input.yearStem}${input.gender === "male" ? "男" : "女"} => ${direction.label}`
  });
}

function placeChangSheng(chart, bureau, direction) {
  const startByElement = { 水: "申", 土: "申", 木: "亥", 金: "巳", 火: "寅" };
  const names = ["長生", "沐浴", "冠帶", "臨官", "帝旺", "衰", "病", "死", "墓", "絕", "胎", "養"];
  const start = startByElement[bureau.element];
  names.forEach((name, index) => {
    const branch = moveBranch(start, direction.forward ? index : -index);
    addStar(chart, name, branch, "長生十二神", { rule: "長生十二神：依五行局起長生，隨大限方向順逆", ruleInput: `${bureau.name}, ${direction.label}, 長生起${start}` });
  });
}

function placeDoctorStars(chart, input, direction) {
  const luCun = LU_CUN_BY_STEM[input.yearStem];
  const names = ["博士", "力士", "青龍", "小耗", "將軍", "奏書", "飛廉", "喜神", "病符", "大耗", "伏兵", "官符"];
  names.forEach((name, index) => {
    const branch = moveBranch(luCun, direction.forward ? index : -index);
    addStar(chart, name, branch, "博士十二神", { rule: "博士十二神：博士起祿存，依陰陽男女順逆", ruleInput: `祿存=${luCun}, ${direction.label}` });
  });
}

function placeSuiqianStars(chart, input) {
  const names = ["歲建", "晦氣", "喪門", "貫索", "官符", "小耗", "大耗", "龍德", "白虎", "天德", "弔客", "病符"];
  names.forEach((name, index) => {
    addStar(chart, name, moveBranch(input.yearBranch, index), "歲前十二神", {
      rule: "歲前十二神：歲建起太歲年支，依序順排十二宮",
      ruleInput: `年支=${input.yearBranch}, offset=${index}`
    });
  });
}

function placeJiangqianStars(chart, input) {
  const start = jiangqianStartBranch(input.yearBranch);
  const names = ["將星", "攀鞍", "歲驛", "息神", "華蓋", "劫煞", "災煞", "天煞", "指背", "咸池", "月煞", "亡神"];
  names.forEach((name, index) => {
    addStar(chart, name, moveBranch(start, index), "將前十二神", {
      rule: "將前十二神：將星三合起旺地，依序順排十二宮",
      ruleInput: `年支=${input.yearBranch}, 將星起${start}, offset=${index}`
    });
  });
}

function placeSupportStars(chart, input, timeInfo) {
  const month = input.effectiveLunarMonth || input.lunarMonth;
  addStar(chart, "左輔", moveBranch("辰", month - 1), "六吉星", { rule: "月系：辰上順正月安左輔", ruleInput: `有效農曆月=${month}` });
  addStar(chart, "右弼", moveBranch("戌", -(month - 1)), "六吉星", { rule: "月系：戌上逆正月安右弼", ruleInput: `有效農曆月=${month}` });
  const localDegree = degreeInPalace(timeInfo.minutesPassedInHourBranch);
  addStar(chart, "文昌", moveBranch("戌", -hourIndex(timeInfo.hourBranch)), "六吉星", { localDegree, rule: "時系：戌上逆子時安文昌", ruleInput: `校正後=${timeInfo.hourBranch}時` });
  addStar(chart, "文曲", moveBranch("辰", hourIndex(timeInfo.hourBranch)), "六吉星", { localDegree, rule: "時系：辰上順子時安文曲", ruleInput: `校正後=${timeInfo.hourBranch}時` });
  const luCun = LU_CUN_BY_STEM[input.yearStem];
  addStar(chart, "祿存", luCun, "年干星", { rule: "年干：依天干定祿存", ruleInput: `年干=${input.yearStem}` });
  addStar(chart, "擎羊", moveBranch(luCun, 1), "六煞星", { notes: ["祿存前一位"], rule: "年干：擎羊居祿存前一位", ruleInput: `祿存=${luCun}` });
  addStar(chart, "陀羅", moveBranch(luCun, -1), "六煞星", { notes: ["祿存後一位"], rule: "年干：陀羅居祿存後一位", ruleInput: `祿存=${luCun}` });
  addStar(chart, "天魁", KUI_YUE_BY_STEM[input.yearStem].天魁, "六吉星", { rule: "年干：魁鉞表", ruleInput: `年干=${input.yearStem}` });
  addStar(chart, "天鉞", KUI_YUE_BY_STEM[input.yearStem].天鉞, "六吉星", { rule: "年干：魁鉞表", ruleInput: `年干=${input.yearStem}` });
}

function evaluateStrength(star, palace, chart) {
  if (isReferenceInput(chart) && REFERENCE_19710812.strengths[star.name]) {
    return REFERENCE_19710812.strengths[star.name];
  }
  if (!star.element) return null;
  const elements = star.element.split("/");
  if (elements.includes(palace.element)) return "旺";
  const generates = { 木: "火", 火: "土", 土: "金", 金: "水", 水: "木" };
  const controls = { 木: "土", 土: "水", 水: "火", 火: "金", 金: "木" };
  if (elements.some((element) => generates[palace.element] === element)) return "廟";
  if (elements.some((element) => generates[element] === palace.element)) return "利";
  if (elements.some((element) => controls[palace.element] === element)) return "陷";
  return "平";
}

function decorate(chart) {
  const transformations = FOUR_TRANSFORMATIONS_WEI[chart.input.yearStem];
  Object.entries(transformations).forEach(([kind, starName]) => chart.stars.filter((star) => star.name === starName).forEach((star) => star.transformations.push(kind)));
  chart.metadata.fourTransformations = transformations;
  chart.palaces.forEach((palace) => {
    palace.stars.forEach((star) => { star.strength = evaluateStrength(star, palace, chart); });
    palace.relationships = { opposite: branchByPalaceIndex(palace.id + 6), trines: [branchByPalaceIndex(palace.id + 4), branchByPalaceIndex(palace.id + 8)] };
  });
  chart.palaces.forEach((palace) => {
    const hasMain = palace.stars.some((star) => star.category === "十四正曜");
    const opposite = chart.palaces.find((item) => item.branch === palace.relationships.opposite);
    palace.borrowedFrom = hasMain ? null : opposite.branch;
    palace.borrowedStars = hasMain ? [] : opposite.stars.map((star) => ({
      name: star.name,
      category: star.category,
      transformations: star.transformations,
      sourceBranch: opposite.branch
    }));
  });
  chart.structures = chart.palaces
    .filter((palace) => palace.stars.length > 1 && palace.stars.some((star) => star.strength === "廟" || star.strength === "利"))
    .map((palace) => ({ name: "引通之局", palace: palace.branch, palaceName: palace.name }));
}

function smallLimitStartBranch(yearBranch) {
  return branchByGroups(yearBranch, {
    辰: ["寅", "午", "戌"],
    丑: ["亥", "卯", "未"],
    戌: ["申", "子", "辰"],
    未: ["巳", "酉", "丑"]
  });
}

function assignSmallLimits(chart, input) {
  const start = smallLimitStartBranch(input.yearBranch);
  const step = input.gender === "male" ? 1 : -1;
  chart.metadata.smallLimit = {
    startBranch: start,
    direction: input.gender === "male" ? "男命順行" : "女命逆行",
    rule: "小限：年支三合墓庫沖處一歲起，男順女逆，不分陰陽。"
  };
  chart.palaces.forEach((palace) => { palace.smallLimitAges = []; });
  for (let age = 1; age <= 120; age += 1) {
    const branch = moveBranch(start, (age - 1) * step);
    const palace = chart.palaces.find((item) => item.branch === branch);
    palace.smallLimitAges.push(age);
  }
}

function douJunBranch(flowYearBranch, lunarMonth, hourBranch) {
  const monthPalace = moveBranch(flowYearBranch, -(lunarMonth - 1));
  return moveBranch(monthPalace, hourIndex(hourBranch));
}

function assignDouJun(chart, input, timeInfo) {
  const month = input.effectiveLunarMonth || input.lunarMonth;
  const ziYear = douJunBranch("子", month, timeInfo.hourBranch);
  const natal = douJunBranch(input.yearBranch, month, timeInfo.hourBranch);
  chart.metadata.douJun = {
    ziYear,
    natalYear: natal,
    rule: "斗君：太歲宮起正月逆數至生月，再由該宮起子時順數至生時。",
    ruleInput: `有效農曆月=${month}, 時=${timeInfo.hourBranch}`
  };
}

function createNatalChart(input) {
  const timeInfo = correctedTime(input);
  const lunarMonthInfo = effectiveLunarMonth(input);
  const preparedInput = { ...input, effectiveLunarMonth: lunarMonthInfo.month };
  const chart = { kind: "natal", input, time: timeInfo, metadata: {}, palaces: [], stars: [], structures: [], debug: {} };
  chart.input = preparedInput;
  chart.palaces = buildPalaces(preparedInput, timeInfo);
  chart.metadata.bureau = determineBureau(preparedInput.yearStem, chart.palaces.find((palace) => palace.isMing).branch);
  chart.metadata.fortuneDirection = fortuneDirection(preparedInput.yearStem, preparedInput.gender);
  chart.metadata.effectiveLunarMonth = lunarMonthInfo;
  const flowYear = defaultFlowYear();
  chart.metadata.flowYear = {
    year: flowYear.year,
    stem: flowYear.stem,
    branch: flowYear.branch,
    label: `${flowYear.year} ${flowYear.stem}${flowYear.branch}`,
    transformations: FOUR_TRANSFORMATIONS_WEI[flowYear.stem],
    taiSuiBranch: flowYear.branch,
    notes: ["預留給後續流年四化、飛星與流曜 overlay provider。"]
  };
  chart.palaces.forEach((palace) => {
    palace.majorLimit.start = chart.metadata.bureau.number + palace.majorLimit.order * 10;
    palace.majorLimit.end = palace.majorLimit.start + 9;
  });
  chart.debug.calendar = {
    source: input.calendarMode === "solar" ? "Intl Chinese calendar" : "manual lunar",
    solarDate: input.solarDate || null,
    lunarFormatted: input.lunarFormatted,
    isLeapMonth: input.isLeapMonth,
    effectiveMonth: lunarMonthInfo.month,
    warning: input.isLeapMonth ? `此日為閏月；已依中州規則改用第 ${lunarMonthInfo.month} 月推算。${lunarMonthInfo.rule}` : "此命例非閏月；本次錯盤主因不是閏月。"
  };
  chart.debug.mingShen = { rule: "寅起正月，順至有效生月；命宮逆數至生時，身宮順數至生時", ...mingAndShenBranches(lunarMonthInfo.month, timeInfo.hourBranch) };
  chart.debug.bureau = { rule: "命宮宮干支取納音定五行局", ...chart.metadata.bureau };
  chart.debug.fortuneDirection = { rule: "陽男陰女順行，陰男陽女逆行", ...chart.metadata.fortuneDirection };
  assignSmallLimits(chart, preparedInput);
  assignDouJun(chart, preparedInput, timeInfo);
  placeMainStars(chart, preparedInput, chart.metadata.bureau);
  placeSupportStars(chart, preparedInput, timeInfo);
  placeHourMalefics(chart, preparedInput, timeInfo);
  placeYearSmallStars(chart, preparedInput);
  placeYearBranchShaStars(chart, preparedInput);
  placeDerivedSmallStars(chart, preparedInput);
  placeMonthStars(chart, preparedInput);
  assignMingShenZhu(chart, preparedInput);
  placeXunKong(chart, preparedInput);
  placeJieKong(chart, preparedInput);
  placeStemNobles(chart, preparedInput);
  placeTianShangTianShi(chart, preparedInput);
  placeChangSheng(chart, chart.metadata.bureau, chart.metadata.fortuneDirection);
  placeDoctorStars(chart, preparedInput, chart.metadata.fortuneDirection);
  placeSuiqianStars(chart, preparedInput);
  placeJiangqianStars(chart, preparedInput);
  decorate(chart);
  return chart;
}

function lessonById(stepId) {
  return (window.ZIWEI_TEACHING_DATA?.lessons || []).find((lesson) => lesson.id === stepId);
}

function lessonIndex(stepId) {
  return (window.ZIWEI_TEACHING_DATA?.lessons || []).findIndex((lesson) => lesson.id === stepId);
}

function completedSet() {
  const lessons = window.ZIWEI_TEACHING_DATA?.lessons || [];
  const activeIndex = Math.max(0, lessonIndex(lessonState.currentStepId));
  return new Set(lessons.slice(0, activeIndex + 1).map((lesson) => lesson.id));
}

function unmetPrerequisites(lesson) {
  return [];
}

function markLessonComplete(stepId) {
  lessonState.currentStepId = stepId;
  const lessons = window.ZIWEI_TEACHING_DATA?.lessons || [];
  const activeIndex = Math.max(0, lessonIndex(stepId));
  lessonState.completedStepIds = lessons.slice(0, activeIndex + 1).map((lesson) => lesson.id);
  saveLessonState();
}

function saveLessonState() {
  localStorage.setItem(LESSON_STORAGE_KEY, JSON.stringify({
    schemaVersion: 1,
    savedAt: new Date().toISOString(),
    data: lessonState
  }));
}

function loadLessonState() {
  try {
    const raw = localStorage.getItem(LESSON_STORAGE_KEY);
    if (!raw) return;
    const parsed = JSON.parse(raw);
    if (parsed.schemaVersion === 1 && parsed.data) {
      lessonState = { ...lessonState, ...parsed.data };
      const lessonIds = new Set((window.ZIWEI_TEACHING_DATA?.lessons || []).map((lesson) => lesson.id));
      if (!lessonIds.has(lessonState.currentStepId)) lessonState.currentStepId = "load-input";
      lessonState.completedStepIds = (lessonState.completedStepIds || []).filter((id) => lessonIds.has(id));
    }
  } catch (error) {
    console.warn("Unable to restore lesson state", error);
  }
}

function traceForLesson(stepId, chart) {
  const input = chart.input;
  const ming = chart.palaces.find((palace) => palace.isMing);
  const shen = chart.palaces.find((palace) => palace.isShen);
  const effectiveMonth = chart.metadata.effectiveLunarMonth.month;
  if (stepId === "load-input") {
    return traceObject(stepId, "載入出生資料", {
      inputs: { gender: input.gender, year: `${input.yearStem}${input.yearBranch}`, lunarMonth: input.lunarMonth, lunarDay: input.lunarDay, hourBranch: chart.time.hourBranch },
      mnemonic: ["先定年月日時，後起命身星曜"],
      ruleExplanation: ["手動教學模式使用已輸入的農曆年月日、時辰、性別與年干支；完整排盤模式的陽曆轉換目前標示待驗證。"],
      result: { label: `${input.yearStem}${input.yearBranch}年 ${input.lunarMonth}月${input.lunarDay}日 ${chart.time.hourBranch}時` },
      sourceReferences: [sourceReference("起盤資料", "斗數排盤以出生年、月、日、時為基礎。")]
    });
  }
  if (stepId === "effective-lunar-month") {
    return traceObject(stepId, "閏月月份歸屬判定", {
      inputs: { lunarMonth: input.lunarMonth, lunarDay: input.lunarDay, isLeapMonth: input.isLeapMonth },
      mnemonic: ["閏月一日至十五日照前月", "閏月十六日子時至月底作下月"],
      ruleExplanation: [chart.metadata.effectiveLunarMonth.rule],
      formula: "effectiveMonth = leap ? previousOrNext(lunarMonth) : lunarMonth",
      intermediateValues: [{ label: "有效農曆月", value: effectiveMonth }],
      result: { label: `有效農曆月為 ${effectiveMonth} 月` },
      sourceReferences: [sourceReference("閏月推算規則", "閏月一日至十五日照前月，十六日以後照下月。")]
    });
  }
  if (stepId === "yin-yang-gender") {
    const yang = isYangStem(input.yearStem);
    return traceObject(stepId, "判定年干陰陽與陰陽男女", {
      inputs: { yearStem: input.yearStem, gender: input.gender },
      mnemonic: ["甲丙戊庚壬為陽", "乙丁己辛癸為陰", "陽男陰女順，陰男陽女逆"],
      ruleExplanation: [`${input.yearStem} 為${yang ? "陽" : "陰"}干，${input.gender === "male" ? "男命" : "女命"} => ${chart.metadata.fortuneDirection.label}`],
      formula: "forward = (yangStem && male) || (!yangStem && female)",
      result: { label: chart.metadata.fortuneDirection.label },
      sourceReferences: [sourceReference("起大限", "陽男陰女順行，陰男陽女逆行。")]
    });
  }
  if (stepId === "build-palaces") {
    return traceObject(stepId, "建立十二地支宮位盤", {
      inputs: { branches: BRANCHES },
      mnemonic: ["十二地支循環不斷"],
      ruleExplanation: ["內部運算固定採子丑寅卯辰巳午未申酉戌亥順序；方盤只是顯示排列。"],
      path: BRANCHES,
      result: { label: "十二宮地支座標已建立" },
      sourceReferences: [sourceReference("排十二宮掌", "將手掌各部位固定對應地支十二宮位。")]
    });
  }
  if (stepId === "place-ming" || stepId === "place-shen") {
    const monthBase = moveBranch("寅", effectiveMonth - 1);
    const h = hourIndex(chart.time.hourBranch);
    const reverse = stepId === "place-ming";
    const path = buildPath(monthBase, h + 1, reverse ? "reverse" : "forward", true);
    return traceObject(stepId, reverse ? "安命宮" : "安身宮", {
      inputs: { effectiveMonth, hourBranch: chart.time.hourBranch },
      mnemonic: reverse ? ["寅起正月順至生月", "命宮逆數至生時"] : ["寅起正月順至生月", "身宮順數至生時"],
      ruleExplanation: [`生月宮為 ${monthBase}。從 ${monthBase} 起子時，${reverse ? "逆" : "順"}數至 ${chart.time.hourBranch} 時。起點算第一步。`],
      formula: reverse ? "命宮 = 生月宮 - hourIndex" : "身宮 = 生月宮 + hourIndex",
      startPalace: monthBase,
      direction: reverse ? "reverse" : "forward",
      inclusiveStart: true,
      count: h + 1,
      path,
      result: { palace: reverse ? ming.branch : shen.branch, label: `${reverse ? "命宮" : "身宮"}在${reverse ? ming.branch : shen.branch}` },
      sourceReferences: [sourceReference("安命身宮", reverse ? "命宮從生月宮起子時逆數至生時。" : "身宮從生月宮起子時順數至生時。")]
    });
  }
  if (stepId === "name-palaces") {
    const palacePath = PALACE_NAMES.map((name, index) => {
      const branch = moveBranch(ming.branch, -index);
      return `${branch}:${name.replace("宮", "")}`;
    });
    return traceObject(stepId, "逆布十二人事宮", {
      inputs: { mingBranch: ming.branch, palaceSequence: PALACE_NAMES },
      mnemonic: ["命宮起命，逆布十二宮", "命、兄、夫、子、財、疾、遷、僕、官、田、福、父"],
      ruleExplanation: [`命宮定在 ${ming.branch} 後，以 ${ming.branch} 為命宮，逆行依序布兄弟、夫妻、子女、財帛、疾厄、遷移、僕役、官祿、田宅、福德、父母。`],
      formula: "palaceName[index] = branch(mingBranch - index)",
      startPalace: ming.branch,
      direction: "reverse",
      inclusiveStart: true,
      count: 12,
      path: palacePath,
      result: { label: `十二人事宮由命宮 ${ming.branch} 逆布完成` },
      sourceReferences: [sourceReference("安十二宮", "命宮定後，逆行布兄弟、夫妻、子女、財帛、疾厄、遷移、僕役、官祿、田宅、福德、父母。")]
    });
  }
  if (stepId === "palace-stems") {
    return traceObject(stepId, "五虎遁安十二宮天干", {
      inputs: { yearStem: input.yearStem },
      mnemonic: ["甲己之年丙作首", "乙庚之歲戊為頭", "丙辛必定尋庚起", "丁壬壬位順行流", "若問戊癸何方發", "甲寅之上好追求"],
      ruleExplanation: ["程式以五虎遁表取得寅宮天干，再隨地支順序推十二宮天干。"],
      path: chart.palaces.map((palace) => `${palace.stem}${palace.branch}`),
      result: { label: `命宮干支 ${chart.metadata.bureau.palaceStemBranch}` },
      sourceReferences: [sourceReference("安十二宮天干表", "依出生年干安十二宮天干。")]
    });
  }
  if (stepId === "determine-bureau") {
    return traceObject(stepId, "定五行局", {
      inputs: { mingStemBranch: chart.metadata.bureau.palaceStemBranch },
      mnemonic: ["六十納音訣", "甲乙錦江煙　丙丁沒谷田　戊己營堤柳（子寅辰　午申戌）", "庚辛掛杖錢　壬癸林鐘滿　花甲納音全（丑卯巳　未酉亥）"],
      ruleExplanation: [`${chart.metadata.bureau.palaceStemBranch} 納音為 ${chart.metadata.bureau.nayin}，五行 ${chart.metadata.bureau.element} => ${chart.metadata.bureau.name}`],
      result: { label: chart.metadata.bureau.name },
      sourceReferences: [sourceReference("定五行局", "根據命宮所在宮位的干支，利用六十納音推導五行局。")]
    });
  }
  if (stepId === "four-transformations") {
    const transformations = chart.metadata.fourTransformations || {};
    return traceObject(stepId, "安生年四化", {
      inputs: { yearStem: input.yearStem, transformations },
      mnemonic: ["甲廉破武陽　乙機梁紫陰", "丙同機昌廉　丁陰同機巨", "戊貪陰陽機　己武貪梁曲", "庚陽武府同　辛巨陽曲昌", "壬梁紫府武　癸破巨陰貪"],
      ruleExplanation: [`取生年天干 ${input.yearStem}，按口訣依序定化祿、化權、化科、化忌。`, `本命四化：祿=${transformations.祿}，權=${transformations.權}，科=${transformations.科}，忌=${transformations.忌}。`],
      formula: "四字依序 = 祿、權、科、忌",
      path: Object.entries(transformations).map(([kind, starName]) => `${starName}:${kind}`),
      result: { label: Object.entries(transformations).map(([kind, starName]) => `${starName}化${kind}`).join("；") },
      sourceReferences: [sourceReference("安四化星訣", "甲廉破武陽，乙機梁紫陰，丙同機昌廉，丁陰同機巨，戊貪陰陽機，己武貪梁曲，庚陽武府同，辛巨陽曲昌，壬梁紫府武，癸破巨陰貪。")]
    });
  }
  if (stepId === "major-limit") {
    return traceObject(stepId, "起大限", {
      inputs: { bureau: chart.metadata.bureau.name, direction: chart.metadata.fortuneDirection.label },
      mnemonic: ["局數起第一大限", "陽男陰女順，陰男陽女逆"],
      ruleExplanation: [`命宮 ${ming.branch} 起 ${chart.metadata.bureau.number}-${chart.metadata.bureau.number + 9} 歲，${chart.metadata.fortuneDirection.label}布十二宮。`],
      path: chart.palaces.slice().sort((a, b) => a.majorLimit.order - b.majorLimit.order).map((palace) => `${palace.branch}:${palace.majorLimit.start}-${palace.majorLimit.end}`),
      result: { label: "大限已布入十二宮" },
      sourceReferences: [sourceReference("起大限", "依五行局數及陰陽男女方向起大限。")]
    });
  }
  if (stepId === "small-limit") {
    const smallLimit = chart.metadata.smallLimit;
    const firstPalace = chart.palaces.find((palace) => palace.branch === smallLimit.startBranch);
    return traceObject(stepId, "起小限", {
      inputs: { 出生年支: input.yearBranch, 性別: input.gender === "male" ? "男" : "女", 一歲起宮: smallLimit.startBranch, 方向: smallLimit.direction },
      mnemonic: ["小限以出生年支定一歲起宮", "男命順行，女命逆行"],
      ruleExplanation: [
        `先按出生年支的三合局選一歲起宮：寅午戌年起辰，亥卯未年起丑，申子辰年起戌，巳酉丑年起未。`,
        `${input.yearBranch} 屬 ${input.yearBranch === "寅" || input.yearBranch === "午" || input.yearBranch === "戌" ? "寅午戌" : input.yearBranch === "亥" || input.yearBranch === "卯" || input.yearBranch === "未" ? "亥卯未" : input.yearBranch === "申" || input.yearBranch === "子" || input.yearBranch === "辰" ? "申子辰" : "巳酉丑"} 三合局，因此一歲起於 ${smallLimit.startBranch} 宮。`,
        `${smallLimit.direction}：第 n 歲的宮位，從一歲起宮 ${smallLimit.startBranch} ${input.gender === "male" ? "順" : "逆"}數 n−1 格；每十二歲回到同一宮。`,
        "盤面左下底部以小字列各宮小限歲數摘要，避免與左上星曜、右上主星重疊。"
      ],
      formula: `startBranch = ${smallLimit.startBranch}; directionStep = ${input.gender === "male" ? "+1（順行）" : "−1（逆行）"}; smallLimitBranch(n) = moveBranch(startBranch, (n − 1) × directionStep)`,
      path: Array.from({ length: 6 }, (_, index) => `${moveBranch(smallLimit.startBranch, index * (input.gender === "male" ? 1 : -1))}:${index + 1}歲`),
      result: { palace: smallLimit.startBranch, label: `一歲起${smallLimit.startBranch}宮；${firstPalace?.smallLimitAges.slice(0, 5).join("、")}歲同宮。` },
      sourceReferences: [sourceReference("起小限", "小限以出生年支定一歲起宮，男順女逆，逐歲輪十二宮。")]
    });
  }
  if (stepId === "place-ziwei") {
    const day = Number(input.lunarDay);
    const bureau = chart.metadata.bureau.number;
    const supplement = mod(bureau - mod(day, bureau), bureau);
    const adjustedDay = day + supplement;
    const quotient = adjustedDay / bureau;
    const base = moveBranch("寅", quotient - 1);
    const result = chart.metadata.ziweiBranch;
    return traceObject(stepId, "安紫微星", {
      inputs: { lunarDay: day, bureauNumber: bureau },
      mnemonic: ["原書為生日除局數取商餘", "現排盤核心暫採補數法以對齊參考盤"],
      ruleExplanation: [
        `第 1 步：以農曆日 ${day} 除五行局數 ${bureau}。不足整除時補 ${supplement}，使 ${day} + ${supplement} = ${adjustedDay} 可以整除。`,
        `第 2 步：${adjustedDay} ÷ ${bureau} = ${quotient}，由寅宮把商數當作序號順數，得到基準宮 ${base}。`,
        supplement === 0 ? "第 3 步：補數為 0，不需校正，基準宮就是紫微落宮。" : `第 3 步：補數 ${supplement} 為${supplement % 2 === 1 ? "奇數，從基準宮逆" : "偶數，從基準宮順"}數 ${supplement} 格，得到紫微 ${result}。`,
        "注意：原書除法掌訣與此補數法有待進一步逐例校核；目前保留計算過程供比對。"
      ],
      formula: `supplement = (${bureau} − (${day} mod ${bureau})) mod ${bureau} = ${supplement}; adjustedDay = ${day} + ${supplement} = ${adjustedDay}; quotient = ${adjustedDay} ÷ ${bureau} = ${quotient}; ziwei = moveBranch(${base}, ${supplement === 0 ? 0 : supplement % 2 === 1 ? -supplement : supplement}) = ${result}`,
      path: [`寅:起算`, base, result],
      intermediateValues: [{ label: "農曆日", value: day }, { label: "五行局數", value: bureau }, { label: "補數", value: supplement }, { label: "補後日數", value: adjustedDay }, { label: "商", value: quotient }, { label: "基準宮", value: base }, { label: "紫微落宮", value: result }],
      result: { starName: "紫微", palace: result, label: `紫微在${result}` },
      sourceReferences: [sourceReference("起紫微星訣", "起紫微法，系以出生日數除以五行局數，得餘數及商數。", "needs_review")],
      warnings: ["原書除法掌訣與現行補數法需在 Phase 2 完成雙算法比對。"]
    });
  }
  const annualTrace = annualCycleTrace(stepId, input);
  if (annualTrace) return annualTrace;
  const derivedTrace = derivedSmallStarTrace(stepId, chart);
  if (derivedTrace) return derivedTrace;
  const monthTrace = monthStarTrace(stepId, chart);
  if (monthTrace) return monthTrace;
  const zhu = zhuTrace(stepId, chart);
  if (zhu) return zhu;
  if (stepId === "place-huagai") {
    const yearBranch = input.yearBranch;
    const yearBranchIndex = branchIndex(yearBranch);
    const cycle = ["辰", "丑", "戌", "未"];
    const remainder = yearBranchIndex % cycle.length;
    const result = huagaiPalace(yearBranch);
    return traceObject(stepId, "安華蓋", {
      inputs: {
        出生年支: yearBranch,
        年支順序: BRANCHES,
        年支索引: yearBranchIndex,
        辰丑戌未循環表: cycle,
        取餘數: `${yearBranchIndex} % 4 = ${remainder}`
      },
      mnemonic: ["辰丑戌未輪華蓋。華蓋子年由辰宮起，按辰丑戌未輪排十二支。"],
      ruleExplanation: [
        `出生年支為 ${yearBranch}，在「子、丑、寅、卯、辰、巳、午、未、申、酉、戌、亥」中的零起算索引是 ${yearBranchIndex}。`,
        `華蓋用「辰、丑、戌、未」四宮循環。${yearBranchIndex} % 4 = ${remainder}，所以取循環表第 ${remainder} 格：${result}。`,
        "白話：華蓋取三合局的墓庫位。申子辰局墓在辰，巳酉丑局墓在丑，寅午戌局墓在戌，亥卯未局墓在未。"
      ],
      formula: 'huagaiPalace = ["辰", "丑", "戌", "未"][yearBranchIndex % 4]',
      normalizedFormula: `${result} = ["辰", "丑", "戌", "未"][${yearBranchIndex} % 4]`,
      path: [`${yearBranch}:年支`, `${result}:華蓋`],
      intermediateValues: [
        { label: "出生年支", value: yearBranch },
        { label: "年支索引", value: yearBranchIndex },
        { label: "辰丑戌未循環表", value: cycle.join("、") },
        { label: "取餘數", value: `${yearBranchIndex} % 4 = ${remainder}` },
        { label: "最終落宮", value: result }
      ],
      result: { starName: "華蓋", palace: result, label: `華蓋安於${result}宮` },
      sourceReferences: [sourceReference("安華蓋", "辰丑戌未輪華蓋。華蓋子年由辰宮起，按辰丑戌未輪排十二支。")]
    });
  }
  const starSpecs = teachingStarSpecsForStep(stepId);
  if (starSpecs.length === 1) {
    const star = chart.stars.find((item) => starMatchesTeachingSpec(item, starSpecs[0]));
    if (star) {
      const isZiweiSeries = Object.prototype.hasOwnProperty.call(ZIWEI_SERIES_OFFSETS, star.name);
      const isTianfuSeries = Object.prototype.hasOwnProperty.call(TIANFU_SERIES_OFFSETS, star.name);
      const baseName = isZiweiSeries ? "紫微" : isTianfuSeries ? "天府" : "";
      const baseBranch = baseName === "紫微" ? chart.metadata.ziweiBranch : baseName === "天府" ? chart.metadata.tianfuBranch : "";
      const offset = isZiweiSeries ? ZIWEI_SERIES_OFFSETS[star.name] : isTianfuSeries ? TIANFU_SERIES_OFFSETS[star.name] : 0;
      const mnemonic = star.name === "破軍"
        ? ["七殺空三是破軍"]
        : isZiweiSeries
          ? ["紫微逆去宿天機", "隔一太陽武曲移", "天同隔二廉貞位"]
          : isTianfuSeries
            ? ["天府順行有太陰", "貪狼而後巨門臨", "隨來天相天梁繼", "七殺空三是破軍"]
            : lessonById(stepId)?.narration || [];
      return traceObject(stepId, lessonById(stepId)?.title || `安${star.name}`, {
        inputs: { baseStar: baseName, baseBranch, offset, starName: star.name },
        mnemonic,
        ruleExplanation: [
          baseName
            ? `${star.name} 由 ${baseName} 所在 ${baseBranch} 宮依固定偏移 ${offset} 安於 ${star.branch}。`
            : `${star.name} 依本步規則安於 ${star.branch}。`,
          "本步只將這一顆星加入教學盤，便於觀察前後差異。"
        ],
        formula: baseName ? `${star.name} = ${baseName}(${baseBranch}) + offset(${offset})` : "lookup/count rule",
        startPalace: baseBranch,
        direction: offset < 0 ? "reverse" : offset > 0 ? "forward" : "fixed",
        inclusiveStart: true,
        count: Math.abs(offset) + 1,
        path: baseBranch && baseBranch !== star.branch ? [baseBranch, star.branch] : [star.branch],
        result: { starName: star.name, palace: star.branch, label: `${star.name}安於${star.branch}` },
        sourceReferences: [sourceReference(isZiweiSeries ? "安紫微諸曜訣" : "安天府以下諸曜表", (lessonById(stepId)?.narration || []).join(" "))],
        warnings: lessonById(stepId)?.status === "needs_review" ? ["此步仍有來源差異待人工確認。"] : []
      });
    }
  }
  if (starSpecs.length > 1) {
    const stars = starSpecs.map((spec) => chart.stars.find((item) => starMatchesTeachingSpec(item, spec))).filter(Boolean);
    if (stars.length) {
      return traceObject(stepId, lessonById(stepId)?.title || "安星組", {
        inputs: { starNames: starSpecs.map((spec) => spec.category ? `${spec.name}（${spec.category}）` : spec.name), ruleIds: lessonById(stepId)?.ruleIds || [] },
        mnemonic: lessonById(stepId)?.narration || [],
        ruleExplanation: [
          "本步依口訣或查表一次安多顆星。教學盤會把本步所列星曜同時加入，結果逐顆列出以便核對。",
          stars.map((star) => `${star.name}：${star.branch}`).join("，")
        ],
        formula: "multi-star rule / lookup table",
        path: stars.map((star) => `${star.branch}:${star.name}`),
        result: { label: stars.map((star) => `${star.name}在${star.branch}`).join("；") },
        sourceReferences: [sourceReference(lessonById(stepId)?.title || "安星組", (lessonById(stepId)?.narration || []).join(" "), lessonById(stepId)?.status || "verified")],
        warnings: lessonById(stepId)?.status === "needs_review" ? ["此步仍有來源差異待人工確認。"] : []
      });
    }
  }
  return traceObject(stepId, lessonById(stepId)?.title || "教學步驟", {
    inputs: { ruleIds: lessonById(stepId)?.ruleIds || [] },
    mnemonic: lessonById(stepId)?.narration || [],
    ruleExplanation: [lessonById(stepId)?.status === "needs_core" ? "此步已先列入書中口訣/圖表文字，但排盤核心尚未實作落星；目前只供學習與後續接核心。" : "此步目前以教學資料呈現。"],
    result: { label: lessonById(stepId)?.status === "needs_core" ? "尚未落星：待接排盤核心" : "已由現有排盤核心完成" },
    sourceReferences: [sourceReference("安星次序", "安紫微系及天府系十四顆正曜後，立即安輔弼昌曲空劫、四化、魁鉞、祿羊陀等。", lessonById(stepId)?.status || "verified")]
  });
}

function starClass(star) {
  if (star.category === "十四正曜") return "main";
  if (star.category === "六吉星") return "good";
  if (star.category === "六煞星") return "bad";
  if (star.category === "博士十二神") return "doctor-star";
  if (star.category === "歲前十二神") return "suiqian-star";
  if (star.category === "將前十二神") return "jiangqian-star";
  return "other";
}

function readForm() {
  const form = document.querySelector("#birth-form");
  const data = new FormData(form);
  const calendarMode = data.get("calendarMode");
  const solarDate = data.get("solarDate");
  const clockTime = data.get("clockTime");
  const lunar = calendarMode === "solar" ? solarToLunar(solarDate) : null;
  const hour = clockTimeToHourBranch(clockTime);
  const manualYearStem = data.get("yearStem");
  const manualYearBranch = data.get("yearBranch");
  const lunarMonth = lunar ? lunar.lunarMonth : Number(data.get("lunarMonth"));
  const lunarDay = lunar ? lunar.lunarDay : Number(data.get("lunarDay"));
  const isLeapMonth = lunar ? lunar.isLeapMonth : data.get("isLeapMonth") === "on";
  const resolvedSolarDate = lunar ? solarDate : findSolarDateForLunarDate(Number(data.get("gregorianYear")), manualYearStem, manualYearBranch, lunarMonth, lunarDay, isLeapMonth);
  return {
    name: data.get("name") || "命盤",
    gender: data.get("gender"),
    calendarMode,
    solarDate: resolvedSolarDate || "",
    clockTime: calendarMode === "solar" ? clockTime : "",
    gregorianYear: lunar ? Number(solarDate.slice(0, 4)) : Number(data.get("gregorianYear")),
    yearStem: lunar ? lunar.yearStem : manualYearStem,
    yearBranch: lunar ? lunar.yearBranch : manualYearBranch,
    lunarMonth,
    lunarDay,
    hourBranch: calendarMode === "solar" ? hour.hourBranch : data.get("hourBranch"),
    minutesPassedInHourBranch: calendarMode === "solar" ? hour.minutesPassedInHourBranch : Number(data.get("minutesPassedInHourBranch")),
    longitude: Number(data.get("longitude")),
    timezoneLongitude: Number(data.get("timezoneLongitude")),
    equationOfTimeMinutes: Number(data.get("equationOfTimeMinutes")),
    isLeapMonth,
    lunarFormatted: lunar ? lunar.formatted : `${manualYearStem}${manualYearBranch}年 農曆${isLeapMonth ? "閏" : ""}${lunarMonth}月${lunarDay}日${resolvedSolarDate ? `（對應陽曆 ${resolvedSolarDate}）` : "（找不到對應陽曆日期）"}`
  };
}

function syncConvertedFields() {
  const form = document.querySelector("#birth-form");
  const mode = form.elements.calendarMode.value;
  const manual = mode === "lunar";
  const note = document.querySelector("#conversion-note");
  form.elements.yearStem.disabled = !manual;
  form.elements.yearBranch.disabled = !manual;
  form.elements.gregorianYear.disabled = !manual;
  form.elements.lunarMonth.disabled = !manual;
  form.elements.lunarDay.disabled = !manual;
  form.elements.hourBranch.disabled = !manual;
  form.elements.minutesPassedInHourBranch.disabled = !manual;
  form.elements.isLeapMonth.disabled = !manual;

  if (mode === "solar") {
    const lunar = solarToLunar(form.elements.solarDate.value);
    const hour = clockTimeToHourBranch(form.elements.clockTime.value);
    form.elements.yearStem.value = lunar.yearStem;
    renderYearBranchOptions(lunar.yearStem, lunar.yearBranch);
    yearInputLastChanged = "stem";
    syncGregorianYearOptions();
    form.elements.gregorianYear.value = form.elements.solarDate.value.slice(0, 4);
    form.elements.lunarMonth.value = lunar.lunarMonth;
    form.elements.lunarDay.value = lunar.lunarDay;
    form.elements.hourBranch.value = hour.hourBranch;
    form.elements.minutesPassedInHourBranch.value = hour.minutesPassedInHourBranch;
    form.elements.isLeapMonth.checked = lunar.isLeapMonth;
    syncDefaultBirthName(form, lunar);
    note.textContent = `陽曆 ${form.elements.solarDate.value} ${form.elements.clockTime.value} 已換算為 ${lunar.formatted}，${hour.hourBranch}時，時辰內 ${hour.minutesPassedInHourBranch} 分。`;
  } else {
    if (yearInputLastChanged === "stem") {
      renderYearStemOptions(form.elements.yearStem.value);
      renderYearBranchOptions(form.elements.yearStem.value, form.elements.yearBranch.value);
    } else if (yearInputLastChanged === "branch") {
      const selectedBranch = form.elements.yearBranch.value;
      form.elements.yearBranch.innerHTML = BRANCHES.map((branch) => `<option value="${branch}">${branch}</option>`).join("");
      form.elements.yearBranch.value = selectedBranch;
      renderYearStemOptions(form.elements.yearStem.value, form.elements.yearBranch.value);
    } else {
      renderYearStemOptions(form.elements.yearStem.value);
      document.querySelector("[name='yearBranch']").innerHTML = BRANCHES.map((branch) => `<option value="${branch}">${branch}</option>`).join("");
      form.elements.yearBranch.value = "亥";
    }
    syncGregorianYearOptions();
    syncDefaultBirthName(form);
    const selectedYear = form.elements.gregorianYear.value;
    note.textContent = `手動陰曆模式：可直接輸入干支年、農曆月日、生時地支與時辰內分鐘。西元生年可在每 60 年的對應年份中選擇，預設為最接近今年的 ${selectedYear} 年。`;
  }
}

function chipText(star) {
  const transform = star.transformations.length ? `(${star.transformations.join("")})` : "";
  const strength = star.strength ? `[${star.strength}]` : "";
  return `${star.name}${transform}${strength}`;
}

function renderStarGroup(stars, className) {
  return stars.map((star) => `<span class="star-chip ${className || starClass(star)}">${chipText(star)}</span>`).join("");
}

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  })[char]);
}

function isFourMalefic(starName) {
  return ["火星", "鈴星", "擎羊", "陀羅"].includes(starName);
}

function renderWenmoStarToken(star, className = starClass(star)) {
  const transformations = star.transformations.map((kind) => `<span class="transform-badge">${kind}</span>`).join("");
  const strength = star.strength ? `<span class="strength-badge">${star.strength}</span>` : "";
  const marker = isFourMalefic(star.name) ? `<span class="malefic-marker">▲</span>` : "";
  return `
    <span class="wm-star-token ${className}" title="${escapeHtml(`${star.name}・${star.category}・${star.branch}`)}">
      <span class="wm-star-name">${escapeHtml(star.name)}</span>
      <span class="wm-star-marks">${marker}${transformations}${strength}</span>
    </span>
  `;
}

function renderWenmoCycleZone(stars) {
  const groups = [
    ["博士", "博士十二神", "doctor-star", "doctor"],
    ["歲前", "歲前十二神", "suiqian-star", "suiqian"],
    ["將前", "將前十二神", "jiangqian-star", "jiangqian"]
  ].map(([label, category, className, slot]) => {
    const items = stars.filter((star) => star.category === category);
    if (!items.length) return "";
    return `<div class="wm-cycle-col wm-cycle-slot-${slot} wm-cycle-${className}" aria-label="${label}">${items.map((star) => renderWenmoStarToken(star, className)).join("")}</div>`;
  }).join("");
  return groups ? `<div class="wm-star-zone wm-zone-doctor">${groups}</div>` : "";
}

function renderWenmoAgeZone(majorLimit) {
  if (!majorLimit) return "";
  return `
    <div class="wm-age-zone" aria-label="大限 ${majorLimit.start} 到 ${majorLimit.end}">
      <span>${escapeHtml(majorLimit.start)}</span>
      <span class="wm-age-separator">|</span>
      <span>${escapeHtml(majorLimit.end)}</span>
    </div>
  `;
}

function renderWenmoSmallLimitZone(ages = []) {
  if (!ages.length) return "";
  return `<div class="wm-small-limit-zone" aria-label="小限 ${ages.slice(0, 8).join("、")}">${ages.slice(0, 8).map((age) => escapeHtml(age)).join(",")}</div>`;
}

function renderWenmoStars(stars, majorLimit = null, smallLimitAges = []) {
  const assistStars = new Set(["左輔", "右弼", "天魁", "天鉞", "文昌", "文曲", "祿存", "天馬"]);
  const lowerCycleCategories = ["博士十二神", "歲前十二神", "將前十二神"];
  const zones = [
    ["top-left", (star) => isFourMalefic(star.name) || assistStars.has(star.name)],
    ["main", (star) => star.category === "十四正曜"],
    ["misc", (star) => !["十四正曜", "長生十二神", ...lowerCycleCategories].includes(star.category) && !isFourMalefic(star.name) && !assistStars.has(star.name)],
    ["changsheng", (star) => star.category === "長生十二神"]
  ];
  const zoneHtml = zones
    .map(([zone, predicate]) => {
      const items = stars.filter(predicate);
      if (!items.length) return "";
      return `<div class="wm-star-zone wm-zone-${zone}">${items.map((star) => renderWenmoStarToken(star, starClass(star))).join("")}</div>`;
    })
    .join("");
  return `${zoneHtml}${renderWenmoCycleZone(stars)}${renderWenmoSmallLimitZone(smallLimitAges)}${renderWenmoAgeZone(majorLimit)}`;
}

function cloneChartShell(chart) {
  const palaces = chart.palaces.map((palace) => ({
    ...palace,
    stars: [],
    borrowedStars: [],
    borrowedFrom: null,
    relationships: palace.relationships || {}
  }));
  return { ...chart, palaces, stars: [] };
}

function addStarToStagedChart(staged, sourceStar, includeTransformations) {
  const palace = staged.palaces.find((item) => item.branch === sourceStar.branch);
  if (!palace) return;
  const star = {
    ...sourceStar,
    transformations: includeTransformations ? [...sourceStar.transformations] : []
  };
  palace.stars.push(star);
  staged.stars.push(star);
}

function teachingStarNamesForState(chart, activeStepId) {
  const lessons = window.ZIWEI_TEACHING_DATA?.lessons || [];
  const allowed = [];
  const activeIndex = Math.max(0, lessonIndex(activeStepId));
  lessons.forEach((lesson, index) => {
    if (index <= activeIndex) {
      teachingStarSpecsForStep(lesson.id).forEach((spec) => allowed.push(spec));
    }
  });
  const transformationIndex = lessonIndex("four-transformations");
  const showTransformations = transformationIndex >= 0 && transformationIndex <= activeIndex;
  if (showTransformations) {
    Object.values(chart.metadata.fourTransformations || {}).forEach((name) => allowed.push({ name }));
  }
  return allowed;
}

function buildTeachingChart(chart, activeStepId) {
  const staged = cloneChartShell(chart);
  const allowed = teachingStarNamesForState(chart, activeStepId);
  const activeIndex = Math.max(0, lessonIndex(activeStepId));
  const transformationIndex = lessonIndex("four-transformations");
  const includeTransformations = transformationIndex >= 0 && transformationIndex <= activeIndex;
  chart.stars.forEach((star) => {
    if (allowed.some((spec) => starMatchesTeachingSpec(star, spec))) addStarToStagedChart(staged, star, includeTransformations);
  });
  return staged;
}

function lessonReached(stepId) {
  const activeIndex = Math.max(0, lessonIndex(lessonState.currentStepId));
  const targetIndex = lessonIndex(stepId);
  return targetIndex >= 0 && targetIndex <= activeIndex;
}

function teachingVisibility() {
  return {
    showMingOnly: lessonReached("place-ming") && !lessonReached("name-palaces"),
    showPalaceNames: lessonReached("name-palaces"),
    showShen: lessonReached("place-shen"),
    showStems: lessonReached("palace-stems"),
    showMajorLimits: lessonReached("major-limit"),
    showSmallLimits: lessonReached("small-limit")
  };
}

function teachingCenterItems(chart) {
  if (!chart) return [];
  const items = [];
  if (lessonReached("load-input")) {
    items.push({
      label: "出生資料",
      value: `${chart.input.gender === "male" ? "男命" : "女命"}・${chart.input.yearStem}${chart.input.yearBranch}年・農曆${chart.input.lunarMonth}月${chart.input.lunarDay}日・${chart.time.hourBranch}時`
    });
  }
  if (lessonReached("effective-lunar-month")) {
    const info = chart.metadata.effectiveLunarMonth;
    items.push({
      label: "有效月份",
      value: `${info.month}月${info.adjusted ? "・閏月已校正" : "・非閏月調整"}`
    });
  }
  if (lessonReached("yin-yang-gender")) {
    items.push({
      label: "陰陽男女",
      value: chart.metadata.fortuneDirection.label
    });
  }
  if (lessonState.currentStepId === "determine-bureau" || lessonReached("determine-bureau")) {
    items.push({
      label: "五行局",
      value: `${chart.metadata.bureau.palaceStemBranch}・${chart.metadata.bureau.nayin}・${chart.metadata.bureau.name}`
    });
  }
  if (lessonReached("small-limit")) {
    items.push({
      label: "小限",
      value: `${chart.metadata.smallLimit.startBranch}宮一歲起・${chart.metadata.smallLimit.direction}`
    });
  }
  if (lessonReached("place-mingzhu")) {
    items.push({
      label: "命主",
      value: chart.metadata.mingZhu?.star || ""
    });
  }
  if (lessonReached("place-shenzhu")) {
    items.push({
      label: "身主",
      value: chart.metadata.shenZhu?.star || ""
    });
  }
  return items;
}

function renderTeachingCenter(chart) {
  const items = teachingCenterItems(chart);
  if (!items.length) return "";
  return `
    <div class="teaching-center-info">
      ${items.map((item) => `<div class="teaching-center-row"><span>${item.label}</span><strong>${item.value}</strong></div>`).join("")}
    </div>
  `;
}

function clearRelationshipHighlights(board) {
  board.querySelectorAll(".palace-cell").forEach((cell) => {
    cell.classList.remove("relationship-highlight", "relationship-focus", "relationship-opposite", "relationship-trine");
  });
}

function highlightPalaceRelationships(board, chart, branch) {
  clearRelationshipHighlights(board);
  const palace = chart.palaces.find((item) => item.branch === branch);
  if (!palace) return;
  const relatedBranches = [
    { branch, className: "relationship-focus" },
    { branch: palace.relationships.opposite, className: "relationship-opposite" },
    ...(palace.relationships.trines || []).map((trineBranch) => ({ branch: trineBranch, className: "relationship-trine" }))
  ].filter((item) => item.branch);
  relatedBranches.forEach((item) => {
    const cell = board.querySelector(`.palace-cell[data-branch="${item.branch}"]`);
    if (!cell) return;
    cell.classList.add("relationship-highlight");
    cell.classList.add(item.className);
  });
}

function renderSquare(chart, targetId = "square-board", options = {}) {
  const board = document.querySelector(`#${targetId}`);
  board.innerHTML = "";
  const isTeaching = Boolean(options.teaching);
  const visibility = isTeaching ? teachingVisibility() : {
    showPalaceNames: true,
    showShen: true,
    showStems: true,
    showMajorLimits: true,
    showSmallLimits: true
  };
  const positions = {
    巳: [1, 1], 午: [1, 2], 未: [1, 3], 申: [1, 4],
    辰: [2, 1], 酉: [2, 4],
    卯: [3, 1], 戌: [3, 4],
    寅: [4, 1], 丑: [4, 2], 子: [4, 3], 亥: [4, 4]
  };
  chart.palaces.forEach((palace) => {
    const cell = document.createElement("section");
    const borrowed = palace.borrowedStars?.length
      ? `<div class="borrowed-stars">借${palace.borrowedFrom}：${palace.borrowedStars.map((star) => star.name).join(" ")}</div>`
      : "";
    const branchText = visibility.showStems ? `${palace.stem}${palace.branch}` : palace.branch;
    let palaceName = "";
    if (visibility.showPalaceNames) {
      palaceName = `${palace.name.replace("宮", "")}${visibility.showShen && palace.isShen ? "・身" : ""}`;
    } else if (visibility.showMingOnly && palace.isMing) {
      palaceName = "命";
    }
    if (!visibility.showPalaceNames && visibility.showShen && palace.isShen) {
      palaceName = palaceName ? `${palaceName}・身` : "身";
    }
    const fitClass = palace.stars.length >= 13 ? " fit-xs" : palace.stars.length >= 9 ? " fit-sm" : "";
    cell.className = `palace-cell${isTeaching ? " teaching-cell" : ""}${fitClass}`;
    cell.dataset.branch = palace.branch;
    cell.style.gridRow = positions[palace.branch][0];
    cell.style.gridColumn = positions[palace.branch][1];
    const majorLimit = visibility.showMajorLimits ? palace.majorLimit : null;
    const smallLimitAges = visibility.showSmallLimits ? palace.smallLimitAges : [];
    cell.innerHTML = `
      <div class="wenmo-cell">
        <div class="wm-stars">${renderWenmoStars(palace.stars, majorLimit, smallLimitAges)}${borrowed}</div>
        <div class="wm-side">
          ${palaceName ? `<div class="wm-palace">${palaceName}</div>` : ""}
          <div class="wm-branch${visibility.showStems ? "" : " branch-only"}">${branchText}</div>
        </div>
      </div>
    `;
    board.appendChild(cell);
    cell.addEventListener("click", () => highlightPalaceRelationships(board, chart, palace.branch));
  });
  const center = document.createElement("section");
  center.className = "palace-cell center";
  center.innerHTML = isTeaching
    ? renderTeachingCenter(chart)
    : `<div class="center-mark"><strong>360°</strong><span>${chart.metadata.bureau.name}</span><span>${chart.metadata.fortuneDirection.label}</span><span>紫微在${chart.metadata.ziweiBranch}・天府在${chart.metadata.tianfuBranch}</span></div>`;
  board.appendChild(center);
}

function polar(cx, cy, radius, degree) {
  const theta = (degree - 90) * Math.PI / 180;
  return [cx + radius * Math.cos(theta), cy + radius * Math.sin(theta)];
}

function svgEl(name, attrs = {}) {
  const el = document.createElementNS("http://www.w3.org/2000/svg", name);
  Object.entries(attrs).forEach(([key, value]) => el.setAttribute(key, value));
  return el;
}

function wheelStarLayer(star) {
  if (star.category === "長生十二神") return null;
  const outerNames = new Set(["左輔", "右弼", "天魁", "天鉞", "文昌", "文曲", "祿存", "天馬", "火星", "鈴星", "擎羊", "陀羅", "地空", "地劫"]);
  if (star.category === "十四正曜" || outerNames.has(star.name) || star.category === "六吉星" || star.category === "六煞星") return "outer";
  if (["博士十二神", "歲前十二神", "將前十二神"].includes(star.category)) return "cycle";
  return "misc";
}

function wheelPalaceAngle(branch) {
  const index = PALACE_BRANCHES.indexOf(branch);
  return displayDegree(index * 30 + 15);
}

function wheelTextRotation(degree) {
  const normalized = normalizeDegree(degree);
  return normalized > 90 && normalized < 270 ? normalized + 180 : normalized;
}

function wheelRadialTextRotation(degree) {
  const normalized = normalizeDegree(degree);
  return normalized > 90 && normalized < 270 ? normalized : normalized + 180;
}

function wheelStarText(star) {
  const marker = isFourMalefic(star.name) ? "▲" : "";
  const transforms = star.transformations?.length ? star.transformations.join("") : "";
  const strength = star.strength ? star.strength : "";
  return `${marker}${star.name}${transforms}${strength}`;
}

function setWheelSelection(svg, key) {
  selectedWheelStarKey = key;
  svg.querySelectorAll(".wheel-star-selected").forEach((item) => item.classList.remove("wheel-star-selected"));
  svg.querySelectorAll("[data-wheel-key]").forEach((item) => {
    if (item.dataset.wheelKey === key) item.classList.add("wheel-star-selected");
  });
  const star = currentChart?.stars.find((item, index) => `${item.name}-${item.category}-${item.branch}-${index}` === key);
  const info = svg.querySelector("#wheel-selected-info");
  if (star && info) {
    info.textContent = `${star.name} ${star.branch}宮 ${star.degree.toFixed(2)}° / 圓盤 ${displayDegree(star.degree).toFixed(2)}°`;
  }
}

function addWheelStarPair(svg, star, key, dotRadius, dotDegree, textDegree, dotLane, textLane, textSize, textAnchor = "middle", rotateText = false, radialText = false) {
  const shownDegree = displayDegree(dotDegree);
  const [x, y] = polar(360, 360, dotLane, shownDegree);
  const dot = svgEl("circle", {
    class: `star-dot ${starClass(star)} wheel-star-target`,
    cx: x,
    cy: y,
    r: dotRadius,
    "data-wheel-key": key
  });
  const title = svgEl("title");
  title.textContent = `${star.name} ${star.branch}宮 ${star.degree.toFixed(2)}° / 圓盤${shownDegree.toFixed(2)}°`;
  dot.appendChild(title);
  svg.appendChild(dot);

  const [tx, ty] = polar(360, 360, textLane, textDegree);
  const text = svgEl("text", {
    class: `star-label wheel-star-target ${starClass(star)}`,
    x: tx,
    y: ty,
    "font-size": textSize,
    "text-anchor": textAnchor,
    transform: rotateText ? `rotate(${radialText ? wheelRadialTextRotation(textDegree) : wheelTextRotation(textDegree) + 90} ${tx} ${ty})` : "",
    "data-wheel-key": key
  });
  const marker = isFourMalefic(star.name) ? "▲" : "";
  const nameSpan = svgEl("tspan", { class: "wheel-star-name-part" });
  nameSpan.textContent = `${marker}${star.name}`;
  text.appendChild(nameSpan);
  (star.transformations || []).forEach((kind) => {
    const tspan = svgEl("tspan", { class: "wheel-transform-part", dx: 1 });
    tspan.textContent = kind;
    text.appendChild(tspan);
  });
  if (star.strength) {
    const strengthSpan = svgEl("tspan", { class: "wheel-strength-part", dx: 1 });
    strengthSpan.textContent = star.strength;
    text.appendChild(strengthSpan);
  }
  svg.appendChild(text);
  [dot, text].forEach((node) => node.addEventListener("click", (event) => {
    event.stopPropagation();
    setWheelSelection(svg, key);
  }));
}

function renderWheel(chart) {
  const svg = document.querySelector("#wheel");
  svg.innerHTML = "";
  const cx = 360, cy = 360;
  svg.appendChild(svgEl("circle", { class: "wheel-ring", cx, cy, r: 314 }));
  svg.appendChild(svgEl("circle", { class: "wheel-sector", cx, cy, r: 252 }));
  svg.appendChild(svgEl("circle", { class: "wheel-sector", cx, cy, r: 176 }));
  svg.appendChild(svgEl("circle", { class: "wheel-sector", cx, cy, r: 96 }));

  PALACE_BRANCHES.forEach((branch, index) => {
    const degree = index * 30;
    const shownDegree = displayDegree(degree);
    const [x1, y1] = polar(cx, cy, 82, shownDegree);
    const [x2, y2] = polar(cx, cy, 318, shownDegree);
    svg.appendChild(svgEl("line", { class: "wheel-sector", x1, y1, x2, y2 }));
    const palace = chart.palaces.find((item) => item.branch === branch);
    const angle = displayDegree(degree + 15);
    const [lx, ly] = polar(cx, cy, 345, angle);
    const changsheng = palace.stars.find((star) => star.category === "長生十二神")?.name || "";
    const label = svgEl("text", {
      class: "wheel-label wheel-outer-info",
      x: lx,
      y: ly,
      transform: `rotate(${wheelTextRotation(angle)} ${lx} ${ly})`
    });
    [
      [`${palace.stem}${branch} `, "wheel-outer-branch"],
      [`${palace.name.replace("宮", "")} `, "wheel-outer-palace"],
      [`${palace.majorLimit.start}-${palace.majorLimit.end}`, "wheel-outer-age"],
      [changsheng ? ` ${changsheng}` : "", "wheel-outer-changsheng"]
    ].forEach(([textValue, className]) => {
      if (!textValue) return;
      const tspan = svgEl("tspan", { class: className });
      tspan.textContent = textValue;
      label.appendChild(tspan);
    });
    svg.appendChild(label);
  });

  chart.stars.forEach((star, index) => {
    const key = `${star.name}-${star.category}-${star.branch}-${index}`;
    const layer = wheelStarLayer(star);
    if (!layer) return;
    const palaceStars = chart.stars.filter((item) => item.branch === star.branch && wheelStarLayer(item) === layer);
    const localIndex = palaceStars.findIndex((item) => item === star);
    if (layer === "outer") {
      const spreadCount = Math.max(1, palaceStars.length);
      const textAngle = wheelPalaceAngle(star.branch) - 14 + ((localIndex + 0.5) * 28 / spreadCount);
      const textLane = star.category === "十四正曜" ? 304 : 286;
      addWheelStarPair(svg, star, key, star.category === "十四正曜" ? 4.5 : 3.5, star.degree, textAngle, 270, textLane, star.category === "十四正曜" ? 12 : 10, "middle", true, true);
    } else if (layer === "misc") {
      const angle = wheelPalaceAngle(star.branch) - 12 + (localIndex % 6) * 4.8;
      const lane = 206 - (Math.floor(localIndex / 6) % 2) * 20;
      addWheelStarPair(svg, star, key, 2.8, star.degree, angle, 226, lane, 9, "middle", true);
    } else {
      const categorySlot = star.category === "博士十二神" ? 0 : star.category === "歲前十二神" ? 1 : 2;
      const sameCategoryIndex = chart.stars.filter((item) => item.branch === star.branch && item.category === star.category).findIndex((item) => item === star);
      const angle = wheelPalaceAngle(star.branch) - 9 + categorySlot * 9;
      const lane = 150 - sameCategoryIndex * 12;
      addWheelStarPair(svg, star, key, 2.6, star.degree, angle, 154, lane, 8, "middle", true);
    }
  });

  const centerText = svgEl("text", { x: cx, y: cy - 42, "text-anchor": "middle", "font-size": 18, "font-weight": 800, fill: "#25211c" });
  centerText.textContent = chart.input.name || "命盤";
  svg.appendChild(centerText);
  [
    `${chart.input.gender === "male" ? "男命" : "女命"}・${chart.input.yearStem}${chart.input.yearBranch}年`,
    `農曆${chart.input.lunarMonth}月${chart.input.lunarDay}日・${chart.time.hourBranch}時`,
    chart.metadata.bureau.name
  ].forEach((line, index) => {
    const subText = svgEl("text", { x: cx, y: cy - 16 + index * 18, "text-anchor": "middle", "font-size": 12, fill: "#746b61", "font-weight": index === 2 ? 800 : 600 });
    subText.textContent = line;
    svg.appendChild(subText);
  });
  const selectedInfo = svgEl("text", { id: "wheel-selected-info", x: cx, y: cy + 52, "text-anchor": "middle", "font-size": 11, fill: "#9c2f2f", "font-weight": 800 });
  selectedInfo.textContent = "點星曜或小點看角度";
  svg.appendChild(selectedInfo);
  svg.onclick = () => {
    selectedWheelStarKey = "";
    svg.querySelectorAll(".wheel-star-selected").forEach((item) => item.classList.remove("wheel-star-selected"));
    selectedInfo.textContent = "點星曜或小點看角度";
  };
  if (selectedWheelStarKey) setWheelSelection(svg, selectedWheelStarKey);
}

function renderDetails(chart) {
  const ming = chart.palaces.find((palace) => palace.isMing);
  const shen = chart.palaces.find((palace) => palace.isShen);
  document.querySelector("#headline").textContent = `${chart.input.name || "命盤"}：${chart.metadata.bureau.name}，命宮在${ming.branch}，身宮在${shen.branch}`;
  document.querySelector("#meta-row").innerHTML = [
    `${chart.input.gender === "male" ? "男命" : "女命"}`,
    chart.input.solarDate ? `陽曆 ${chart.input.solarDate} ${chart.input.clockTime}` : "手動陰曆",
    chart.input.lunarFormatted || `農曆${chart.input.lunarMonth}月${chart.input.lunarDay}日`,
    chart.input.effectiveLunarMonth !== chart.input.lunarMonth ? `有效農曆月 ${chart.input.effectiveLunarMonth}` : `農曆月 ${chart.input.lunarMonth}`,
    `${chart.input.yearStem}${chart.input.yearBranch}年`,
    `子年斗君 ${chart.metadata.douJun.ziYear}`,
    `真太陽時修正 ${chart.time.longitudeOffsetMinutes} 分`,
    `文昌文曲宮內 ${chart.stars.find((star) => star.name === "文昌").localDegree.toFixed(2)}°`
  ].map((item) => `<span class="tag">${item}</span>`).join("");

  document.querySelector("#star-list").innerHTML = chart.stars
    .slice()
    .sort((a, b) => a.degree - b.degree)
    .map((star) => `<div class="star-row"><strong>${chipText(star)}</strong> ${star.palaceName} ${star.branch}・原始 ${star.degree.toFixed(2)}°・圓盤 ${displayDegree(star.degree).toFixed(2)}°・強度 ${star.intensity}</div>`)
    .join("");

  const transformations = Object.entries(chart.metadata.fourTransformations).map(([kind, star]) => `<span class="transform-tag">${kind}：${star}</span>`).join(" ");
  const structures = chart.structures.length ? chart.structures.map((item) => `${item.name}@${item.palaceName}`).join("、") : "未偵測到已實作的特殊結構";
  const borrowed = chart.palaces.filter((palace) => palace.borrowedStars.length).map((palace) => `${palace.name}${palace.branch}借${palace.borrowedFrom}`).join("、");
  document.querySelector("#reading").innerHTML = `
    <div>${transformations}</div>
    <div><strong>結構：</strong>${structures}</div>
    <div><strong>斗君：</strong>子年斗君 ${chart.metadata.douJun.ziYear}，本生年斗君 ${chart.metadata.douJun.natalYear}。${chart.metadata.douJun.rule}</div>
    <div><strong>小限：</strong>${chart.metadata.smallLimit.startBranch}宮一歲起，${chart.metadata.smallLimit.direction}。</div>
    <div><strong>借星：</strong>${borrowed || "所有宮位皆有正曜，暫無需借星。"}</div>
    <div><strong>三方四正：</strong>命宮對宮 ${ming.relationships.opposite}，三方 ${ming.relationships.trines.join("、")}。</div>
    <div><strong>圓盤方位：</strong>顯示角度已旋轉，亥、子、丑、寅四宮位於下方 120° 到 240° 區域，方便與傳統方盤對照。</div>
  `;
  document.querySelector("#json-output").textContent = JSON.stringify(chart, null, 2);
}

function isReferenceInput(chart) {
  return chart.input.solarDate === "1971-08-12" && chart.input.clockTime === "11:30" && chart.input.gender === "male";
}

function starCompareRows(chart) {
  const reference = isReferenceInput(chart) ? REFERENCE_19710812 : null;
  const names = reference ? Object.keys(reference.stars) : chart.stars.map((star) => star.name);
  return names.map((name) => {
    const star = chart.stars.find((item) => item.name === name);
    const actual = star ? star.branch : "未排";
    const expected = reference ? reference.stars[name] : "";
    const ok = reference ? actual === expected : null;
    return {
      name,
      actual,
      expected,
      ok,
      strength: star?.strength || "",
      expectedStrength: reference?.strengths?.[name] || "",
      rule: star?.rule || "尚未實作/未記錄",
      ruleInput: star?.ruleInput || "",
      result: star ? `${star.palaceName} ${star.branch} (${star.degree.toFixed(2)}°)` : "無"
    };
  });
}

function renderDebug(chart) {
  const z = chart.debug.ziwei;
  const reference = isReferenceInput(chart) ? REFERENCE_19710812 : null;
  const rows = starCompareRows(chart);
  const mismatchCount = rows.filter((row) => row.ok === false).length;
  const shouldShowValidation = Boolean(reference && mismatchCount > 0);
  document.querySelector("#chart-layout")?.classList.toggle("validation-hidden", !shouldShowValidation);
  document.querySelector(".debug-panel")?.classList.toggle("is-hidden", !shouldShowValidation);
  const referenceSummary = reference
    ? `參考盤：${reference.bureau}，紫微在${reference.ziweiBranch}；目前不一致 ${mismatchCount} 顆。`
    : "目前只內建 1971-08-12 11:30 男命的參考盤。";
  const coverageRows = SCREENSHOT_STAR_COVERAGE.map(([group, stars, status]) => {
    const implemented = status.startsWith("implemented");
    return `
      <tr>
        <td>${group}</td>
        <td>${stars.join("、")}</td>
        <td class="${implemented ? "ok" : "bad"}">${implemented ? (status === "implemented" ? "已實作" : "已實作，仍需逐盤校驗") : "未實作"}</td>
      </tr>
    `;
  }).join("");

  document.querySelector("#debug-output").innerHTML = `
    <div class="debug-grid">
      <div class="debug-card"><strong>陰陽曆</strong><br>${chart.debug.calendar.lunarFormatted}<br>${chart.debug.calendar.warning}</div>
      <div class="debug-card"><strong>命身宮</strong><br>${chart.debug.mingShen.rule}<br>命宮 ${chart.debug.mingShen.mingBranch}，身宮 ${chart.debug.mingShen.shenBranch}</div>
      <div class="debug-card"><strong>五行局</strong><br>${chart.debug.bureau.rule}<br>${chart.debug.bureau.palaceStemBranch} ${chart.debug.bureau.nayin} => ${chart.debug.bureau.name}</div>
      <div class="debug-card"><strong>紫微定位</strong><br>${z.rule}<br>生日 ${z.lunarDay}，${z.bureauNumber}局，補數 ${z.supplement}，補後 ${z.adjustedDay}，商 ${z.quotient}，基準 ${z.base}，${z.direction} => ${z.result}</div>
      <div class="debug-card"><strong>大限方向</strong><br>${chart.debug.fortuneDirection.rule}<br>${chart.input.yearStem}${chart.input.yearBranch}年，${chart.input.gender === "male" ? "男" : "女"} => ${chart.debug.fortuneDirection.label}</div>
      <div class="debug-card"><strong>流月基準</strong><br>${chart.metadata.douJun.rule}<br>${chart.metadata.douJun.ruleInput}<br>子年 ${chart.metadata.douJun.ziYear}，本生年 ${chart.metadata.douJun.natalYear}</div>
      <div class="debug-card"><strong>參考盤狀態</strong><br>${referenceSummary}</div>
    </div>
    <table class="compare-table">
      <thead>
        <tr><th>附圖星曜類別</th><th>星曜</th><th>目前狀態</th></tr>
      </thead>
      <tbody>${coverageRows}</tbody>
    </table>
    <table class="compare-table">
      <thead>
        <tr>
          <th>星曜</th>
          <th>規則</th>
          <th>規則輸入</th>
          <th>程式結果</th>
          <th>參考落宮</th>
          <th>狀態/廟陷</th>
          <th>狀態</th>
        </tr>
      </thead>
      <tbody>
        ${rows.map((row) => `
          <tr>
            <td>${row.name}</td>
            <td>${row.rule}</td>
            <td>${row.ruleInput}</td>
            <td>${row.result}</td>
            <td>${row.expected || "未設定"}</td>
            <td>${row.strength || "未標"}${row.expectedStrength ? ` / 參考 ${row.expectedStrength}` : ""}</td>
            <td class="${row.ok === true ? "ok" : row.ok === false ? "bad" : ""}">${row.ok === true ? "一致" : row.ok === false ? "不一致" : "未比對"}</td>
          </tr>
        `).join("")}
      </tbody>
    </table>
  `;
}

function renderTrace(trace, lesson, blocked = []) {
  const panel = document.querySelector("#trace-panel");
  const warningHtml = [...(trace.warnings || []), ...blocked.map((id) => `缺少前置步驟：${lessonById(id)?.title || id}`)]
    .map((warning) => `<div class="trace-warning">${warning}</div>`)
    .join("");
  panel.innerHTML = `
    <div class="trace-title">${trace.title}</div>
    <div class="trace-meta">${lesson.status === "needs_review" ? "! 待人工確認" : "✓ 已核實"}・${lesson.type}</div>
    ${warningHtml}
    <section><h3>本步目的</h3><p>${lesson.purpose || `完成「${lesson.title}」並核對結果。`}</p></section>
    <section><h3>原書口訣</h3>${(trace.mnemonic || []).map((item) => `<p class="mnemonic">${item}</p>`).join("") || "<p>此步尚待補入原文口訣。</p>"}</section>
    <section><h3>白話拆解</h3>${(trace.ruleExplanation || []).map((item) => `<p>${item}</p>`).join("")}</section>
    <section><h3>使用資料</h3><pre>${JSON.stringify(trace.inputs, null, 2)}</pre></section>
    <section><h3>算法</h3><p>${trace.formula || "查表/固定偏移"}</p><p>${trace.normalizedFormula || ""}</p></section>
    ${(trace.intermediateValues || []).length ? `<section><h3>中間值</h3>${trace.intermediateValues.map((item) => `<p><strong>${item.label}</strong>：${item.value}</p>`).join("")}</section>` : ""}
    <section><h3>宮位路徑</h3><p>${trace.path?.length ? trace.path.join(" → ") : "無宮位移動路徑"}</p></section>
    <section><h3>結果</h3><p>${trace.result?.label || JSON.stringify(trace.result)}</p></section>
    <section><h3>常見錯誤</h3>${(lesson.commonMistakes || []).map((item) => `<p>${item}</p>`).join("")}</section>
    <section><h3>資料來源</h3>${(trace.sourceReferences || []).map((src) => `<p>${src.bookTitle}・${src.section}・${src.sourceFile || ""}<br><span>${src.text || ""}</span><br><strong>${src.verificationStatus || "verified"}</strong></p>`).join("")}</section>
  `;
}

function renderLessonList(chart) {
  const list = document.querySelector("#lesson-list");
  const lessons = window.ZIWEI_TEACHING_DATA?.lessons || [];
  const activeIndex = Math.max(0, lessonIndex(lessonState.currentStepId));
  const groupLabelForLesson = (lesson) => {
    if (lesson.id === "place-doctor-1") return "博士十二神";
    if (lesson.id === "place-suiqian-1") return "歲前十二神";
    if (lesson.id === "place-jiangqian-1") return "將前十二神";
    return "";
  };
  list.innerHTML = lessons.map((lesson, index) => {
    const active = lesson.id === lessonState.currentStepId;
    const done = index <= activeIndex;
    const marker = done ? "✓" : lesson.status === "needs_review" ? "!" : "○";
    const group = groupLabelForLesson(lesson);
    return `${group ? `<div class="lesson-group-heading">${group}</div>` : ""}<button type="button" class="lesson-step ${active ? "active" : ""} ${done ? "done" : ""}" data-lesson-id="${lesson.id}" aria-current="${active ? "step" : "false"}">${marker} ${index + 1}. ${lesson.shortTitle}</button>`;
  }).join("");
  list.querySelectorAll("[data-lesson-id]").forEach((button) => {
    button.addEventListener("click", () => runLessonStep(button.dataset.lessonId, chart));
  });
}

function branchFromPathToken(token) {
  const text = String(token || "");
  const exact = BRANCHES.find((branch) => text === branch);
  if (exact) return exact;
  const stemBranchMatch = text.match(/[甲乙丙丁戊己庚辛壬癸]?([子丑寅卯辰巳午未申酉戌亥])/);
  return stemBranchMatch ? stemBranchMatch[1] : "";
}

function highlightLessonPath(path = []) {
  document.querySelectorAll("#teaching-square-board .palace-cell").forEach((cell) => cell.classList.remove("lesson-highlight"));
  const pathPanel = document.querySelector("#lesson-path");
  pathPanel.textContent = path.length ? `路徑：${path.join(" → ")}` : "本步無宮位路徑";
  path.forEach((token) => {
    const branch = branchFromPathToken(token);
    if (!branch) return;
    const cell = document.querySelector(`#teaching-square-board .palace-cell[data-branch="${branch}"]`);
    if (cell) cell.classList.add("lesson-highlight");
  });
}

function chartDownloadFilename(chart) {
  const gender = chart.input.gender === "male" ? "男" : "女";
  const datePart = chart.input.solarDate
    ? `${chart.input.solarDate}_${chart.input.clockTime || ""}`
    : `${chart.input.yearStem}${chart.input.yearBranch}_農曆${chart.input.lunarMonth}月${chart.input.lunarDay}日_${chart.time.hourBranch}時`;
  return `${datePart}_${gender}命`.replace(/[\\/:*?"<>|\s]+/g, "-");
}

function triggerDownload(url, filename) {
  const link = document.createElement("a");
  link.download = filename;
  link.href = url;
  link.style.display = "none";
  document.body.appendChild(link);
  link.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true, view: window }));
  link.remove();
}

function canvasTextColorForStar(star) {
  if (star.category === "十四正曜") return "#b42318";
  if (["左輔", "右弼", "天魁", "天鉞", "文昌", "文曲", "祿存", "天馬"].includes(star.name)) return "#1264c8";
  if (["火星", "鈴星", "擎羊", "陀羅", "地空", "地劫"].includes(star.name)) return "#8f1d1d";
  if (star.category === "博士十二神") return "#2f7d73";
  if (star.category === "歲前十二神") return "#8b5a00";
  if (star.category === "將前十二神") return "#7950a8";
  return "#25211c";
}

function drawVerticalText(context, text, x, y, size, color = "#25211c", weight = "700", lineHeight = size * 1.05) {
  context.save();
  context.fillStyle = color;
  context.font = `${weight} ${size}px "PingFang TC", "Noto Sans TC", "Microsoft JhengHei", sans-serif`;
  context.textAlign = "center";
  context.textBaseline = "top";
  String(text).split("").forEach((char, index) => context.fillText(char, x, y + index * lineHeight));
  context.restore();
}

function drawTextLine(context, text, x, y, size, color = "#25211c", weight = "700", align = "left") {
  context.save();
  context.fillStyle = color;
  context.font = `${weight} ${size}px "PingFang TC", "Noto Sans TC", "Microsoft JhengHei", sans-serif`;
  context.textAlign = align;
  context.textBaseline = "top";
  context.fillText(String(text), x, y);
  context.restore();
}

function downloadChartCanvasPng(chart, filename) {
  const staged = buildTeachingChart(chart, lessonState.currentStepId);
  const visibility = teachingVisibility();
  const scale = 2;
  const cellW = 360;
  const cellH = 250;
  const width = cellW * 4;
  const height = cellH * 4;
  const canvas = document.createElement("canvas");
  canvas.width = width * scale;
  canvas.height = height * scale;
  const context = canvas.getContext("2d");
  context.scale(scale, scale);
  context.fillStyle = "#fffaf1";
  context.fillRect(0, 0, width, height);
  const positions = {
    巳: [0, 0], 午: [1, 0], 未: [2, 0], 申: [3, 0],
    辰: [0, 1], 酉: [3, 1],
    卯: [0, 2], 戌: [3, 2],
    寅: [0, 3], 丑: [1, 3], 子: [2, 3], 亥: [3, 3]
  };
  staged.palaces.forEach((palace) => {
    const [col, row] = positions[palace.branch];
    const x = col * cellW;
    const y = row * cellH;
    context.strokeStyle = "#d8cec0";
    context.lineWidth = 1;
    context.strokeRect(x, y, cellW, cellH);
    const mainStars = palace.stars.filter((star) => star.category === "十四正曜");
    mainStars.forEach((star, index) => {
      drawVerticalText(context, star.name, x + cellW - 44 - index * 34, y + 16, 30, "#b42318", "800", 28);
      if (star.strength) drawTextLine(context, star.strength, x + cellW - 46 - index * 34, y + 86, 14, "#6f6760", "700", "center");
    });
    const topLeft = palace.stars.filter((star) => star.category !== "十四正曜" && (["左輔", "右弼", "天魁", "天鉞", "文昌", "文曲", "祿存", "天馬", "火星", "鈴星", "擎羊", "陀羅", "地空", "地劫"].includes(star.name)));
    topLeft.forEach((star, index) => drawVerticalText(context, star.name, x + 28 + index * 23, y + 18, 19, canvasTextColorForStar(star), "800", 18));
    const misc = palace.stars.filter((star) => !["十四正曜", "長生十二神", "博士十二神", "歲前十二神", "將前十二神"].includes(star.category) && !topLeft.includes(star));
    misc.slice(0, 10).forEach((star, index) => drawVerticalText(context, star.name, x + 28 + index * 23, y + 112, 18, canvasTextColorForStar(star), "700", 17));
    const cycleCategories = ["博士十二神", "歲前十二神", "將前十二神"];
    cycleCategories.forEach((category, groupIndex) => {
      palace.stars.filter((star) => star.category === category).forEach((star, index) => {
        drawVerticalText(context, star.name, x + 28 + groupIndex * 54 + index * 20, y + cellH - 64, 18, canvasTextColorForStar(star), "800", 17);
      });
    });
    const changsheng = palace.stars.find((star) => star.category === "長生十二神");
    if (changsheng) drawTextLine(context, changsheng.name, x + cellW * 0.55, y + cellH - 34, 18, "#25211c", "700", "center");
    if (visibility.showSmallLimits && palace.smallLimitAges?.length) {
      drawTextLine(context, palace.smallLimitAges.slice(0, 8).join(","), x + 18, y + cellH - 18, 11, "#6f3ba5", "800");
    }
    if (visibility.showMajorLimits) {
      drawTextLine(context, String(palace.majorLimit.start), x + cellW * 0.66, y + cellH - 74, 18, "#2f2b27", "700", "center");
      drawTextLine(context, "|", x + cellW * 0.66, y + cellH - 52, 15, "#6d6258", "700", "center");
      drawTextLine(context, String(palace.majorLimit.end), x + cellW * 0.66, y + cellH - 34, 18, "#2f2b27", "700", "center");
    }
    const palaceName = visibility.showPalaceNames ? palace.name.replace("宮", "") : palace.isMing && visibility.showMingOnly ? "命" : "";
    if (palaceName) drawVerticalText(context, palaceName + (visibility.showShen && palace.isShen ? "身" : ""), x + cellW - 78, y + cellH - 78, 24, "#f04438", "800", 22);
    drawVerticalText(context, visibility.showStems ? `${palace.stem}${palace.branch}` : palace.branch, x + cellW - 32, y + cellH - 82, 31, "#1f1b17", "800", 30);
  });
  context.fillStyle = "#f1e7d9";
  context.fillRect(cellW, cellH, cellW * 2, cellH * 2);
  context.strokeStyle = "#d8cec0";
  context.strokeRect(cellW, cellH, cellW * 2, cellH * 2);
  drawTextLine(context, chart.input.name || "命盤", cellW * 2, cellH * 1.65, 32, "#25211c", "800", "center");
  drawTextLine(context, `${chart.input.gender === "male" ? "男命" : "女命"}・${chart.input.yearStem}${chart.input.yearBranch}年・農曆${chart.input.lunarMonth}月${chart.input.lunarDay}日・${chart.time.hourBranch}時`, cellW * 2, cellH * 1.9, 22, "#25211c", "700", "center");
  triggerDownload(canvas.toDataURL("image/png"), `${filename}.png`);
}

function downloadElementAsPng(element, filename) {
  if (!currentChart) return;
  downloadChartCanvasPng(currentChart, filename);
}

function runLessonStep(stepId, chart = currentChart) {
  if (!chart) return;
  const lesson = lessonById(stepId);
  if (!lesson) return;
  const lessons = window.ZIWEI_TEACHING_DATA?.lessons || [];
  const activeIndex = Math.max(0, lessonIndex(stepId));
  const completedCount = activeIndex + 1;
  const blocked = unmetPrerequisites(lesson);
  const trace = traceForLesson(stepId, chart);
  lessonState.currentStepId = stepId;
  markLessonComplete(stepId);
  renderSquare(buildTeachingChart(chart, stepId), "teaching-square-board", { teaching: true });
  renderLessonList(chart);
  renderTrace(trace, lesson, blocked);
  highlightLessonPath(trace.highlightPath || trace.path || []);
  const nextLesson = lessons[activeIndex + 1];
  const nextHint = nextLesson
    ? `下一步提示：${nextLesson.title}。請先自行推斷：${nextLesson.purpose || nextLesson.narration?.[0] || `完成「${nextLesson.title}」的計算。`}`
    : "已是最後一步，可按「完整排盤」檢視完整結果。";
  document.querySelector("#lesson-status").innerHTML = `已重建至：${lesson.title}。盤面包含第 1-${completedCount} 步，完成 ${completedCount}/${lessons.length} 步。<span class="lesson-next-hint">${nextHint}</span>`;
}

function runCompleteChart(chart = currentChart) {
  if (!chart) return;
  const lessons = window.ZIWEI_TEACHING_DATA?.lessons || [];
  const lastLesson = lessons[lessons.length - 1];
  if (!lastLesson) return;
  lessonState.currentStepId = lastLesson.id;
  markLessonComplete(lastLesson.id);
  renderSquare(buildTeachingChart(chart, lastLesson.id), "teaching-square-board", { teaching: true });
  renderLessonList(chart);
  renderTrace(traceForLesson(lastLesson.id, chart), lastLesson, []);
  highlightLessonPath([]);
  document.querySelector("#lesson-status").innerHTML = `已完成完整排盤。盤面包含全部 ${lessons.length} 步。`;
}

function setupLessonControls() {
  document.querySelector("#lesson-prev").addEventListener("click", () => {
    const lessons = window.ZIWEI_TEACHING_DATA?.lessons || [];
    const index = Math.max(0, lessonIndex(lessonState.currentStepId) - 1);
    runLessonStep(lessons[index]?.id, currentChart);
  });
  document.querySelector("#lesson-next").addEventListener("click", () => {
    const lessons = window.ZIWEI_TEACHING_DATA?.lessons || [];
    const index = Math.min(lessons.length - 1, lessonIndex(lessonState.currentStepId) + 1);
    runLessonStep(lessons[index]?.id, currentChart);
  });
  document.querySelector("#lesson-complete").addEventListener("click", () => runCompleteChart(currentChart));
  document.querySelector("#lesson-reset").addEventListener("click", () => {
    lessonState = { currentStepId: "load-input", completedStepIds: [], expanded: false };
    saveLessonState();
    runLessonStep("load-input", currentChart);
  });
  document.querySelector("#lesson-toggle-all").addEventListener("click", () => {
    lessonState.expanded = !lessonState.expanded;
    saveLessonState();
    document.querySelector(".teaching-panel").classList.toggle("expanded", lessonState.expanded);
  });
  document.querySelector("#download-chart").addEventListener("click", () => {
    if (!currentChart) return;
    const target = document.querySelector("#teaching-square-board");
    downloadElementAsPng(target, chartDownloadFilename(currentChart));
  });
}

function render(chart) {
  currentChart = chart;
  renderSquare(chart);
  renderWheel(chart);
  renderDetails(chart);
  renderDebug(chart);
  renderLessonList(chart);
  runLessonStep(lessonState.currentStepId, chart);
}

function populateSelects() {
  document.querySelectorAll("[data-options='stems']").forEach((select) => {
    select.innerHTML = STEMS.map((stem) => `<option value="${stem}">${stem}</option>`).join("");
  });
  document.querySelectorAll("[data-options='branches']").forEach((select) => {
    select.innerHTML = BRANCHES.map((branch) => `<option value="${branch}">${branch}</option>`).join("");
  });
  document.querySelector("[name='yearStem']").value = "辛";
  document.querySelectorAll("[data-options='year-branches']").forEach((select) => {
    select.innerHTML = BRANCHES.map((branch) => `<option value="${branch}">${branch}</option>`).join("");
    select.value = "亥";
  });
  syncGregorianYearOptions();
  document.querySelector("[name='hourBranch']").value = "午";
}

function setTodayNoonDefaults() {
  const form = document.querySelector("#birth-form");
  form.elements.calendarMode.value = "lunar";
}

function setupChartControls() {
  document.querySelectorAll("[data-toggle-card]").forEach((button) => {
    button.addEventListener("click", () => {
      const card = document.getElementById(button.dataset.toggleCard);
      card.classList.toggle("collapsed");
      button.textContent = card.classList.contains("collapsed") ? "展開" : "收合";
    });
  });

  document.querySelectorAll("[data-max-card]").forEach((button) => {
    button.addEventListener("click", () => {
      const layout = document.querySelector("#chart-layout");
      const card = document.getElementById(button.dataset.maxCard);
      const isMax = card.classList.contains("maximized");
      document.querySelectorAll(".chart-card").forEach((item) => item.classList.remove("maximized"));
      document.querySelectorAll("[data-max-card]").forEach((item) => { item.textContent = "最大化"; });
      layout.classList.toggle("has-maximized", !isMax);
      if (!isMax) {
        card.classList.add("maximized");
        button.textContent = "還原";
      }
    });
  });
}

function setupInputPanelControls() {
  const toggle = document.querySelector("#input-toggle");
  const shell = document.querySelector(".app-shell");
  const applyState = (collapsed) => {
    shell.classList.toggle("input-collapsed", collapsed);
    toggle.setAttribute("aria-expanded", String(!collapsed));
    toggle.textContent = collapsed ? "展開生辰" : "收合生辰";
    localStorage.setItem(INPUT_COLLAPSED_STORAGE_KEY, collapsed ? "1" : "0");
  };
  applyState(localStorage.getItem(INPUT_COLLAPSED_STORAGE_KEY) === "1");
  toggle.addEventListener("click", () => applyState(!shell.classList.contains("input-collapsed")));
}

document.addEventListener("DOMContentLoaded", () => {
  loadLessonState();
  populateSelects();
  setTodayNoonDefaults();
  syncConvertedFields();
  setupChartControls();
  setupInputPanelControls();
  setupLessonControls();
  const form = document.querySelector("#birth-form");
  ["calendarMode", "solarDate", "clockTime", "yearStem", "yearBranch", "gregorianYear", "lunarMonth", "lunarDay", "hourBranch", "minutesPassedInHourBranch", "isLeapMonth"].forEach((name) => {
    form.elements[name].addEventListener("change", () => {
      if (name === "yearStem") yearInputLastChanged = "stem";
      if (name === "yearBranch") yearInputLastChanged = "branch";
      syncConvertedFields();
      render(createNatalChart(readForm()));
    });
  });
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    syncConvertedFields();
    render(createNatalChart(readForm()));
  });
  render(createNatalChart(readForm()));
});
