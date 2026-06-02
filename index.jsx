import { useState, useEffect, useMemo, useRef, useCallback } from "react";

// ============================================================
// 問題データ（各単元15問以上・全93問）日本文教出版 小5社会 準拠
// ============================================================
const UNITS = [
  {
    id: 1, title: "国土と地形・気候", emoji: "🗾", color: "#42A5F5", bg: "#E3F2FD",
    topics: ["日本の位置と領土", "地形の特色", "気候の特色"],
    quizzes: [
      { id: "1-01", emoji: "🌏", q: "日本の標準時子午線は東経何度か。", choices: ["120度", "135度", "140度", "150度"], answer: 1, hint: "兵庫県明石市を通る東経135度が日本の標準時子午線だよ。" },
      { id: "1-02", emoji: "🏝️", q: "日本列島を構成する4つの主な島を北から正しく並べたのはどれか。", choices: ["本州・北海道・四国・九州", "北海道・本州・九州・四国", "北海道・本州・四国・九州", "北海道・四国・本州・九州"], answer: 2, hint: "北から「北海道→本州→四国→九州」の順。この並び順はテストに必ず出るよ！" },
      { id: "1-03", emoji: "🗺️", q: "日本が固有の領土と主張しているが、ロシアが占拠している島々は何か。", choices: ["竹島", "尖閣諸島", "北方領土", "対馬"], answer: 2, hint: "北方領土（択捉・国後・色丹・歯舞の4島）。第二次世界大戦末期にソ連に占拠されたよ。" },
      { id: "1-04", emoji: "📐", q: "日本の国土面積のうち山地・丘陵地が占める割合はおよそどれか。", choices: ["約25%", "約50%", "約75%", "約95%"], answer: 2, hint: "日本の国土の約4分の3（約75%）が山地・丘陵地。平野は約4分の1しかないよ。" },
      { id: "1-05", emoji: "⛰️", q: "日本の最高峰・富士山の高さはいくつか。", choices: ["3,067m", "3,193m", "3,776m", "4,000m"], answer: 2, hint: "富士山は3,776m。静岡県と山梨県にまたがる活火山で、日本のシンボルだよ。" },
      { id: "1-06", emoji: "🌊", q: "日本で最も長い川はどれか。", choices: ["利根川", "信濃川", "筑後川", "吉野川"], answer: 1, hint: "信濃川は367kmで日本最長。長野県では「千曲川」と呼ばれるよ。" },
      { id: "1-07", emoji: "🏞️", q: "日本最大の平野はどれか。", choices: ["濃尾平野", "越後平野", "関東平野", "石狩平野"], answer: 2, hint: "関東平野は約1.7万km²で日本最大。東京・埼玉・千葉・神奈川などが含まれるよ。" },
      { id: "1-08", emoji: "🌸", q: "梅雨がない都道府県はどこか。", choices: ["沖縄県", "青森県", "北海道", "長野県"], answer: 2, hint: "北海道は梅雨前線が届かないため梅雨がないよ。沖縄は梅雨入りが最も早いよ。" },
      { id: "1-09", emoji: "💨", q: "日本の気候に強く影響する季節的な風を何というか。", choices: ["偏西風", "貿易風", "季節風（モンスーン）", "台風"], answer: 2, hint: "季節風（モンスーン）。夏は南東から、冬は北西から吹いて日本の天気を変えるよ。" },
      { id: "1-10", emoji: "❄️", q: "冬に日本海側で雪が多く降る主な理由はどれか。", choices: ["日本海の水温が低いから", "北西の季節風が日本海の水蒸気を含み山脈にぶつかるから", "太平洋高気圧が強いから", "偏西風が弱まるから"], answer: 1, hint: "北西の季節風が日本海の水蒸気を含んで、山脈にぶつかって大量の雪を降らせるよ。" },
      { id: "1-11", emoji: "☀️", q: "一年を通じて温暖で降水量が少ない気候の地方はどこか。", choices: ["日本海側", "太平洋側", "瀬戸内地方", "北海道"], answer: 2, hint: "瀬戸内地方は中国山地と四国山地に囲まれ、季節風の影響を受けにくく晴れが多いよ。" },
      { id: "1-12", emoji: "🌴", q: "沖縄県の気候の特色として正しいのはどれか。", choices: ["梅雨がない", "冬の気温がマイナスになる", "亜熱帯気候で年間を通じて温暖", "降水量が非常に少ない"], answer: 2, hint: "沖縄は亜熱帯気候。年平均気温は約23℃で、梅雨は本土より早く訪れるよ。" },
      { id: "1-13", emoji: "🌀", q: "日本に台風が最も多く接近・上陸するのはいつか。", choices: ["3〜5月", "6月", "7〜10月", "12〜2月"], answer: 2, hint: "台風は夏〜秋（7〜10月）に集中するよ。特に8〜9月が多いよ。" },
      { id: "1-14", emoji: "🌐", q: "本州を地質的に東西に分ける大地溝帯を何というか。", choices: ["中央構造線", "フォッサマグナ", "糸魚川断層", "中国山地"], answer: 1, hint: "フォッサマグナ。新潟県糸魚川市〜静岡県を結ぶ線が西縁で、東日本と西日本の地質の境界だよ。" },
      { id: "1-15", emoji: "🏔️", q: "飛騨・木曽・赤石の3つの山脈をまとめて何というか。", choices: ["奥羽山脈", "中国山地", "日本アルプス", "北上高地"], answer: 2, hint: "日本アルプス！3,000m級の山々が連なる「日本の屋根」とも呼ばれるよ。" },
      { id: "1-16", emoji: "🦺", q: "日本が地震・火山が多い主な理由はどれか。", choices: ["山が多いから", "プレートの境界に位置するから", "海に囲まれているから", "梅雨があるから"], answer: 1, hint: "日本は太平洋・フィリピン海・ユーラシア・北米の4つのプレートが交わる場所にあるよ。" },
      { id: "1-17", emoji: "🗾", q: "島根県に属し、韓国が占拠している日本固有の領土はどれか。", choices: ["対馬", "竹島", "尖閣諸島", "北方領土"], answer: 1, hint: "竹島は島根県隠岐郡に属する日本固有の領土。現在は韓国が占拠しているよ。" },
      { id: "1-18", emoji: "💧", q: "日本最大の湖はどれか。", choices: ["霞ヶ浦", "サロマ湖", "諏訪湖", "琵琶湖"], answer: 3, hint: "琵琶湖は滋賀県にある日本最大の湖。面積は約670km²だよ。" },
    ]
  },
  {
    id: 2, title: "農業と食料生産", emoji: "🌾", color: "#66BB6A", bg: "#E8F5E9",
    topics: ["日本の農業の特色", "米・野菜・畜産", "食料自給率の課題"],
    quizzes: [
      { id: "2-01", emoji: "🍚", q: "日本の食料自給率（カロリーベース）は現在およそ何%か。", choices: ["約20%", "約38%", "約60%", "約80%"], answer: 1, hint: "約38%（2020年代）。食べ物の約6割以上を輸入に頼っている。食料自給率アップが課題だよ。" },
      { id: "2-02", emoji: "🌾", q: "米の生産量が日本一の都道府県はどこか。", choices: ["秋田県", "山形県", "新潟県", "北海道"], answer: 2, hint: "新潟県。越後平野を中心にコシヒカリなどのブランド米が生産されるよ。" },
      { id: "2-03", emoji: "🥒", q: "暖かい気候を利用して野菜を早めに出荷する栽培方法を何というか。", choices: ["促成栽培", "抑制栽培", "水耕栽培", "有機栽培"], answer: 0, hint: "促成栽培！高知県・宮崎県など温暖な地域でビニールハウスも使って冬〜春に出荷するよ。" },
      { id: "2-04", emoji: "🌿", q: "冷涼な高原の気候を利用して野菜を遅く出荷する栽培方法は何か。", choices: ["促成栽培", "抑制栽培", "有機栽培", "露地栽培"], answer: 1, hint: "抑制栽培！長野県・群馬県の高原地帯で夏〜秋にキャベツ・レタスを出荷するよ。" },
      { id: "2-05", emoji: "🌶️", q: "促成栽培がさかんな都道府県の組み合わせとして正しいのはどれか。", choices: ["長野県・群馬県", "高知県・宮崎県", "青森県・岩手県", "北海道・秋田県"], answer: 1, hint: "高知県・宮崎県！温暖な気候を生かしてなす・ピーマン・きゅうりを冬〜春に出荷するよ。" },
      { id: "2-06", emoji: "🥔", q: "北海道の畑作でさかんに生産されているものを正しく選んだのはどれか。", choices: ["みかん・茶・サトウキビ", "じゃがいも・てんさい・小麦", "りんご・ぶどう・梨", "なす・ピーマン・きゅうり"], answer: 1, hint: "北海道はじゃがいも・てんさい（砂糖の原料）・小麦・大豆の大産地だよ。" },
      { id: "2-07", emoji: "🐄", q: "北海道が日本一の生産量を誇る農畜産物として正しくないのはどれか。", choices: ["生乳（牛乳）", "じゃがいも", "てんさい", "茶（緑茶）"], answer: 3, hint: "茶（緑茶）の産地は静岡県・鹿児島県が有名。北海道は寒すぎてお茶の栽培に向かないよ。" },
      { id: "2-08", emoji: "🍎", q: "りんごの生産量が日本一の都道府県はどこか。", choices: ["山形県", "長野県", "青森県", "岩手県"], answer: 2, hint: "青森県！日本のりんご生産量の約6割を占めるよ。弘前市周辺が主な産地だよ。" },
      { id: "2-09", emoji: "📉", q: "日本の農業が直面している課題として正しいのはどれか。", choices: ["農家の数が急増している", "農業人口の減少と高齢化", "食料自給率が上昇し続けている", "農業収入が大幅に増えている"], answer: 1, hint: "農業従事者の平均年齢は67歳を超え、担い手不足・高齢化が深刻な課題だよ。" },
      { id: "2-10", emoji: "🌱", q: "農産物を生産から加工・販売まで農家自身が行う取り組みを何というか。", choices: ["減反政策", "6次産業化", "トレーサビリティ", "フードマイレージ"], answer: 1, hint: "6次産業化！1次（農業）×2次（加工）×3次（販売）を合わせて農家の収益を上げる取り組みだよ。" },
      { id: "2-11", emoji: "🏔️", q: "山の斜面を段状に切り開いた水田を何というか。", choices: ["干拓地", "棚田（たなだ）", "扇状地", "三角州"], answer: 1, hint: "棚田！山の斜面を段々状に削って作った水田。景観が美しく農業遺産にも登録されているよ。" },
      { id: "2-12", emoji: "🌊", q: "浅い海や湖を堤防で囲い、水を抜いて作った農地を何というか。", choices: ["棚田", "扇状地", "干拓地（かんたくち）", "三角州"], answer: 2, hint: "干拓地！長崎県の諫早湾などで多く見られる農地の作り方だよ。" },
      { id: "2-13", emoji: "🥗", q: "食品がどこでどのように生産・加工されたかを追跡できる仕組みを何というか。", choices: ["6次産業化", "フードバンク", "トレーサビリティ", "フードマイレージ"], answer: 2, hint: "トレーサビリティ！「食べ物の来歴を追跡する」仕組みで、食の安全を守るために重要だよ。" },
      { id: "2-14", emoji: "🐔", q: "鶏の卵や肉の生産がさかんな都道府県として正しいのはどれか。", choices: ["北海道・秋田県", "宮崎県・鹿児島県", "東京都・大阪府", "沖縄県・長崎県"], answer: 1, hint: "宮崎県・鹿児島県は鶏（ブロイラー・卵）の一大産地。温暖な気候が畜産に向いているよ。" },
      { id: "2-15", emoji: "🌍", q: "日本が米をほとんど輸入しない主な理由として正しいのはどれか。", choices: ["外国の米がまずいから", "米の生産量が十分で、保護政策もあるから", "輸送費が高すぎるから", "外国に米が不足しているから"], answer: 1, hint: "米は国内でほぼ自給でき（自給率ほぼ100%）、国産米の保護政策も長く続いてきたよ。" },
    ]
  },
  {
    id: 3, title: "漁業と水産業", emoji: "🐟", color: "#26C6DA", bg: "#E0F7FA",
    topics: ["漁業の種類", "養殖業・栽培漁業", "水産資源の現状と課題"],
    quizzes: [
      { id: "3-01", emoji: "🚢", q: "遠い外国の海まで出かけて漁をする漁業を何というか。", choices: ["沿岸漁業", "沖合漁業", "遠洋漁業", "養殖業"], answer: 2, hint: "遠洋漁業！太平洋・大西洋・インド洋など遠くの海でマグロ・カツオなどを漁するよ。" },
      { id: "3-02", emoji: "🏖️", q: "日帰りや1〜2日で戻れる沿岸での漁業を何というか。", choices: ["遠洋漁業", "沖合漁業", "沿岸漁業", "栽培漁業"], answer: 2, hint: "沿岸漁業！小型船で近海で漁をするよ。定置網漁・小型底引き網漁などが代表的だよ。" },
      { id: "3-03", emoji: "🐠", q: "いけすや網で魚介類・海藻を人工的に育てる漁業を何というか。", choices: ["栽培漁業", "沿岸漁業", "養殖業", "遠洋漁業"], answer: 2, hint: "養殖業！ほたて・かき・マグロ・ぶりなどが養殖されているよ。" },
      { id: "3-04", emoji: "🐣", q: "稚魚・稚貝を育てて自然の海や川に放流する漁業を何というか。", choices: ["養殖業", "沿岸漁業", "沖合漁業", "栽培漁業"], answer: 3, hint: "栽培漁業！放流して自然の海で育てた後に漁獲するよ。サケ・ヒラメ・マダイなどで行われるよ。" },
      { id: "3-05", emoji: "🌊", q: "三陸海岸が日本有数の好漁場である主な理由はどれか。", choices: ["水深が浅いから", "暖流と寒流がぶつかる潮目があるから", "海水温が一定だから", "近くに大都市があるから"], answer: 1, hint: "暖流（黒潮）と寒流（親潮）がぶつかる潮目はプランクトンが豊富で魚が集まりやすいよ。" },
      { id: "3-06", emoji: "🦪", q: "かき（牡蠣）の養殖生産量が日本一の都道府県はどこか。", choices: ["北海道", "長崎県", "広島県", "静岡県"], answer: 2, hint: "広島県！全国生産量の約6割を占める。リアス海岸の入り江が養殖に最適だよ。" },
      { id: "3-07", emoji: "🍣", q: "ほたての養殖がさかんな地域として正しいのはどれか。", choices: ["広島県・岡山県", "北海道・青森県", "長崎県・熊本県", "三重県・愛知県"], answer: 1, hint: "北海道・青森県！オホーツク海沿岸や陸奥湾で大規模な養殖が行われているよ。" },
      { id: "3-08", emoji: "📉", q: "日本の漁獲量が1980年代以降減少している主な理由として正しくないのはどれか。", choices: ["200海里水域の設定", "海の汚染と水産資源の減少", "漁業従事者の高齢化と減少", "日本人の魚の消費量が大幅に増えたから"], answer: 3, hint: "日本人の魚の消費量は増えていない（むしろ減少傾向）。減少の主因は資源の枯渇・EEZ・従事者減だよ。" },
      { id: "3-09", emoji: "📏", q: "沿岸から200海里以内で漁業・資源管理の権利を持つ水域を何というか。", choices: ["領海", "公海", "排他的経済水域（EEZ）", "内水面"], answer: 2, hint: "排他的経済水域（EEZ）！200海里EEZの設定で日本漁船が外国水域に入れなくなり遠洋漁業が打撃を受けたよ。" },
      { id: "3-10", emoji: "🐟", q: "日本の周辺の海のうち、冷たい寒流（親潮）が流れているのはどちら側か。", choices: ["日本海側", "太平洋の南側", "太平洋の北東側（三陸沖）", "東シナ海"], answer: 2, hint: "親潮（千島海流）は太平洋北東側（三陸沖）を南下する寒流。黒潮（暖流）と交わる三陸沖は世界有数の漁場だよ。" },
      { id: "3-11", emoji: "🌿", q: "水産資源を守るため、漁獲量を制限する仕組みを何というか。", choices: ["養殖制限", "TAC（漁獲可能量制度）", "輸入割当制度", "栽培漁業制度"], answer: 1, hint: "TAC（Total Allowable Catch）！魚の種類ごとに漁獲量の上限を設けて資源を守る仕組みだよ。" },
      { id: "3-12", emoji: "🏭", q: "漁港で水揚げされた魚が消費者に届くまでの流通経路として正しいのはどれか。", choices: ["漁港→消費者", "漁港→卸売市場→仲買人・小売店→消費者", "漁港→農協→消費者", "漁港→輸出→消費者"], answer: 1, hint: "漁港→卸売市場（セリ）→仲買人→小売店（スーパーなど）→消費者 が一般的な流れだよ。" },
      { id: "3-13", emoji: "🐡", q: "マグロの完全養殖（卵から育てる）を世界で初めて成功させたのはどこか。", choices: ["マルハニチロ", "近畿大学水産研究所", "スシロー", "日本水産"], answer: 1, hint: "近畿大学水産研究所（近大マグロ）！2002年に世界初のクロマグロ完全養殖に成功したよ。" },
      { id: "3-14", emoji: "🌊", q: "海の汚染による漁業被害の原因として近年特に問題になっているものはどれか。", choices: ["魚の食べすぎ", "海水温の上昇とマイクロプラスチック汚染", "漁船が増えすぎたこと", "港が少なすぎること"], answer: 1, hint: "海水温上昇（地球温暖化）やマイクロプラスチック汚染が魚の生態系に悪影響を与えているよ。" },
      { id: "3-15", emoji: "🗾", q: "日本の海面漁業・養殖業の合計生産量として近い数字はどれか（近年）。", choices: ["約100万トン", "約320万トン", "約800万トン", "約2,000万トン"], answer: 1, hint: "約320万トン前後（2020年代）。最盛期（1980年代）の約1,280万トンから大幅に減少しているよ。" },
    ]
  },
  {
    id: 4, title: "工業と産業・貿易", emoji: "🏭", color: "#AB47BC", bg: "#F3E5F5",
    topics: ["工業地帯・地域", "日本の主な工業", "貿易と輸送"],
    quizzes: [
      { id: "4-01", emoji: "🚗", q: "工業生産額が日本最大の工業地帯はどれか。", choices: ["京浜工業地帯", "阪神工業地帯", "中京工業地帯", "北九州工業地帯"], answer: 2, hint: "中京工業地帯（愛知・三重・岐阜）。トヨタ自動車を中心に自動車産業が集積しているよ。" },
      { id: "4-02", emoji: "⚙️", q: "中京工業地帯の中心的な産業は何か。", choices: ["鉄鋼業", "化学工業", "自動車工業", "繊維工業"], answer: 2, hint: "自動車工業！愛知県豊田市はトヨタの企業城下町で、関連工場が多数集積しているよ。" },
      { id: "4-03", emoji: "🗾", q: "関東から九州にかけての帯状の工業地帯・地域をまとめて何というか。", choices: ["工業ベルト地帯", "太平洋ベルト", "臨海工業地帯", "太平洋岸工業地域"], answer: 1, hint: "太平洋ベルト！関東〜東海〜近畿〜瀬戸内〜北九州が帯状につながる日本の主要工業地域だよ。" },
      { id: "4-04", emoji: "🌊", q: "工場が海（臨海部）の近くに多く立地する主な理由はどれか。", choices: ["海風が涼しいから", "海水を工業用水に使うから", "原料・製品を船で運びやすいから", "地価が安いから"], answer: 2, hint: "重い原料（鉄鉱石・石油など）を海外から船で大量輸入し、製品も輸出しやすいから臨海部に集まるよ。" },
      { id: "4-05", emoji: "🏗️", q: "阪神工業地帯が位置する府県の組み合わせとして正しいのはどれか。", choices: ["東京都・神奈川県", "愛知県・三重県", "大阪府・兵庫県", "福岡県・熊本県"], answer: 2, hint: "大阪府・兵庫県が中心。鉄鋼・機械・化学・繊維などが主要産業だよ。" },
      { id: "4-06", emoji: "🏙️", q: "京浜工業地帯が位置する都県の組み合わせとして正しいのはどれか。", choices: ["東京都・神奈川県", "東京都・千葉県", "神奈川県・埼玉県", "東京都・埼玉県"], answer: 0, hint: "東京都・神奈川県。川崎・横浜の臨海部に機械・電気・化学などの工場が集中しているよ。" },
      { id: "4-07", emoji: "🎸", q: "オートバイや楽器の生産がさかんな工業地域はどれか。", choices: ["北関東工業地域", "東海工業地域（静岡）", "京葉工業地域", "瀬戸内工業地域"], answer: 1, hint: "東海工業地域（静岡県）。浜松市周辺でホンダ・ヤマハ・カワイなどが有名だよ。" },
      { id: "4-08", emoji: "🔩", q: "石油化学コンビナートで知られ、化学工業がさかんな工業地域はどれか。", choices: ["東海工業地域", "京浜工業地帯", "京葉工業地域（千葉）", "北関東工業地域"], answer: 2, hint: "京葉工業地域（千葉県）！東京湾岸に石油化学コンビナートが集積し、化学・鉄鋼が主力だよ。" },
      { id: "4-09", emoji: "🚢", q: "原料を輸入して製品に加工して輸出する貿易の形態を何というか。", choices: ["自由貿易", "保護貿易", "加工貿易", "対外貿易"], answer: 2, hint: "加工貿易！日本は石油・鉄鉱石などの資源が乏しいため、輸入→加工→輸出を行ってきたよ。" },
      { id: "4-10", emoji: "📦", q: "日本の主な輸出品として正しいのはどれか。", choices: ["石油・鉄鉱石・小麦", "自動車・機械類・電気機器", "食料品・繊維・木材", "石炭・天然ガス・レアメタル"], answer: 1, hint: "自動車・機械類・電気機器が主な輸出品。自動車は長年輸出額のトップを占めているよ。" },
      { id: "4-11", emoji: "🛢️", q: "日本の主な輸入品として正しいのはどれか。", choices: ["自動車・船舶・航空機", "石油・食料品・機械類", "自動車・電気機器・精密機器", "半導体・医薬品・化粧品"], answer: 1, hint: "石油（原油）・食料品・機械類・衣類などが主要輸入品。石油は日本のエネルギーに不可欠だよ。" },
      { id: "4-12", emoji: "🚛", q: "国内の貨物輸送で最も多く利用される交通手段はどれか。", choices: ["船", "鉄道", "航空機", "自動車（トラック）"], answer: 3, hint: "自動車（トラック）！輸送量の約9割以上を占める。宅配便の増加もトラック輸送増加につながるよ。" },
      { id: "4-13", emoji: "🌐", q: "国際貨物輸送で最も多く使われる交通手段はどれか。", choices: ["飛行機", "船（海運）", "トラック", "鉄道"], answer: 1, hint: "船（海運）！重くて大量の荷物を安く運べる。世界貿易の約9割は海運が担っているよ。" },
      { id: "4-14", emoji: "🤝", q: "日本の最大の貿易相手国（輸出入合計）はどこか（近年）。", choices: ["アメリカ", "韓国", "中国", "ドイツ"], answer: 2, hint: "中国が日本の最大の貿易相手国（2010年以降）。輸入では中国からの割合が特に大きいよ。" },
      { id: "4-15", emoji: "🏭", q: "中小工場が多く集まり、高度な技術で部品などを作る地域として正しいのはどれか。", choices: ["農業地帯", "観光地", "東京都大田区などの工業集積地", "漁業地帯"], answer: 2, hint: "大田区などには高い技術を持つ中小企業が集積し、大企業の部品を作る「ものづくりの聖地」だよ。" },
    ]
  },
  {
    id: 5, title: "情報社会と環境", emoji: "💻", color: "#FFA726", bg: "#FFF3E0",
    topics: ["情報化社会とメディア", "情報リテラシー", "環境問題"],
    quizzes: [
      { id: "5-01", emoji: "📱", q: "インターネット・スマートフォンが普及した現代社会を何というか。", choices: ["農業社会", "工業社会", "情報化社会", "サービス社会"], answer: 2, hint: "情報化社会！情報が社会の中心的な役割を果たし、誰もが情報を発信・受信できるようになったよ。" },
      { id: "5-02", emoji: "📰", q: "テレビ・新聞・ラジオ・インターネットなど、情報を多くの人に伝える手段を何というか。", choices: ["通信網", "マスメディア", "SNS", "ソーシャルメディア"], answer: 1, hint: "マスメディア（大衆媒体）！大勢の人に情報を一斉に届ける手段の総称だよ。" },
      { id: "5-03", emoji: "🔍", q: "情報を正しく読み取り、活用する能力を何というか。", choices: ["デジタル力", "情報リテラシー", "メディア力", "AI能力"], answer: 1, hint: "情報リテラシー！フェイクニュースを見抜き、情報の真偽を確かめる力が現代では不可欠だよ。" },
      { id: "5-04", emoji: "🔒", q: "名前・住所・電話番号・顔写真などをまとめて何というか。", choices: ["オープンデータ", "ビッグデータ", "個人情報", "パブリックデータ"], answer: 2, hint: "個人情報！インターネット上に不用意に公開すると悪用される危険があるよ。大切に守ろう！" },
      { id: "5-05", emoji: "⚠️", q: "インターネット上に広がる偽りの情報を何というか。", choices: ["フェイクニュース", "ビッグデータ", "クッキー", "キャッシュ"], answer: 0, hint: "フェイクニュース！複数の信頼できる情報源で確認することが大切。一つの情報だけで判断しないようにしよう。" },
      { id: "5-06", emoji: "📊", q: "大量のデータを収集・分析して社会に役立てる技術を何というか。", choices: ["IoT", "AI（人工知能）", "ビッグデータ", "SNS"], answer: 2, hint: "ビッグデータ！医療・交通・防災・マーケティングなど様々な分野で活用されているよ。" },
      { id: "5-07", emoji: "🌐", q: "あらゆるモノをインターネットでつなぐ技術を何というか。", choices: ["AI", "SNS", "IoT（モノのインターネット）", "AR"], answer: 2, hint: "IoT（Internet of Things）！家電・自動車・工場機械などをネットでつなぎ、効率化を図るよ。" },
      { id: "5-08", emoji: "✅", q: "情報モラルとして正しい行動はどれか。", choices: ["友人の写真を許可なくSNSに投稿する", "知らない人にIDとパスワードを教える", "他人を傷つける書き込みをする", "著作権を守り他人の作品を無断コピーしない"], answer: 3, hint: "著作権の尊重・個人情報の保護・誹謗中傷しないことが情報モラルの基本。ネットでも現実と同じルールが適用されるよ。" },
      { id: "5-09", emoji: "🌡️", q: "地球温暖化の主な原因となる気体は何か。", choices: ["酸素", "窒素", "二酸化炭素（CO₂）", "水素"], answer: 2, hint: "二酸化炭素（CO₂）などの温室効果ガス！化石燃料（石油・石炭・天然ガス）を燃やすと大量に排出されるよ。" },
      { id: "5-10", emoji: "♻️", q: "3Rのうち「Reduce（リデュース）」の意味はどれか。", choices: ["再利用する", "ごみの量を減らす", "再資源化する", "リフォームする"], answer: 1, hint: "Reduce＝ごみを減らすこと！3Rの中で最も優先される。買いすぎない・使い切ることが大切だよ。" },
      { id: "5-11", emoji: "🐟", q: "四大公害病のうち、熊本県で水銀汚染により発生した公害病はどれか。", choices: ["イタイイタイ病", "四日市ぜんそく", "水俣病", "新潟水俣病"], answer: 2, hint: "水俣病！工場が排出したメチル水銀が魚介類に蓄積し、それを食べた住民に重篤な神経障害が起きたよ。" },
      { id: "5-12", emoji: "🏭", q: "工場の排気ガスによる大気汚染で発生した三重県の公害病はどれか。", choices: ["水俣病", "イタイイタイ病", "四日市ぜんそく", "新潟水俣病"], answer: 2, hint: "四日市ぜんそく（三重県四日市市）！石油化学コンビナートの排気ガスが原因だよ。" },
      { id: "5-13", emoji: "🌿", q: "太陽光・風力・水力など、繰り返し使えるエネルギーを何というか。", choices: ["化石エネルギー", "原子力エネルギー", "再生可能エネルギー", "核エネルギー"], answer: 2, hint: "再生可能エネルギー！自然の力を利用するため枯渇せず、CO₂をほとんど排出しない。温暖化対策として注目されるよ。" },
      { id: "5-14", emoji: "🌍", q: "2015年に採択された地球温暖化対策の国際的な協定を何というか。", choices: ["京都議定書", "パリ協定", "モントリオール議定書", "リオ宣言"], answer: 1, hint: "パリ協定！196の国・地域が参加し、気温上昇を産業革命前より2℃未満（できれば1.5℃未満）に抑えることを目標にするよ。" },
      { id: "5-15", emoji: "💧", q: "富山県でカドミウム汚染により発生した公害病はどれか。", choices: ["水俣病", "四日市ぜんそく", "イタイイタイ病", "新潟水俣病"], answer: 2, hint: "イタイイタイ病！神通川流域で鉱山からのカドミウムが農業用水を汚染し、骨がもろくなる病気が発生したよ。" },
    ]
  },
  {
    id: 6, title: "国土・自然災害・防災", emoji: "🛡️", color: "#EF5350", bg: "#FFEBEE",
    topics: ["自然災害の種類", "防災・減災の取り組み", "地域のくらしと自然"],
    quizzes: [
      { id: "6-01", emoji: "📅", q: "防災の日（9月1日）が設けられたきっかけとなった災害はどれか。", choices: ["阪神・淡路大震災", "東日本大震災", "関東大震災", "雲仙普賢岳噴火"], answer: 2, hint: "1923年9月1日の関東大震災（死者・行方不明者約10万5千人）を教訓に、9月1日が防災の日となったよ。" },
      { id: "6-02", emoji: "🗺️", q: "災害の危険区域や避難場所を示した地図を何というか。", choices: ["地形図", "ハザードマップ", "地質図", "気象図"], answer: 1, hint: "ハザードマップ！洪水・土砂崩れ・津波などの危険区域と避難場所が示されている。各市区町村が公開しているよ。" },
      { id: "6-03", emoji: "🌊", q: "2011年3月11日に発生した大震災の名称はどれか。", choices: ["阪神・淡路大震災", "新潟中越地震", "東日本大震災", "熊本地震"], answer: 2, hint: "東日本大震災（M9.0）！大津波により死者・行方不明者は約1万8千人以上。福島第一原発事故も発生したよ。" },
      { id: "6-04", emoji: "🌊", q: "海底地震などで発生する巨大な波を何というか。", choices: ["高潮", "津波", "波浪", "洪水"], answer: 1, hint: "津波！海底の地殻変動で海水が一気に移動して発生する。東日本大震災では最大約40mの津波が記録されたよ。" },
      { id: "6-05", emoji: "🏠", q: "1995年1月17日に発生し、神戸市などに大きな被害をもたらした地震はどれか。", choices: ["東日本大震災", "阪神・淡路大震災", "熊本地震", "新潟中越地震"], answer: 1, hint: "阪神・淡路大震災（M7.3）！死者約6,400人。建物の倒壊・火災が被害を大きくしたよ。" },
      { id: "6-06", emoji: "🌋", q: "火山の噴火が日本で多い主な理由はどれか。", choices: ["雨が多いから", "プレートの境界に位置し地下にマグマがあるから", "山が多いから", "海に囲まれているから"], answer: 1, hint: "プレートの境界付近にはマグマが生まれやすく、日本は世界の活火山の約7%が集中する火山大国だよ。" },
      { id: "6-07", emoji: "🌧️", q: "大雨や長雨で山の斜面が崩れる災害をまとめて何というか。", choices: ["洪水", "高潮", "土砂災害", "液状化現象"], answer: 2, hint: "土砂災害！がけ崩れ・土石流・地すべりの3種類がある。梅雨時期や台風時に特に多く発生するよ。" },
      { id: "6-08", emoji: "📻", q: "災害時に住民に避難を呼びかける情報として正しいのはどれか。", choices: ["天気予報", "緊急地震速報や避難指示・避難勧告", "交通情報", "スポーツニュース"], answer: 1, hint: "緊急地震速報や気象庁の避難指示・避難勧告は命を守るための重要な情報だよ。すぐに行動しよう！" },
      { id: "6-09", emoji: "🤝", q: "地域の住民が協力して防災・減災に取り組む組織を何というか。", choices: ["PTA", "自主防災組織", "消防署", "警察署"], answer: 1, hint: "自主防災組織！地域住民が自分たちで防災訓練・避難計画・備蓄管理などを行う組織だよ。" },
      { id: "6-10", emoji: "🏔️", q: "山から流れてくる土砂の速度・量を抑えて下流の被害を減らす施設は何か。", choices: ["堤防（ていぼう）", "砂防ダム", "防潮堤（ぼうちょうてい）", "遊水地（ゆうすいち）"], answer: 1, hint: "砂防ダム！山から流れてくる土砂や溶岩の速度・量を抑えて下流の被害を減らす施設だよ。" },
      { id: "6-11", emoji: "🌊", q: "津波や高潮から海岸を守る施設として正しいのはどれか。", choices: ["砂防ダム", "遊水地", "防潮堤（ぼうちょうてい）", "放水路"], answer: 2, hint: "防潮堤！海岸沿いに作られた壁で津波や高潮から地域を守る。東日本大震災後に多くの地域で強化されたよ。" },
      { id: "6-12", emoji: "🔴", q: "気象庁が発表する「特別警報」とはどういうものか。", choices: ["通常の警報より軽い注意情報", "数十年に一度の重大な災害のおそれがある最も重大な警戒情報", "台風だけに使う情報", "地震だけに使う情報"], answer: 1, hint: "特別警報は最も重大な警戒情報！数十年に一度の規模で重大な被害のおそれがあるときに出されるよ。" },
      { id: "6-13", emoji: "🏘️", q: "地震後に、地盤が液体のように柔らかくなって建物が傾く現象を何というか。", choices: ["液状化現象", "土砂崩れ", "地盤沈下", "断層のずれ"], answer: 0, hint: "液状化現象！砂地盤が地震の振動で液体状になり、建物が傾いたり地面から水が吹き出したりするよ。" },
      { id: "6-14", emoji: "🗒️", q: "災害時に3日〜1週間分の食料・水・生活用品を備えることを何というか。", choices: ["疎開（そかい）", "備蓄（びちく）", "疎開準備", "防災訓練"], answer: 1, hint: "備蓄！非常食（缶詰・レトルト）・飲料水（1人1日3L）・懐中電灯・薬などを準備しておこう。" },
      { id: "6-15", emoji: "📡", q: "防災に役立つ情報を地図上に示して共有する技術として正しいのはどれか。", choices: ["テレビ放送", "GIS（地理情報システム）", "電話回線", "ラジオ放送"], answer: 1, hint: "GIS（地理情報システム）！地図データと様々な情報を重ね合わせて防災・ハザードマップ作成などに活用されるよ。" },
    ]
  }
];

const BADGES = [
  { id: "first_quiz", label: "はじめの一歩", emoji: "🚀", desc: "最初のクイズに挑戦した！" },
  { id: "perfect", label: "パーフェクト", emoji: "⭐", desc: "1単元を全問正解！" },
  { id: "all_units", label: "社会科マスター", emoji: "🏆", desc: "全6単元をクリア！" },
  { id: "streak3", label: "3連続正解", emoji: "🔥", desc: "3問連続で正解！" },
  { id: "fast_answer", label: "スピードスター", emoji: "⚡", desc: "5秒以内に正解！" },
  { id: "retry_clear", label: "あきらめない心", emoji: "💪", desc: "まちがい直しで全問正解！" },
];

// ===== localStorage ユーティリティ =====
const LS_KEY = "shakai5_v2";

function loadState() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function saveState(state) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(state));
  } catch {}
}

// ===== 進捗ヘルパー =====
// correctIds: Set<quizId> — 一度でも正解した問題のIDセット（単元ごと）
// これをベースに進捗バーを計算する
function calcUnitProgress(unit, correctIds) {
  const total = unit.quizzes.length;
  const done = unit.quizzes.filter(q => correctIds.has(q.id)).length;
  return { done, total, pct: total > 0 ? Math.round((done / total) * 100) : 0 };
}

// ===== 効果音（Web Audio API） =====
function useSound() {
  const ctx = useRef(null);
  const getCtx = () => {
    if (!ctx.current) ctx.current = new (window.AudioContext || window.webkitAudioContext)();
    return ctx.current;
  };
  const play = (fn) => { try { fn(getCtx()); } catch (e) {} };
  return {
    correct: () => play(ac => {
      [[523, 0], [659, 0.12], [784, 0.24], [1047, 0.36]].forEach(([f, t]) => {
        const o = ac.createOscillator(), g = ac.createGain();
        o.connect(g); g.connect(ac.destination);
        o.frequency.value = f; o.type = "sine";
        g.gain.setValueAtTime(0, ac.currentTime + t);
        g.gain.linearRampToValueAtTime(0.18, ac.currentTime + t + 0.04);
        g.gain.linearRampToValueAtTime(0, ac.currentTime + t + 0.18);
        o.start(ac.currentTime + t); o.stop(ac.currentTime + t + 0.2);
      });
    }),
    wrong: () => play(ac => {
      [[300, 0], [220, 0.15]].forEach(([f, t]) => {
        const o = ac.createOscillator(), g = ac.createGain();
        o.connect(g); g.connect(ac.destination);
        o.frequency.value = f; o.type = "sawtooth";
        g.gain.setValueAtTime(0, ac.currentTime + t);
        g.gain.linearRampToValueAtTime(0.12, ac.currentTime + t + 0.03);
        g.gain.linearRampToValueAtTime(0, ac.currentTime + t + 0.2);
        o.start(ac.currentTime + t); o.stop(ac.currentTime + t + 0.25);
      });
    }),
    clear: () => play(ac => {
      [[523, 0], [659, 0.1], [784, 0.2], [1047, 0.32], [1319, 0.46]].forEach(([f, t]) => {
        const o = ac.createOscillator(), g = ac.createGain();
        o.connect(g); g.connect(ac.destination);
        o.frequency.value = f; o.type = "triangle";
        g.gain.setValueAtTime(0, ac.currentTime + t);
        g.gain.linearRampToValueAtTime(0.2, ac.currentTime + t + 0.05);
        g.gain.linearRampToValueAtTime(0, ac.currentTime + t + 0.35);
        o.start(ac.currentTime + t); o.stop(ac.currentTime + t + 0.4);
      });
    }),
    badge: () => play(ac => {
      [1047, 1319, 1568, 2093].forEach((f, i) => {
        const o = ac.createOscillator(), g = ac.createGain();
        o.connect(g); g.connect(ac.destination);
        o.frequency.value = f; o.type = "sine";
        const t = i * 0.08;
        g.gain.setValueAtTime(0, ac.currentTime + t);
        g.gain.linearRampToValueAtTime(0.15, ac.currentTime + t + 0.04);
        g.gain.linearRampToValueAtTime(0, ac.currentTime + t + 0.22);
        o.start(ac.currentTime + t); o.stop(ac.currentTime + t + 0.25);
      });
    }),
    tap: () => play(ac => {
      const o = ac.createOscillator(), g = ac.createGain();
      o.connect(g); g.connect(ac.destination);
      o.frequency.value = 800; o.type = "sine";
      g.gain.setValueAtTime(0.08, ac.currentTime);
      g.gain.linearRampToValueAtTime(0, ac.currentTime + 0.06);
      o.start(ac.currentTime); o.stop(ac.currentTime + 0.07);
    }),
    streak: () => play(ac => {
      [880, 1100, 1320].forEach((f, i) => {
        const o = ac.createOscillator(), g = ac.createGain();
        o.connect(g); g.connect(ac.destination);
        o.frequency.value = f; o.type = "sine";
        const t = i * 0.07;
        g.gain.setValueAtTime(0, ac.currentTime + t);
        g.gain.linearRampToValueAtTime(0.13, ac.currentTime + t + 0.03);
        g.gain.linearRampToValueAtTime(0, ac.currentTime + t + 0.15);
        o.start(ac.currentTime + t); o.stop(ac.currentTime + t + 0.18);
      });
    }),
  };
}

function shuffleChoices(quiz) {
  const indexed = quiz.choices.map((c, i) => ({ text: c, isAnswer: i === quiz.answer }));
  for (let i = indexed.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indexed[i], indexed[j]] = [indexed[j], indexed[i]];
  }
  return { ...quiz, choices: indexed.map(c => c.text), answer: indexed.findIndex(c => c.isAnswer) };
}

function todayStr() {
  return new Date().toLocaleDateString("ja-JP", { month: "2-digit", day: "2-digit" });
}

// ===== UI パーツ =====
function Stars({ count }) {
  return (
    <span>{[...Array(3)].map((_, i) => (
      <span key={i} style={{ fontSize: 18, color: i < count ? "#FFD700" : "#ddd" }}>★</span>
    ))}</span>
  );
}

function Confetti({ active }) {
  const colors = ["#FF6B6B", "#4ECDC4", "#FFE66D", "#A8E6CF", "#FF8B94", "#B4F8C8"];
  if (!active) return null;
  return (
    <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 9999 }}>
      {[...Array(40)].map((_, i) => (
        <div key={i} style={{
          position: "absolute", left: `${Math.random() * 100}%`, top: "-20px",
          width: `${Math.random() * 10 + 6}px`, height: `${Math.random() * 10 + 6}px`,
          background: colors[i % colors.length], borderRadius: Math.random() > 0.5 ? "50%" : "0",
          animation: `confettiFall ${Math.random() * 2 + 1.5}s ease-in ${Math.random() * 0.5}s forwards`,
          transform: `rotate(${Math.random() * 360}deg)`
        }} />
      ))}
    </div>
  );
}

// ===== ホーム画面 =====
function HomeScreen({ correctIdsMap, wrongQuizIds, onStart, onStartRetry }) {
  const totalQ = UNITS.reduce((a, u) => a + u.quizzes.length, 0);
  // 全単元の正解済みユニーク問題数でクリア率を計算
  const allCorrectIds = new Set(UNITS.flatMap(u => u.quizzes.map(q => q.id)).filter(id => {
    for (const unit of UNITS) {
      const cids = correctIdsMap[unit.id];
      if (cids && cids.has(id)) return true;
    }
    return false;
  }));
  const pct = Math.round((allCorrectIds.size / totalQ) * 100);

  return (
    <div style={{ padding: "0 0 80px" }}>
      {/* ヘッダー — コンパクト版 */}
      <div style={{
        background: "linear-gradient(135deg,#0D47A1 0%,#1565C0 60%,#1976D2 100%)",
        borderRadius: "0 0 28px 28px", padding: "18px 20px 16px", color: "#fff",
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontSize: 11, opacity: 0.8, letterSpacing: 1 }}>小学5年生</div>
            <div style={{ fontSize: 20, fontWeight: 900, letterSpacing: "-0.5px", marginTop: 1 }}>📖 社会科5年生</div>
            <div style={{ fontSize: 10, opacity: 0.7, marginTop: 1 }}>日本文教出版 準拠 ・ 全{totalQ}問</div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 26, fontWeight: 900, lineHeight: 1 }}>{pct}<span style={{ fontSize: 13 }}>%</span></div>
            <div style={{ fontSize: 9, opacity: 0.8, marginBottom: 5 }}>クリア率</div>
            <div style={{ height: 6, background: "rgba(255,255,255,0.25)", borderRadius: 9, width: 80 }}>
              <div style={{
                height: 6, background: "#FFD700", borderRadius: 9,
                width: `${pct}%`, transition: "width 0.8s",
                boxShadow: pct > 0 ? "0 0 6px rgba(255,215,0,0.7)" : "none"
              }} />
            </div>
          </div>
        </div>
      </div>

      <div style={{ padding: "0 16px" }}>
        {/* まちがい直し */}
        {wrongQuizIds.length > 0 && (
          <div onClick={onStartRetry} style={{
            marginTop: 14, background: "#FFF3E0", border: "2px solid #FF9800",
            borderRadius: 20, padding: "12px 14px", cursor: "pointer",
            display: "flex", alignItems: "center", gap: 12, transition: "transform 0.1s"
          }}
            onTouchStart={e => e.currentTarget.style.transform = "scale(0.97)"}
            onTouchEnd={e => e.currentTarget.style.transform = "scale(1)"}
            onMouseDown={e => e.currentTarget.style.transform = "scale(0.97)"}
            onMouseUp={e => e.currentTarget.style.transform = "scale(1)"}>
            <div style={{ fontSize: 28 }}>📝</div>
            <div>
              <div style={{ fontWeight: 800, fontSize: 14, color: "#E65100" }}>まちがい直し</div>
              <div style={{ fontSize: 11, color: "#BF360C", marginTop: 1 }}>{wrongQuizIds.length}問のまちがいをまとめて解こう！</div>
            </div>
            <div style={{ marginLeft: "auto", fontSize: 20 }}>→</div>
          </div>
        )}

        {/* 単元一覧 */}
        <div style={{ marginTop: 16 }}>
          <div style={{ fontWeight: 700, fontSize: 12, color: "#888", marginBottom: 8 }}>📚 単元を選んで！</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
            {UNITS.map(unit => {
              const correctIds = correctIdsMap[unit.id] || new Set();
              const { done, total } = calcUnitProgress(unit, correctIds);
              const completed = done === total;
              return (
                <div key={unit.id} onClick={() => onStart(unit)}
                  style={{
                    background: "#fff", borderRadius: 18, padding: "13px 14px",
                    boxShadow: "0 3px 16px rgba(0,0,0,0.07)", cursor: "pointer",
                    border: `2px solid ${completed ? unit.color : "transparent"}`,
                    display: "flex", alignItems: "center", gap: 12, transition: "transform 0.1s"
                  }}
                  onTouchStart={e => e.currentTarget.style.transform = "scale(0.97)"}
                  onTouchEnd={e => e.currentTarget.style.transform = "scale(1)"}
                  onMouseDown={e => e.currentTarget.style.transform = "scale(0.97)"}
                  onMouseUp={e => e.currentTarget.style.transform = "scale(1)"}>
                  <div style={{
                    width: 48, height: 48, background: unit.bg, borderRadius: 13,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 24, flexShrink: 0
                  }}>{unit.emoji}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 800, fontSize: 14, color: "#333" }}>{unit.title}</div>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 5 }}>
                      <div style={{ height: 5, background: "#f0f0f0", borderRadius: 9, flex: 1 }}>
                        <div style={{
                          height: 5, background: unit.color, borderRadius: 9,
                          width: `${(done / total) * 100}%`, transition: "width 0.6s"
                        }} />
                      </div>
                      <span style={{ fontSize: 10, color: "#bbb", whiteSpace: "nowrap" }}>{done}/{total}問</span>
                    </div>
                  </div>
                  {completed && <div style={{ fontSize: 20, flexShrink: 0 }}>✅</div>}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// ===== 学習記録画面 =====
function HistoryScreen({ history, badges }) {
  const CHART_DAYS = 7;
  const BAR_WIDTH = 28;

  const days = useMemo(() => {
    const map = {};
    history.forEach(h => {
      if (!map[h.date]) map[h.date] = { date: h.date, total: 0, correct: 0 };
      map[h.date].total++;
      if (h.correct) map[h.date].correct++;
    });
    const result = [];
    for (let i = CHART_DAYS - 1; i >= 0; i--) {
      const d = new Date(); d.setDate(d.getDate() - i);
      const key = d.toLocaleDateString("ja-JP", { month: "2-digit", day: "2-digit" });
      result.push(map[key] || { date: key, total: 0, correct: 0 });
    }
    return result;
  }, [history]);

  const maxTotal = Math.max(...days.map(d => d.total), 1);
  const CHART_H = 110;
  const chartWidth = CHART_DAYS * (BAR_WIDTH + 8);
  const getX = (i) => i * (BAR_WIDTH + 8) + (BAR_WIDTH / 2);
  const getY = (d) => d.total === 0 ? CHART_H : CHART_H - Math.max((d.correct / d.total) * CHART_H, 4);
  const linePoints = days.map((d, i) => ({ x: getX(i), y: getY(d), rate: d.total === 0 ? null : Math.round((d.correct / d.total) * 100) }));
  const validPoints = linePoints.filter(p => p.rate !== null);
  const polyline = validPoints.map(p => `${p.x},${p.y}`).join(" ");

  const totalAnswered = history.length;
  const totalCorrect = history.filter(h => h.correct).length;
  const rate = totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0;

  const isEmpty = days.every(d => d.total === 0);

  return (
    <div style={{ padding: "20px 16px 90px" }}>
      <div style={{ fontWeight: 900, fontSize: 18, color: "#333", marginBottom: 16 }}>📊 学習記録</div>

      {/* サマリー */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 16 }}>
        {[
          { label: "解いた問題", value: totalAnswered, unit: "問", color: "#1565C0" },
          { label: "正解数", value: totalCorrect, unit: "問", color: "#66BB6A" },
          { label: "正解率", value: rate, unit: "%", color: "#FFA726" },
        ].map(s => (
          <div key={s.label} style={{
            background: "#fff", borderRadius: 14, padding: "12px 8px",
            textAlign: "center", boxShadow: "0 2px 10px rgba(0,0,0,0.06)"
          }}>
            <div style={{ fontSize: 22, fontWeight: 900, color: s.color }}>{s.value}<span style={{ fontSize: 12 }}>{s.unit}</span></div>
            <div style={{ fontSize: 10, color: "#aaa", marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* バッジ */}
      <div style={{ background: "#fff", borderRadius: 20, padding: "16px", boxShadow: "0 3px 16px rgba(0,0,0,0.07)", marginBottom: 16 }}>
        <div style={{ fontWeight: 700, fontSize: 13, color: "#555", marginBottom: 10 }}>🏅 ゲットしたバッジ</div>
        {badges.length === 0 ? (
          <div style={{ fontSize: 12, color: "#ccc", textAlign: "center", padding: "10px 0" }}>
            クイズを解いてバッジをゲットしよう！
          </div>
        ) : (
          <div style={{ display: "flex", gap: 7, flexWrap: "wrap" }}>
            {badges.map(b => (
              <div key={b.id} style={{
                background: "#FFF9C4", border: "2px solid #FFD700", borderRadius: 12,
                padding: "6px 10px", fontSize: 11, display: "flex",
                alignItems: "center", gap: 4, fontWeight: 700
              }}>
                <span>{b.emoji}</span>
                <div>
                  <div>{b.label}</div>
                  <div style={{ fontSize: 9, color: "#999", fontWeight: 500 }}>{b.desc}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* グラフ */}
      <div style={{ background: "#fff", borderRadius: 20, padding: "18px 14px", boxShadow: "0 3px 16px rgba(0,0,0,0.07)", marginBottom: 16 }}>
        <div style={{ fontWeight: 700, fontSize: 13, color: "#555", marginBottom: 2 }}>日ごとの学習の様子（直近7日）</div>
        <div style={{ fontSize: 10, color: "#aaa", marginBottom: 10 }}>棒グラフ：解いた問題数　折れ線：正解率</div>

        {isEmpty ? (
          <div style={{ textAlign: "center", padding: "20px 0", color: "#ccc", fontSize: 13 }}>まだ記録がないよ。問題を解くと記録されるよ！</div>
        ) : (
          <>
            <div style={{ display: "flex", gap: 0 }}>
              <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", height: CHART_H + 20, paddingBottom: 20, width: 26, flexShrink: 0 }}>
                {[maxTotal, Math.round(maxTotal / 2), 0].map((v, i) => (
                  <div key={i} style={{ fontSize: 9, color: "#bbb", textAlign: "right" }}>{v}</div>
                ))}
              </div>
              <div style={{ flex: 1, overflowX: "auto" }}>
                <div style={{ position: "relative", width: chartWidth, height: CHART_H + 20 }}>
                  <svg style={{ position: "absolute", top: 0, left: 0 }} width={chartWidth} height={CHART_H}>
                    {[0, 0.5, 1].map((r, i) => (
                      <line key={i} x1={0} y1={CHART_H * r} x2={chartWidth} y2={CHART_H * r} stroke="#f0f0f0" strokeWidth={1} />
                    ))}
                  </svg>
                  <div style={{ display: "flex", gap: 8, alignItems: "flex-end", height: CHART_H, position: "relative", zIndex: 1 }}>
                    {days.map((d, i) => {
                      const barH = d.total === 0 ? 2 : Math.max((d.total / maxTotal) * CHART_H, 4);
                      return (
                        <div key={d.date} style={{ width: BAR_WIDTH, flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-end", height: CHART_H }}>
                          {d.total > 0 && <div style={{ fontSize: 9, fontWeight: 700, color: "#1565C0", marginBottom: 2 }}>{d.total}</div>}
                          <div style={{ width: BAR_WIDTH, height: barH, background: d.total > 0 ? "#BBDEFB" : "#f5f5f5", borderRadius: "5px 5px 0 0" }} />
                        </div>
                      );
                    })}
                  </div>
                  {validPoints.length >= 1 && (
                    <svg style={{ position: "absolute", top: 0, left: 0, zIndex: 2, pointerEvents: "none" }} width={chartWidth} height={CHART_H}>
                      {validPoints.length >= 2 && <polyline points={polyline} fill="none" stroke="#1565C0" strokeWidth={2.5} strokeLinejoin="round" strokeLinecap="round" />}
                      {linePoints.map((p, i) => p.rate !== null ? (
                        <g key={i}>
                          <circle cx={p.x} cy={p.y} r={4} fill="#fff" stroke="#1565C0" strokeWidth={2} />
                          <text x={p.x} y={p.y - 7} textAnchor="middle" fontSize={9} fill="#1565C0" fontWeight={700}>{p.rate}%</text>
                        </g>
                      ) : null)}
                    </svg>
                  )}
                  <div style={{ display: "flex", gap: 8, height: 20, alignItems: "center" }}>
                    {days.map(d => (
                      <div key={d.date} style={{ width: BAR_WIDTH, flexShrink: 0, textAlign: "center", fontSize: 9, color: "#aaa" }}>{d.date}</div>
                    ))}
                  </div>
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", height: CHART_H + 20, paddingBottom: 20, width: 26, flexShrink: 0 }}>
                {["100%", "50%", "0%"].map((v, i) => (
                  <div key={i} style={{ fontSize: 9, color: "#1565C0", textAlign: "left" }}>{v}</div>
                ))}
              </div>
            </div>
            <div style={{ display: "flex", gap: 14, marginTop: 8, justifyContent: "center" }}>
              {[{ color: "#BBDEFB", label: "解いた問題数", type: "bar" }, { color: "#1565C0", label: "正解率", type: "line" }].map(l => (
                <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  {l.type === "bar"
                    ? <div style={{ width: 12, height: 12, background: l.color, borderRadius: 3, border: "1px solid #ddd" }} />
                    : <svg width={20} height={12}><line x1={0} y1={6} x2={20} y2={6} stroke={l.color} strokeWidth={2} /><circle cx={10} cy={6} r={3} fill="#fff" stroke={l.color} strokeWidth={2} /></svg>
                  }
                  <span style={{ fontSize: 11, color: "#888" }}>{l.label}</span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* 単元別正解率 */}
      <div style={{ background: "#fff", borderRadius: 20, padding: "18px 16px", boxShadow: "0 3px 16px rgba(0,0,0,0.07)" }}>
        <div style={{ fontWeight: 700, fontSize: 13, color: "#555", marginBottom: 14 }}>単元別 正解率</div>
        {UNITS.map(unit => {
          const uH = history.filter(h => h.unitId === unit.id);
          if (uH.length === 0) return (
            <div key={unit.id} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
              <span style={{ fontSize: 18, width: 24 }}>{unit.emoji}</span>
              <span style={{ fontSize: 12, color: "#aaa", flex: 1 }}>{unit.title}</span>
              <span style={{ fontSize: 11, color: "#ccc" }}>未挑戦</span>
            </div>
          );
          const r = Math.round((uH.filter(h => h.correct).length / uH.length) * 100);
          return (
            <div key={unit.id} style={{ marginBottom: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                <span style={{ fontSize: 16 }}>{unit.emoji}</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: "#444", flex: 1 }}>{unit.title}</span>
                <span style={{ fontSize: 12, fontWeight: 900, color: unit.color }}>{r}%</span>
              </div>
              <div style={{ height: 6, background: "#f0f0f0", borderRadius: 9 }}>
                <div style={{ height: 6, background: unit.color, borderRadius: 9, width: `${r}%`, transition: "width 0.6s" }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ===== 単元詳細画面 =====
function UnitScreen({ unit, correctIds, resumeIndex, onStartQuiz, onBack }) {
  const snd = useSound();
  const total = unit.quizzes.length;
  const { done } = calcUnitProgress(unit, correctIds);
  const hasProgress = resumeIndex > 0 && resumeIndex < total;

  // 前回のスター（正解数から推算）
  const prevStars = done === total ? 3 : done >= Math.ceil(total / 2) ? 2 : done > 0 ? 1 : 0;

  return (
    <div style={{ paddingBottom: 80 }}>
      <div style={{
        background: `linear-gradient(135deg,${unit.color}dd,${unit.color}88)`,
        borderRadius: "0 0 28px 28px", padding: "24px 20px 20px", color: "#fff"
      }}>
        <button onClick={() => { snd.tap(); onBack(); }} style={{
          background: "rgba(255,255,255,0.25)", border: "none",
          color: "#fff", borderRadius: 10, padding: "5px 12px", fontWeight: 700,
          cursor: "pointer", marginBottom: 14
        }}>← もどる</button>
        <div style={{ fontSize: 44, textAlign: "center" }}>{unit.emoji}</div>
        <div style={{ fontSize: 20, fontWeight: 900, textAlign: "center", marginTop: 8 }}>{unit.title}</div>
      </div>
      <div style={{ padding: "18px 16px" }}>
        <div style={{ background: "#fff", borderRadius: 18, padding: 14, boxShadow: "0 3px 16px rgba(0,0,0,0.07)", marginBottom: 14 }}>
          <div style={{ fontWeight: 700, fontSize: 13, color: "#555", marginBottom: 10 }}>📖 この単元で学ぶこと</div>
          {unit.topics.map((t, i) => (
            <div key={i} style={{
              display: "flex", alignItems: "center", gap: 8, padding: "7px 0",
              borderBottom: i < unit.topics.length - 1 ? "1px dashed #eee" : "none"
            }}>
              <div style={{
                width: 22, height: 22, background: unit.bg, borderRadius: 7,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 11, fontWeight: 900, color: unit.color, flexShrink: 0
              }}>{i + 1}</div>
              <div style={{ fontSize: 13, color: "#333" }}>{t}</div>
            </div>
          ))}
        </div>
        {prevStars > 0 && (
          <div style={{
            background: "#FFF9C4", border: "2px solid #FFD700", borderRadius: 14,
            padding: "10px 14px", marginBottom: 14, textAlign: "center"
          }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#B8860B" }}>これまでの記録</div>
            <Stars count={prevStars} />
            <div style={{ fontSize: 11, color: "#aaa", marginTop: 4 }}>{done}/{total}問 正解済み</div>
          </div>
        )}
        <button onClick={() => { snd.tap(); onStartQuiz(false); }}
          style={{
            width: "100%", background: `linear-gradient(135deg,${unit.color},${unit.color}bb)`,
            color: "#fff", border: "none", borderRadius: 18, padding: "16px",
            fontSize: 17, fontWeight: 900, cursor: "pointer", boxShadow: `0 6px 20px ${unit.color}44`
          }}>
          {hasProgress ? "⏭ 続きから挑戦！" : "🎮 クイズに挑戦！"} ({total}問)
        </button>
        {hasProgress && (
          <button onClick={() => { snd.tap(); onStartQuiz(true); }}
            style={{
              width: "100%", background: "#fff", color: "#888", border: "2px solid #eee",
              borderRadius: 18, padding: "12px", fontSize: 14, fontWeight: 700,
              cursor: "pointer", marginTop: 10
            }}>
            最初からやり直す
          </button>
        )}
      </div>
    </div>
  );
}

// ===== クイズ画面 =====
function QuizScreen({ quizzes, unitColor, unitEmoji, unitTitle, isRetry, startIndex = 0, onComplete, onAbort }) {
  const snd = useSound();
  const [shuffledQuizzes] = useState(() => quizzes.map(q => shuffleChoices(q)));
  const [current, setCurrent] = useState(startIndex);
  const [selected, setSelected] = useState(null);
  const [results, setResults] = useState([]);
  const [showHint, setShowHint] = useState(false);
  const [streak, setStreak] = useState(0);
  const [startTime, setStartTime] = useState(Date.now());
  const [fastAnswer, setFastAnswer] = useState(false);
  const [confetti, setConfetti] = useState(false);
  const [finished, setFinished] = useState(false);
  const [newBadges, setNewBadges] = useState([]);

  const quiz = shuffledQuizzes[current];
  const isLast = current === shuffledQuizzes.length - 1;
  const color = unitColor || "#1565C0";

  useEffect(() => {
    setStartTime(Date.now()); setShowHint(false); setSelected(null); setFastAnswer(false);
  }, [current]);

  const handleSelect = (idx) => {
    if (selected !== null) return;
    const elapsed = (Date.now() - startTime) / 1000;
    const correct = idx === quiz.answer;
    setSelected(idx);
    const newResults = [...results, { quizId: quiz.id, correct }];
    setResults(newResults);
    const newStreak = correct ? streak + 1 : 0;
    setStreak(newStreak);
    const fast = elapsed <= 5 && correct;
    setFastAnswer(fast);
    if (correct) {
      if (newStreak >= 3) snd.streak(); else snd.correct();
      setConfetti(true); setTimeout(() => setConfetti(false), 2000);
    } else {
      snd.wrong();
    }
    if (isLast) {
      setTimeout(() => {
        const correctCount = newResults.filter(r => r.correct).length;
        const stars = correctCount === shuffledQuizzes.length ? 3 : correctCount >= Math.ceil(shuffledQuizzes.length / 2) ? 2 : 1;
        const earned = [];
        if (!isRetry && newResults.length <= 1) earned.push("first_quiz");
        if (newStreak >= 3) earned.push("streak3");
        if (fast) earned.push("fast_answer");
        if (correctCount === shuffledQuizzes.length) { earned.push("perfect"); if (isRetry) earned.push("retry_clear"); }
        if (earned.length > 0) snd.badge(); else snd.clear();
        setNewBadges(earned);
        setFinished(true);
        onComplete(newResults, stars, earned);
      }, 1200);
    }
  };

  if (finished) {
    const correct = results.filter(r => r.correct).length;
    const stars = correct === shuffledQuizzes.length ? 3 : correct >= Math.ceil(shuffledQuizzes.length / 2) ? 2 : 1;
    return (
      <div style={{ padding: "32px 20px", textAlign: "center", paddingBottom: 90 }}>
        <Confetti active={stars === 3} />
        <div style={{ fontSize: 64 }}>{stars === 3 ? "🏆" : stars === 2 ? "🥈" : "🥉"}</div>
        <div style={{ fontSize: 24, fontWeight: 900, color: "#333", marginTop: 10 }}>
          {stars === 3 ? "かんぺき！！" : stars === 2 ? "よくできました！" : "がんばったね！"}
        </div>
        <div style={{ fontSize: 15, color: "#666", marginTop: 8 }}>
          {shuffledQuizzes.length}問中 <span style={{ fontWeight: 900, fontSize: 20, color }}>{correct}</span>問 正解！
        </div>
        <div style={{ marginTop: 12 }}><Stars count={stars} /></div>
        {newBadges.length > 0 && (
          <div style={{ margin: "18px 0", background: "#FFF9C4", borderRadius: 16, padding: 14, border: "2px solid #FFD700" }}>
            <div style={{ fontWeight: 700, fontSize: 13, color: "#B8860B", marginBottom: 6 }}>🎉 バッジをゲット！</div>
            {newBadges.map(id => {
              const b = BADGES.find(x => x.id === id);
              return b ? <div key={id} style={{ fontSize: 13, marginBottom: 3 }}>{b.emoji} <strong>{b.label}</strong> — {b.desc}</div> : null;
            })}
          </div>
        )}
        <button onClick={() => onAbort([])} style={{
          marginTop: 16, background: `linear-gradient(135deg,${color},${color}99)`,
          color: "#fff", border: "none", borderRadius: 20, padding: "14px 40px",
          fontSize: 16, fontWeight: 900, cursor: "pointer"
        }}>
          ホームにもどる 🏠
        </button>
      </div>
    );
  }

  return (
    <div style={{ paddingBottom: 80 }}>
      <Confetti active={confetti && selected === quiz.answer} />
      <div style={{
        background: `linear-gradient(135deg,${color}cc,${color}88)`,
        padding: "14px 16px", display: "flex", alignItems: "center", justifyContent: "space-between"
      }}>
        <button onClick={() => onAbort(results)} style={{
          background: "rgba(255,255,255,0.3)", border: "none",
          color: "#fff", borderRadius: 10, padding: "4px 12px", fontWeight: 700,
          cursor: "pointer", fontSize: 12
        }}>✕</button>
        <div style={{ color: "#fff", fontWeight: 800, fontSize: 13 }}>{unitEmoji} {unitTitle}</div>
        <div style={{
          background: "rgba(255,255,255,0.25)", borderRadius: 10, padding: "3px 10px",
          color: "#fff", fontWeight: 900, fontSize: 13
        }}>{current + 1}/{shuffledQuizzes.length}</div>
      </div>

      <div style={{ height: 6, background: "#f0f0f0" }}>
        <div style={{
          height: 6, background: color,
          width: `${((current + (selected !== null ? 1 : 0)) / shuffledQuizzes.length) * 100}%`,
          transition: "width 0.4s"
        }} />
      </div>

      {streak >= 2 && (
        <div style={{
          background: "#FFF3E0", padding: "5px 16px", textAlign: "center",
          fontSize: 12, fontWeight: 700, color: "#E65100"
        }}>
          🔥 {streak}連続正解中！
        </div>
      )}

      <div style={{ padding: "16px" }}>
        <div style={{
          background: "#fff", borderRadius: 22, padding: "18px",
          boxShadow: "0 5px 20px rgba(0,0,0,0.08)", marginBottom: 16
        }}>
          <div style={{ fontSize: 32, textAlign: "center", marginBottom: 10 }}>{quiz.emoji}</div>
          <div style={{ fontSize: 16, fontWeight: 800, color: "#333", lineHeight: 1.65, textAlign: "center" }}>{quiz.q}</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
          {quiz.choices.map((ch, i) => {
            const isCorrect = i === quiz.answer, isSel = i === selected;
            let bg = "#fff", border = "2px solid #eee", col = "#333";
            if (selected !== null) {
              if (isCorrect) { bg = "#E8F5E9"; border = "2px solid #66BB6A"; col = "#2E7D32"; }
              else if (isSel && !isCorrect) { bg = "#FFEBEE"; border = "2px solid #EF5350"; col = "#C62828"; }
            }
            return (
              <button key={i} onClick={() => handleSelect(i)}
                style={{
                  background: bg, border, borderRadius: 14, padding: "12px 14px",
                  fontSize: 14, fontWeight: 700, color: col,
                  cursor: selected !== null ? "default" : "pointer",
                  textAlign: "left", display: "flex", alignItems: "center", gap: 10
                }}>
                <span style={{
                  width: 28, height: 28,
                  background: selected !== null ? (isCorrect ? "#66BB6A" : isSel ? "#EF5350" : "#f0f0f0") : "#EEF2FF",
                  borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center",
                  fontWeight: 900, color: selected !== null ? (isCorrect || isSel ? "#fff" : "#aaa") : color,
                  flexShrink: 0
                }}>
                  {["A", "B", "C", "D"][i]}
                </span>
                <span style={{ flex: 1 }}>{ch}</span>
                {selected !== null && isCorrect && <span>✅</span>}
                {selected !== null && isSel && !isCorrect && <span>❌</span>}
              </button>
            );
          })}
        </div>

        {selected === null && (
          <button onClick={() => setShowHint(h => !h)}
            style={{
              marginTop: 12, background: "transparent", border: "2px dashed #e0e0e0",
              borderRadius: 12, padding: "9px 16px", color: "#bbb",
              fontSize: 12, fontWeight: 700, cursor: "pointer", width: "100%"
            }}>
            💡 ヒントを見る
          </button>
        )}
        {showHint && selected === null && (
          <div style={{
            marginTop: 6, background: "#FFFDE7", borderRadius: 12, padding: "10px 14px",
            fontSize: 12, color: "#795548", border: "1px solid #FFD54F", fontWeight: 600
          }}>💡 {quiz.hint}</div>
        )}

        {selected !== null && (
          <div style={{ marginTop: 14 }}>
            <div style={{
              background: selected === quiz.answer ? "#E8F5E9" : "#FFEBEE",
              borderRadius: 14, padding: "12px 14px",
              fontSize: 13, color: selected === quiz.answer ? "#2E7D32" : "#C62828",
              fontWeight: 700, marginBottom: 10
            }}>
              {selected === quiz.answer
                ? `🎉 正解！${fastAnswer ? " ⚡ はやい！" : ""}`
                : `😅 ざんねん！正解は「${quiz.choices[quiz.answer]}」`}
              <div style={{ fontWeight: 600, marginTop: 4, fontSize: 12 }}>💡 {quiz.hint}</div>
            </div>
            {!isLast && (
              <button onClick={() => { snd.tap(); setCurrent(c => c + 1); }}
                style={{
                  width: "100%", background: `linear-gradient(135deg,${color},${color}aa)`,
                  color: "#fff", border: "none", borderRadius: 14, padding: "13px",
                  fontSize: 15, fontWeight: 900, cursor: "pointer"
                }}>
                次の問題へ →
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ===== メインアプリ =====
export default function App() {
  const [tab, setTab] = useState("home");
  const [screen, setScreen] = useState("home");
  const [activeUnit, setActiveUnit] = useState(null);
  const [restartFromZero, setRestartFromZero] = useState(false);

  // ── 永続化ステート ──
  // correctIdsMap: { [unitId]: Set<quizId> } 一度でも正解した問題のセット
  const [correctIdsMap, setCorrectIdsMap] = useState(() => {
    const saved = loadState();
    if (saved?.correctIdsMap) {
      const result = {};
      for (const [k, v] of Object.entries(saved.correctIdsMap)) {
        result[Number(k)] = new Set(v);
      }
      return result;
    }
    return {};
  });

  // resumeIndexMap: { [unitId]: number } 途中再開用インデックス
  const [resumeIndexMap, setResumeIndexMap] = useState(() => {
    const saved = loadState();
    return saved?.resumeIndexMap || {};
  });

  // wrongQuizIds: string[]
  const [wrongQuizIds, setWrongQuizIds] = useState(() => {
    const saved = loadState();
    return saved?.wrongQuizIds || [];
  });

  // history: { date, unitId, quizId, correct }[]
  const [history, setHistory] = useState(() => {
    const saved = loadState();
    return saved?.history || [];
  });

  // earnedBadges: Badge[]
  const [earnedBadges, setEarnedBadges] = useState(() => {
    const saved = loadState();
    if (saved?.earnedBadgeIds) {
      return BADGES.filter(b => saved.earnedBadgeIds.includes(b.id));
    }
    return [];
  });

  // ── localStorage への永続化（ステート変化のたびに保存） ──
  useEffect(() => {
    const serialized = {};
    for (const [k, v] of Object.entries(correctIdsMap)) {
      serialized[k] = [...v];
    }
    saveState({
      correctIdsMap: serialized,
      resumeIndexMap,
      wrongQuizIds,
      history,
      earnedBadgeIds: earnedBadges.map(b => b.id),
    });
  }, [correctIdsMap, resumeIndexMap, wrongQuizIds, history, earnedBadges]);

  // ── 正解IDマップを更新するヘルパー ──
  const addCorrectIds = useCallback((unitId, quizIds) => {
    if (!unitId || quizIds.length === 0) return;
    setCorrectIdsMap(prev => {
      const next = { ...prev };
      const existing = new Set(next[unitId] || []);
      quizIds.forEach(id => existing.add(id));
      next[unitId] = existing;
      return next;
    });
  }, []);

  // ── 結果を保存する共通処理 ──
  const saveResults = useCallback((results, unitId, isRetryMode) => {
    if (results.length === 0) return;
    const date = todayStr();

    // 学習履歴に追加
    setHistory(h => [...h, ...results.map(r => ({ date, unitId, quizId: r.quizId, correct: r.correct }))]);

    // correctIdsMap を更新（正解した問題を記録）
    const correctedIds = results.filter(r => r.correct).map(r => r.quizId);
    if (unitId && correctedIds.length > 0) {
      addCorrectIds(unitId, correctedIds);
    }

    // まちがいリストの更新
    setWrongQuizIds(prev => {
      const s = new Set(prev);
      results.forEach(r => {
        if (r.correct) s.delete(r.quizId);
        else if (!isRetryMode) s.add(r.quizId);
      });
      return [...s];
    });
  }, [addCorrectIds]);

  // ── 全問解き終わったとき ──
  const handleComplete = useCallback((results, stars, newBadgeIds) => {
    const unitId = activeUnit?.id;
    saveResults(results, unitId, screen === "retry");

    // 途中再開インデックスをリセット
    if (unitId) {
      setResumeIndexMap(prev => ({ ...prev, [unitId]: 0 }));
    }

    // バッジ付与
    if (newBadgeIds?.length > 0) {
      setEarnedBadges(prev => {
        const exist = new Set(prev.map(b => b.id));
        const toAdd = BADGES.filter(b => newBadgeIds.includes(b.id) && !exist.has(b.id));
        return toAdd.length > 0 ? [...prev, ...toAdd] : prev;
      });
    }

    // 全単元クリアチェック（next tick で correctIdsMap が更新された後）
    setTimeout(() => {
      setCorrectIdsMap(currentMap => {
        const allDone = UNITS.every(u => {
          const cids = currentMap[u.id] || new Set();
          return u.quizzes.every(q => cids.has(q.id));
        });
        if (allDone) {
          setEarnedBadges(prev => {
            if (prev.find(b => b.id === "all_units")) return prev;
            const badge = BADGES.find(b => b.id === "all_units");
            return badge ? [...prev, badge] : prev;
          });
        }
        return currentMap;
      });
    }, 100);
  }, [activeUnit, screen, saveResults]);

  // ── ✕ボタンで中断したとき ──
  const handleAbort = useCallback((results) => {
    const unitId = activeUnit?.id;
    saveResults(results, unitId, screen === "retry");

    // 途中再開インデックスを保存
    if (unitId && results.length > 0 && screen !== "retry") {
      setResumeIndexMap(prev => ({ ...prev, [unitId]: results.length }));
    }
    setScreen("home");
  }, [activeUnit, screen, saveResults]);

  const retryQuizzes = useMemo(() => {
    const all = UNITS.flatMap(u => u.quizzes);
    return wrongQuizIds.map(id => all.find(q => q.id === id)).filter(Boolean);
  }, [wrongQuizIds]);

  const color = activeUnit?.color || "#1565C0";
  const activeResumeIndex = activeUnit
    ? restartFromZero ? 0 : (resumeIndexMap[activeUnit.id] || 0)
    : 0;
  const activeCorrectIds = activeUnit ? (correctIdsMap[activeUnit.id] || new Set()) : new Set();

  return (
    <div style={{
      maxWidth: 420, margin: "0 auto", minHeight: "100vh", background: "#F0F4FF",
      fontFamily: "'Hiragino Kaku Gothic ProN','Hiragino Sans','Noto Sans JP',sans-serif",
      position: "relative"
    }}>
      <style>{`
        @keyframes confettiFall {
          0% { transform: translateY(-20px) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
        * { box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
        button { -webkit-tap-highlight-color: transparent; }
      `}</style>

      {tab === "home" && screen === "home" && (
        <HomeScreen
          correctIdsMap={correctIdsMap}
          wrongQuizIds={wrongQuizIds}
          onStart={unit => { setActiveUnit(unit); setRestartFromZero(false); setScreen("unit"); }}
          onStartRetry={() => setScreen("retry")}
        />
      )}
      {tab === "home" && screen === "unit" && activeUnit && (
        <UnitScreen
          unit={activeUnit}
          correctIds={activeCorrectIds}
          resumeIndex={resumeIndexMap[activeUnit.id] || 0}
          onStartQuiz={fromZero => { setRestartFromZero(!!fromZero); setScreen("quiz"); }}
          onBack={() => setScreen("home")}
        />
      )}
      {tab === "home" && screen === "quiz" && activeUnit && (
        <QuizScreen
          quizzes={activeUnit.quizzes}
          unitColor={color}
          unitEmoji={activeUnit.emoji}
          unitTitle={activeUnit.title}
          isRetry={false}
          startIndex={activeResumeIndex}
          onComplete={handleComplete}
          onAbort={handleAbort}
        />
      )}
      {tab === "home" && screen === "retry" && (
        <QuizScreen
          quizzes={retryQuizzes}
          unitColor="#FF9800"
          unitEmoji="📝"
          unitTitle="まちがい直し"
          isRetry={true}
          startIndex={0}
          onComplete={handleComplete}
          onAbort={handleAbort}
        />
      )}
      {tab === "history" && (
        <HistoryScreen history={history} badges={earnedBadges} />
      )}

      {/* ボトムナビ */}
      <div style={{
        position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)",
        width: "100%", maxWidth: 420, background: "#fff",
        borderTop: "1px solid #e8eaf6", display: "flex",
        padding: "8px 0 12px", boxShadow: "0 -4px 20px rgba(0,0,0,0.06)"
      }}>
        {[{ id: "home", emoji: "🏠", label: "ホーム" }, { id: "history", emoji: "📊", label: "学習記録" }].map(t => (
          <button key={t.id} onClick={() => { setTab(t.id); if (t.id === "home") setScreen("home"); }}
            style={{
              flex: 1, background: "none", border: "none", cursor: "pointer",
              display: "flex", flexDirection: "column", alignItems: "center", gap: 2,
              opacity: tab === t.id ? 1 : 0.4, transition: "opacity 0.2s"
            }}>
            <span style={{ fontSize: 22 }}>{t.emoji}</span>
            <span style={{ fontSize: 10, fontWeight: 700, color: tab === t.id ? "#1565C0" : "#888" }}>{t.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
