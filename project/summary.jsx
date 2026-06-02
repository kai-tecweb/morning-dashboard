// ===== 朝のサマリー =====
const { useMemo: useMemoS } = React;

function SummaryView({ orders, inquiries, tasks, openOrder, openInquiry, setView }) {
  const stats = useMemoS(() => {
    const newOrders = orders.filter(o => o.stage === "受注").length;
    const tightOrders = orders.filter(o => o.leadTimeTight && o.stage !== "完了").length;
    const newInq = inquiries.filter(i => i.status === "未対応").length;
    const angry = inquiries.filter(i => i.angerLevel >= 3 && i.status !== "完了").length;
    return { newOrders, tightOrders, newInq, angry };
  }, [orders, inquiries]);

  // AIが整理した優先タスクトップ5
  const priorities = useMemoS(() => {
    const fromOrders = orders
      .filter(o => o.priority === "high" && o.stage !== "完了")
      .map(o => ({
        kind: "order",
        id: o.id,
        title: `${o.customer}`,
        subtitle: o.items.map(i => i.name).join(" / "),
        reason: o.needsCustomerQuestion
          ? `${o.customerQuestion}`
          : o.leadTimeTight
          ? `納期：${o.deliveryDate} — 製造を朝イチ着手`
          : `合計 ¥${o.totalYen.toLocaleString()} の業務用大口`,
        chips: o.flags,
        data: o,
      }));
    const fromInq = inquiries
      .filter(i => i.angerLevel >= 2 && i.status !== "完了")
      .map(i => ({
        kind: "inquiry",
        id: i.id,
        title: i.customer,
        subtitle: i.subject,
        reason: i.angerLevel === 3 ? "強いクレーム — 折返し電話を最優先" : i.preview.slice(0, 64) + "…",
        chips: i.tags,
        data: i,
        anger: i.angerLevel,
      }));
    const merged = [...fromInq, ...fromOrders].sort((a, b) => {
      const score = x => (x.anger || 0) * 10 + (x.data.leadTimeTight ? 5 : 0) + (x.data.needsCustomerQuestion ? 3 : 0);
      return score(b) - score(a);
    });
    return merged.slice(0, 6);
  }, [orders, inquiries]);

  return (
    <div>
      {/* HERO */}
      <div className="summary-hero">
        <div className="summary-hero-grid">
          <div>
            <span className="hero-eyebrow">
              <span className="hero-eyebrow-pulse" />
              AI が整理しました ・ 06:42 更新
            </span>
            <h1 className="hero-title">
              昨夜のあいだに <em>{stats.newOrders + stats.newInq}件</em> 入っています。<br/>
              優先度の高い <em>{stats.angry + stats.tightOrders}件</em> から取り掛かりましょう。
            </h1>
            <p className="hero-desc">
              23:00〜06:30 のあいだに届いた注文・問い合わせを、納期・怒り度・顧客タイプで自動仕分けしています。カードをクリックすると詳細が開きます。
            </p>
          </div>
          <div className="hero-stats">
            <div className="hero-stat">
              <div className="hero-stat-label">新規注文</div>
              <div className="hero-stat-num">{stats.newOrders}<span className="hero-stat-unit">件</span></div>
              <div className="hero-stat-foot">未処理 / 受注ステージ</div>
            </div>
            <div className="hero-stat urgent">
              <div className="hero-stat-label">短納期 ／ 本日着</div>
              <div className="hero-stat-num">{stats.tightOrders}<span className="hero-stat-unit">件</span></div>
              <div className="hero-stat-foot">朝イチで製造へ</div>
            </div>
            <div className="hero-stat">
              <div className="hero-stat-label">新着 問い合わせ</div>
              <div className="hero-stat-num">{stats.newInq}<span className="hero-stat-unit">件</span></div>
              <div className="hero-stat-foot">未対応のみ</div>
            </div>
            <div className="hero-stat urgent">
              <div className="hero-stat-label">クレーム ／ 怒り度 高</div>
              <div className="hero-stat-num">{stats.angry}<span className="hero-stat-unit">件</span></div>
              <div className="hero-stat-foot">折返し電話を推奨</div>
            </div>
          </div>
        </div>
      </div>

      {/* Priority list + Today */}
      <div className="priority-grid">
        <div className="card card-pad">
          <div className="section-head">
            <div>
              <h2 className="section-title">今朝、まずこれを</h2>
              <div className="section-sub">優先度トップ {priorities.length} 件 — 怒り度・短納期・大口を加味</div>
            </div>
            <button className="btn btn-ghost btn-sm" onClick={() => setView("orders")}>
              すべて見る <Icon name="arrow-right" size={12}/>
            </button>
          </div>
          {priorities.map((p, idx) => (
            <div className="prio-item" key={p.id} onClick={() => p.kind === "order" ? openOrder(p.id) : openInquiry(p.id)} style={{cursor:"pointer"}}>
              <div className={`prio-rank r${Math.min(idx+1, 3)}`}>{idx+1}</div>
              <div className="prio-body">
                <div className="prio-title">
                  {p.title}
                  <span className="prio-id">{p.id}</span>
                  {p.kind === "inquiry" && p.anger === 3 && <span className="chip chip-rose"><Icon name="alert" size={10}/>怒り度 高</span>}
                  {p.kind === "order" && p.data.leadTimeTight && <span className="chip chip-rose"><Icon name="clock" size={10}/>短納期</span>}
                  {p.kind === "order" && p.data.needsCustomerQuestion && <span className="chip chip-amber"><Icon name="help" size={10}/>顧客確認</span>}
                  {p.kind === "inquiry" && p.data.needsSupplierContact && <span className="chip chip-plum">仕入先確認</span>}
                </div>
                <div className="prio-reason">{p.reason}</div>
              </div>
              <button className="btn btn-ghost btn-sm prio-action" onClick={(e) => { e.stopPropagation(); p.kind === "order" ? openOrder(p.id) : openInquiry(p.id); }}>
                開く
              </button>
            </div>
          ))}
        </div>

        {/* Today snapshot */}
        <div style={{display:"flex", flexDirection:"column", gap:16}}>
          <div className="card card-pad">
            <div className="section-head">
              <h2 className="section-title">注文の流れ</h2>
              <button className="btn btn-ghost btn-sm" onClick={() => setView("orders")}>ボードへ <Icon name="arrow-right" size={12}/></button>
            </div>
            <FlowMini orders={orders} />
          </div>

          <div className="card card-pad">
            <div className="section-head">
              <h2 className="section-title">今日のタスク</h2>
              <button className="btn btn-ghost btn-sm" onClick={() => setView("tasks")}>すべて <Icon name="arrow-right" size={12}/></button>
            </div>
            <TasksMini tasks={tasks} />
          </div>
        </div>
      </div>
    </div>
  );
}

function FlowMini({ orders }) {
  const counts = STAGES.map(s => orders.filter(o => o.stage === s).length);
  const total = counts.reduce((a, b) => a + b, 0) || 1;
  const icons = ["cart", "factory", "package", "truck", "check-circle"];
  const colors = ["#8A6CA3", "#C66F4D", "#D4A24C", "#7E9A75", "#6E8AA8"];
  return (
    <div style={{display:"flex", flexDirection:"column", gap:10}}>
      {STAGES.map((s, i) => (
        <div key={s} style={{display:"flex", alignItems:"center", gap:10}}>
          <div style={{
            width: 26, height: 26, borderRadius: 8,
            background: colors[i], color: "#fff",
            display: "grid", placeItems: "center", flexShrink: 0
          }}>
            <Icon name={icons[i]} size={13}/>
          </div>
          <div style={{flex: 1, minWidth: 0}}>
            <div style={{display:"flex", justifyContent:"space-between", marginBottom: 4, fontSize: 12}}>
              <span style={{fontWeight: 600}}>{s}</span>
              <span style={{color: "var(--ink-3)", fontVariantNumeric: "tabular-nums"}}>{counts[i]} 件</span>
            </div>
            <div style={{height: 6, background:"var(--line-2)", borderRadius:99, overflow:"hidden"}}>
              <div style={{
                height:"100%",
                width: `${(counts[i] / total) * 100}%`,
                background: colors[i],
                borderRadius: 99,
                transition: "width .3s"
              }}/>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function TasksMini({ tasks }) {
  const undone = tasks.filter(t => !t.done);
  const done = tasks.filter(t => t.done).length;
  const total = tasks.length;
  const pct = Math.round((done / total) * 100);
  const C = 2 * Math.PI * 32;
  return (
    <div>
      <div className="ring-wrap">
        <svg className="ring-svg" viewBox="0 0 84 84">
          <circle cx="42" cy="42" r="32" fill="none" stroke="#EBE0C5" strokeWidth="8"/>
          <circle cx="42" cy="42" r="32" fill="none" stroke="#C66F4D" strokeWidth="8"
            strokeDasharray={C} strokeDashoffset={C - (C * pct/100)}
            strokeLinecap="round"
            transform="rotate(-90 42 42)"/>
          <text x="42" y="44" textAnchor="middle" className="ring-text">{pct}%</text>
          <text x="42" y="58" textAnchor="middle" className="ring-sub-text">完了</text>
        </svg>
        <div>
          <div style={{fontFamily:"var(--font-display)", fontWeight:600, fontSize:15, marginBottom:4}}>
            残り {undone.length} タスク
          </div>
          <div style={{fontSize:12, color:"var(--ink-2)", lineHeight:1.6}}>
            高優先 {undone.filter(t => t.priority === "high").length} 件 ／ 中 {undone.filter(t => t.priority === "med").length} 件 ／ 低 {undone.filter(t => t.priority === "low").length} 件
          </div>
        </div>
      </div>
    </div>
  );
}

window.SummaryView = SummaryView;
