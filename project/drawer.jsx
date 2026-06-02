// ===== 詳細ドロワー =====
function Drawer({ open, onClose, kind, item, onAdvance, onBack, onChangeStatus }) {
  if (!open || !item) return null;
  return (
    <React.Fragment>
      <div className="drawer-overlay" onClick={onClose}/>
      <div className="drawer">
        <div className="drawer-head">
          <div>
            <div style={{fontSize: 11, color:"var(--ink-3)", letterSpacing:".04em", marginBottom: 4}}>
              {kind === "order" ? "注文" : "問い合わせ"} ・ {item.id}
            </div>
            <h2 style={{fontSize: 18, fontFamily:"var(--font-display)", fontWeight: 600}}>
              {kind === "order" ? item.customer : item.subject}
            </h2>
            {kind === "order" && <div style={{color:"var(--ink-2)", fontSize:13, marginTop:2}}>{item.customerType} / {item.receivedLabel} 受注 {item.receivedAt}</div>}
            {kind === "inquiry" && <div style={{color:"var(--ink-2)", fontSize:13, marginTop:2}}>{item.customer} ・ {item.customerType} ・ {item.receivedAt}</div>}
          </div>
          <button className="btn-icon" onClick={onClose}><Icon name="x" size={14}/></button>
        </div>

        <div className="drawer-body">
          {kind === "order" ? <OrderDetail order={item}/> : <InquiryDetail inq={item}/>}
        </div>

        <div className="drawer-foot">
          <button className="btn btn-ghost" onClick={onClose}>閉じる</button>
          {kind === "order" && item.stage !== "完了" && (
            <button className="btn btn-primary" onClick={() => { onAdvance(item.id); onClose(); }}>
              {STAGES[STAGES.indexOf(item.stage) + 1]} へ進める <Icon name="arrow-right" size={12}/>
            </button>
          )}
          {kind === "inquiry" && item.status === "未対応" && (
            <button className="btn btn-primary" onClick={() => { onChangeStatus(item.id, "対応中"); onClose(); }}>
              対応開始
            </button>
          )}
          {kind === "inquiry" && item.status === "対応中" && (
            <button className="btn btn-primary" onClick={() => { onChangeStatus(item.id, "完了"); onClose(); }}>
              完了にする
            </button>
          )}
        </div>
      </div>
    </React.Fragment>
  );
}

function OrderDetail({ order }) {
  const idx = STAGES.indexOf(order.stage);
  return (
    <div>
      <div className="kv-list">
        <div className="kv-row"><span className="kv-key">合計金額</span><span className="kv-val" style={{fontFamily:"var(--font-display)", fontWeight:700, fontSize:16}}>¥{order.totalYen.toLocaleString()}</span></div>
        <div className="kv-row"><span className="kv-key">納期</span>
          <span className="kv-val">
            {order.deliveryDate}
            {order.leadTimeTight && <span className="chip chip-rose" style={{marginLeft:8}}>短納期</span>}
          </span>
        </div>
        <div className="kv-row"><span className="kv-key">顧客タイプ</span><span className="kv-val">{order.customerType}</span></div>
      </div>

      <h3 style={{fontSize:13, color:"var(--ink-3)", textTransform:"uppercase", letterSpacing:".05em", margin:"4px 0 10px"}}>商品</h3>
      <div style={{display:"flex", flexDirection:"column", gap: 8, marginBottom: 22}}>
        {order.items.map((i, idx) => (
          <div key={idx} style={{display:"flex", justifyContent:"space-between", padding:"10px 14px", background:"var(--surface-2)", borderRadius: 10, border:"1px solid var(--line)"}}>
            <span style={{fontSize:13}}>{i.name}</span>
            <span style={{fontSize:13, color:"var(--ink-2)", fontVariantNumeric:"tabular-nums"}}>{i.qty}</span>
          </div>
        ))}
      </div>

      <h3 style={{fontSize:13, color:"var(--ink-3)", textTransform:"uppercase", letterSpacing:".05em", margin:"4px 0 10px"}}>進行状況</h3>
      <div className="timeline">
        {STAGES.map((s, i) => (
          <div key={s} className={`tl-step ${i < idx ? "done" : i === idx ? "current" : ""}`}>
            <div className="tl-dot"/>
            <div className="tl-label">{s}</div>
            <div className="tl-time">
              {i < idx ? "完了" : i === idx ? "現在進行中" : "—"}
            </div>
          </div>
        ))}
      </div>

      {(order.needsCustomerQuestion || order.notes.length > 0) && (
        <React.Fragment>
          <h3 style={{fontSize:13, color:"var(--ink-3)", textTransform:"uppercase", letterSpacing:".05em", margin:"4px 0 10px"}}>メモ・確認事項</h3>
          <div className="note-list">
            {order.needsCustomerQuestion && (
              <div className="note-item" style={{background:"#FBF1DA", borderColor:"#E8D8B5"}}>
                <div className="note-icon"><Icon name="help" size={11}/></div>
                <div><strong>顧客への質問が必要：</strong>{order.customerQuestion}</div>
              </div>
            )}
            {order.notes.map((n, i) => (
              <div key={i} className="note-item">
                <div className="note-icon" style={{background:"var(--sage-soft)", color:"var(--sage-ink)"}}><Icon name="note" size={11}/></div>
                <div>{n}</div>
              </div>
            ))}
          </div>
        </React.Fragment>
      )}
    </div>
  );
}

function InquiryDetail({ inq }) {
  const faces = { 1: "🙂 落ち着き", 2: "😠 やや怒り", 3: "😡 高い怒り" };
  return (
    <div>
      <div className="kv-list">
        <div className="kv-row"><span className="kv-key">種別</span><span className="kv-val">{inq.type}</span></div>
        <div className="kv-row"><span className="kv-key">ステータス</span><span className="kv-val">{inq.status}</span></div>
        <div className="kv-row"><span className="kv-key">怒り度</span><span className="kv-val">{faces[inq.angerLevel]}</span></div>
        {inq.relatedOrder && <div className="kv-row"><span className="kv-key">関連注文</span><span className="kv-val">{inq.relatedOrder}</span></div>}
        {inq.needsSupplierContact && <div className="kv-row"><span className="kv-key">仕入先</span><span className="kv-val">{inq.supplier}</span></div>}
      </div>

      <h3 style={{fontSize:13, color:"var(--ink-3)", textTransform:"uppercase", letterSpacing:".05em", margin:"4px 0 10px"}}>お客様からの本文</h3>
      <div style={{padding:"14px 16px", background:"var(--surface-2)", border:"1px solid var(--line)", borderRadius: 12, fontSize: 13, color:"var(--ink-2)", lineHeight: 1.7, marginBottom: 22}}>
        {inq.preview}
      </div>

      <h3 style={{fontSize:13, color:"var(--ink-3)", textTransform:"uppercase", letterSpacing:".05em", margin:"4px 0 10px"}}>
        <Icon name="spark" size={12}/> AIからの推奨アクション
      </h3>
      <div className="note-item" style={{background:"#FBF1DA", borderColor:"#E8D8B5", marginBottom: 22}}>
        <div className="note-icon"><Icon name="spark" size={11}/></div>
        <div>{inq.suggestedReply}</div>
      </div>

      {inq.tags.length > 0 && (
        <div style={{display:"flex", gap:6, flexWrap:"wrap"}}>
          {inq.tags.map(t => <span key={t} className="chip chip-line">{t}</span>)}
        </div>
      )}
    </div>
  );
}

window.Drawer = Drawer;
