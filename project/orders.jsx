// ===== 注文フロー（カンバン）=====
function OrdersView({ orders, onAdvance, onBack, openOrder }) {
  const stageMeta = {
    "受注": { icon: "cart", cls: "s1" },
    "製造": { icon: "factory", cls: "s2" },
    "梱包": { icon: "package", cls: "s3" },
    "発送": { icon: "truck", cls: "s4" },
    "完了": { icon: "check-circle", cls: "s5" },
  };

  return (
    <div>
      <div className="section-head" style={{marginBottom: 18}}>
        <div>
          <h2 className="section-title" style={{fontSize: 20}}>注文の流れ</h2>
          <div className="section-sub">クリックで詳細 ／ 矢印ボタンで次工程へ — リアルタイム反映</div>
        </div>
        <div style={{display:"flex", gap:8}}>
          <button className="btn btn-ghost btn-sm">
            <Icon name="search" size={12}/> 検索
          </button>
          <button className="btn btn-primary btn-sm">
            <Icon name="plus" size={12}/> 新規注文
          </button>
        </div>
      </div>

      <div className="board">
        {STAGES.map(stage => {
          const stageOrders = orders.filter(o => o.stage === stage);
          const meta = stageMeta[stage];
          return (
            <div className="col" key={stage}>
              <div className="col-head">
                <div className="col-title">
                  <span className={`col-icon ${meta.cls}`}><Icon name={meta.icon} size={12}/></span>
                  {stage}
                </div>
                <div className="col-count">{stageOrders.length}</div>
              </div>
              {stageOrders.map(o => (
                <OrderCard key={o.id} order={o} onAdvance={onAdvance} onBack={onBack} openOrder={openOrder} stage={stage}/>
              ))}
              {stageOrders.length === 0 && (
                <div style={{padding: 24, textAlign:"center", color:"var(--ink-3)", fontSize: 12}}>
                  — 該当なし —
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function OrderCard({ order, onAdvance, onBack, openOrder, stage }) {
  const cls = order.leadTimeTight ? "urgent" : (order.needsCustomerQuestion ? "warn" : "");
  const isFirst = stage === "受注";
  const isLast = stage === "完了";
  return (
    <div className={`ord-card ${cls}`} onClick={() => openOrder(order.id)}>
      <div className="ord-card-head">
        <span className="ord-id">{order.id}</span>
        <span className="ord-time">{order.receivedAt}</span>
      </div>
      <div className="ord-customer">{order.customer}</div>
      <div className="ord-items">
        {order.items.map(i => `${i.name}（${i.qty}）`).join(" / ")}
      </div>
      <div className="ord-foot">
        <span className="ord-yen">¥{order.totalYen.toLocaleString()}</span>
        <div className="ord-flags">
          {order.leadTimeTight && <span className="chip chip-rose"><span className="chip-dot"/>短納期</span>}
          {order.needsCustomerQuestion && <span className="chip chip-amber"><span className="chip-dot"/>顧客確認</span>}
          {order.customerType === "業務用" && <span className="chip chip-line">業務</span>}
        </div>
      </div>
      {!isLast && (
        <div className="ord-quick" onClick={(e) => e.stopPropagation()}>
          {!isFirst && (
            <button className="back" onClick={() => onBack(order.id)} title="前の工程へ戻す">
              <Icon name="arrow-left" size={11}/>
            </button>
          )}
          <button onClick={() => onAdvance(order.id)} title="次の工程へ進める">
            {STAGES[STAGES.indexOf(stage)+1]} へ進める <Icon name="arrow-right" size={11}/>
          </button>
        </div>
      )}
    </div>
  );
}

window.OrdersView = OrdersView;
