// ===== 問い合わせ =====
const { useState: useStateI, useMemo: useMemoI } = React;

function InquiriesView({ inquiries, onChangeStatus, openInquiry }) {
  const [filter, setFilter] = useStateI("all");

  const filters = [
    { key: "all", label: "すべて" },
    { key: "未対応", label: "未対応" },
    { key: "anger3", label: "怒り度 高" },
    { key: "クレーム", label: "クレーム" },
    { key: "型番違い", label: "型番違い" },
    { key: "色違い", label: "色違い" },
    { key: "メーカー確認要", label: "メーカー確認要" },
    { key: "配送", label: "配送" },
    { key: "その他", label: "その他" },
    { key: "完了", label: "完了" },
  ];

  const countFor = (k) => {
    if (k === "all") return inquiries.length;
    if (k === "anger3") return inquiries.filter(i => i.angerLevel >= 3 && i.status !== "完了").length;
    if (k === "未対応" || k === "完了") return inquiries.filter(i => i.status === k).length;
    return inquiries.filter(i => i.type === k).length;
  };

  const visible = useMemoI(() => {
    let list = inquiries;
    if (filter === "anger3") list = list.filter(i => i.angerLevel >= 3 && i.status !== "完了");
    else if (filter === "未対応" || filter === "完了") list = list.filter(i => i.status === filter);
    else if (filter !== "all") list = list.filter(i => i.type === filter);
    return [...list].sort((a, b) => {
      const sa = a.status === "完了" ? 100 : 0;
      const sb = b.status === "完了" ? 100 : 0;
      return (sa - sb) || (b.angerLevel - a.angerLevel);
    });
  }, [inquiries, filter]);

  return (
    <div>
      <div className="section-head" style={{marginBottom: 18}}>
        <div>
          <h2 className="section-title" style={{fontSize: 20}}>問い合わせ</h2>
          <div className="section-sub">怒り度・種別で自動仕分け — 各カードのボタンでステータス変更</div>
        </div>
      </div>

      <div className="inquiries-layout">
        <div className="card card-pad" style={{position:"sticky", top: 122, height:"fit-content"}}>
          <div style={{fontFamily:"var(--font-display)", fontWeight:600, fontSize:13, color:"var(--ink-3)", marginBottom: 10, letterSpacing:".04em"}}>
            絞り込み
          </div>
          <div className="filter-list">
            {filters.map(f => (
              <button key={f.key} className={`filter-item ${filter === f.key ? "active" : ""}`} onClick={() => setFilter(f.key)}>
                <span>{f.label}</span>
                <span className="filter-item-count">{countFor(f.key)}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="inq-list">
          {visible.map(i => (
            <InquiryCard key={i.id} inq={i} onChangeStatus={onChangeStatus} openInquiry={openInquiry}/>
          ))}
          {visible.length === 0 && (
            <div className="card card-pad" style={{textAlign:"center", color:"var(--ink-3)"}}>
              該当する問い合わせはありません
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function InquiryCard({ inq, onChangeStatus, openInquiry }) {
  const faces = { 1: "🙂", 2: "😠", 3: "😡" };
  const labels = { 1: "落ち着き", 2: "やや怒", 3: "高い怒り" };
  const typeChips = {
    "クレーム": "chip-rose",
    "型番違い": "chip-terra",
    "色違い": "chip-amber",
    "メーカー確認要": "chip-plum",
    "配送": "chip-sage",
    "その他": "chip-line",
  };
  const statusChips = {
    "未対応": "chip-rose",
    "対応中": "chip-amber",
    "完了": "chip-sage",
  };
  return (
    <div className={`inq-card ${inq.status === "完了" ? "done" : ""}`} onClick={() => openInquiry(inq.id)} style={{cursor:"pointer"}}>
      <div className={`anger lv${inq.angerLevel}`}>
        <div className="anger-face">{faces[inq.angerLevel]}</div>
        <div className="anger-label">{labels[inq.angerLevel]}</div>
      </div>
      <div className="inq-body">
        <div className="inq-head">
          <span className="inq-customer">{inq.customer}</span>
          <span className={`chip ${typeChips[inq.type]}`}>{inq.type}</span>
          <span className={`chip ${statusChips[inq.status]}`}>{inq.status}</span>
          <span className="inq-meta">{inq.id} ・ {inq.receivedAt}</span>
        </div>
        <div className="inq-subject">{inq.subject}</div>
        <div className="inq-preview">{inq.preview}</div>
        <div className="inq-tags">
          {inq.relatedOrder && <span className="chip chip-line">関連: {inq.relatedOrder}</span>}
          {inq.needsSupplierContact && <span className="chip chip-plum">仕入先: {inq.supplier}</span>}
          {inq.tags.map(t => <span key={t} className="chip chip-line">{t}</span>)}
        </div>
      </div>
      <div className="inq-actions" onClick={(e) => e.stopPropagation()}>
        {inq.status === "未対応" && (
          <button className="btn btn-primary btn-sm" onClick={() => onChangeStatus(inq.id, "対応中")}>
            対応開始
          </button>
        )}
        {inq.status === "対応中" && (
          <button className="btn btn-primary btn-sm" onClick={() => onChangeStatus(inq.id, "完了")}>
            完了にする
          </button>
        )}
        {inq.status === "完了" && (
          <button className="btn btn-ghost btn-sm" onClick={() => onChangeStatus(inq.id, "対応中")}>
            再開
          </button>
        )}
        {inq.angerLevel === 3 && inq.status !== "完了" && (
          <button className="btn btn-ghost btn-sm" style={{color:"var(--rose-ink)"}}>
            <Icon name="phone" size={11}/> 電話する
          </button>
        )}
        <button className="btn btn-ghost btn-sm" onClick={() => openInquiry(inq.id)}>
          詳細 <Icon name="arrow-right" size={11}/>
        </button>
      </div>
    </div>
  );
}

window.InquiriesView = InquiriesView;
