// ===== 今日のタスク =====
const { useMemo: useMemoT } = React;

function TasksView({ tasks, onToggle }) {
  const groups = useMemoT(() => {
    const byPriority = { high: [], med: [], low: [] };
    tasks.forEach(t => byPriority[t.priority].push(t));
    return byPriority;
  }, [tasks]);

  const done = tasks.filter(t => t.done).length;
  const pct = Math.round((done / tasks.length) * 100);
  const C = 2 * Math.PI * 56;

  const groupMeta = {
    high: { label: "高優先・朝イチで",  color: "var(--rose)" },
    med:  { label: "中優先・午前中に",  color: "var(--amber)" },
    low:  { label: "低優先・余裕があれば", color: "var(--sage)" },
  };

  return (
    <div>
      <div className="section-head" style={{marginBottom: 18}}>
        <div>
          <h2 className="section-title" style={{fontSize: 20}}>今日のタスク</h2>
          <div className="section-sub">AIが注文・問い合わせから自動生成 — チェックで完了</div>
        </div>
        <button className="btn btn-ghost btn-sm">
          <Icon name="plus" size={12}/> タスク追加
        </button>
      </div>

      <div className="tasks-grid">
        <div className="card card-pad">
          {["high", "med", "low"].map(p => (
            <div className="task-group" key={p}>
              <div className="task-group-head">
                <span className="task-group-dot" style={{background: groupMeta[p].color}}/>
                {groupMeta[p].label}
                <span style={{color:"var(--ink-3)", fontWeight:400, marginLeft: 4}}>
                  {groups[p].filter(t => !t.done).length} / {groups[p].length}
                </span>
              </div>
              {groups[p].map(t => (
                <div key={t.id} className={`task-row ${t.done ? "done" : ""}`} onClick={() => onToggle(t.id)}>
                  <div className="task-check">
                    <Icon name="check" size={14}/>
                  </div>
                  <div className="task-body">
                    <div className="task-title">{t.title}</div>
                    <div className="task-meta">
                      <span className={`task-due ${(!t.done && parseInt(t.dueBy) <= 9) ? "late" : ""}`}>
                        <Icon name="clock" size={10}/> {t.dueBy}
                      </span>
                      <span className="chip chip-line" style={{height:18, fontSize:10, padding:"0 7px"}}>{t.category}</span>
                      {t.linkedTo && <span style={{color:"var(--ink-3)"}}>→ {t.linkedTo}</span>}
                    </div>
                  </div>
                </div>
              ))}
              {groups[p].length === 0 && (
                <div style={{padding:"8px 12px", color:"var(--ink-3)", fontSize: 12}}>該当なし</div>
              )}
            </div>
          ))}
        </div>

        <div style={{display:"flex", flexDirection:"column", gap:16}}>
          <div className="card card-pad" style={{textAlign:"center", padding:"28px 22px"}}>
            <svg viewBox="0 0 140 140" style={{width: 160, height: 160}}>
              <circle cx="70" cy="70" r="56" fill="none" stroke="#EBE0C5" strokeWidth="11"/>
              <circle cx="70" cy="70" r="56" fill="none" stroke="#C66F4D" strokeWidth="11"
                strokeDasharray={C} strokeDashoffset={C - (C * pct/100)}
                strokeLinecap="round"
                transform="rotate(-90 70 70)"
                style={{transition:"stroke-dashoffset .4s"}}/>
              <text x="70" y="68" textAnchor="middle" style={{fontFamily:"var(--font-display)", fontWeight:700, fontSize:30, fill:"var(--ink)"}}>{pct}%</text>
              <text x="70" y="86" textAnchor="middle" style={{fontSize:11, fill:"var(--ink-3)"}}>{done} / {tasks.length} 完了</text>
            </svg>
            <div style={{fontFamily:"var(--font-display)", fontSize:14, color:"var(--ink-2)", marginTop:8}}>
              この調子で進めましょう
            </div>
          </div>

          <div className="card card-pad">
            <div className="section-head">
              <h2 className="section-title" style={{fontSize:15}}>カテゴリ別</h2>
            </div>
            <CategoryBars tasks={tasks}/>
          </div>
        </div>
      </div>
    </div>
  );
}

function CategoryBars({ tasks }) {
  const cats = ["顧客確認", "問い合わせ", "梱包", "製造", "発注", "仕入先確認"];
  return (
    <div style={{display:"flex", flexDirection:"column", gap:12}}>
      {cats.map(c => {
        const list = tasks.filter(t => t.category === c);
        const total = list.length;
        const done = list.filter(t => t.done).length;
        if (total === 0) return null;
        return (
          <div key={c}>
            <div style={{display:"flex", justifyContent:"space-between", fontSize:12, marginBottom:5}}>
              <span style={{fontWeight: 500}}>{c}</span>
              <span style={{color:"var(--ink-3)", fontVariantNumeric:"tabular-nums"}}>{done} / {total}</span>
            </div>
            <div style={{height:6, background:"var(--line-2)", borderRadius:99, overflow:"hidden"}}>
              <div style={{
                height:"100%",
                width: `${(done/total)*100}%`,
                background:"var(--sage)",
                borderRadius:99,
                transition:"width .3s",
              }}/>
            </div>
          </div>
        );
      })}
    </div>
  );
}

window.TasksView = TasksView;
