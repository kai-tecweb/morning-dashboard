// ===== メインアプリ =====
const { useState, useEffect } = React;

function App() {
  const [view, setView] = useState("summary");
  const [orders, setOrders] = useState(window.initialOrders);
  const [inquiries, setInquiries] = useState(window.initialInquiries);
  const [tasks, setTasks] = useState(window.initialTasks);
  const [drawer, setDrawer] = useState({ open: false, kind: null, id: null });
  const [toast, setToast] = useState(null);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2200);
  };

  // ===== ハンドラ =====
  const advanceOrder = (id) => {
    setOrders(prev => prev.map(o => {
      if (o.id !== id) return o;
      const i = STAGES.indexOf(o.stage);
      if (i >= STAGES.length - 1) return o;
      const next = STAGES[i + 1];
      showToast(`${o.id} を「${next}」へ進めました`);
      return { ...o, stage: next };
    }));
  };
  const backOrder = (id) => {
    setOrders(prev => prev.map(o => {
      if (o.id !== id) return o;
      const i = STAGES.indexOf(o.stage);
      if (i <= 0) return o;
      const next = STAGES[i - 1];
      showToast(`${o.id} を「${next}」へ戻しました`);
      return { ...o, stage: next };
    }));
  };
  const changeInquiryStatus = (id, status) => {
    setInquiries(prev => prev.map(i => {
      if (i.id !== id) return i;
      showToast(`${i.id} を「${status}」に変更しました`);
      return { ...i, status };
    }));
  };
  const toggleTask = (id) => {
    setTasks(prev => prev.map(t => {
      if (t.id !== id) return t;
      if (!t.done) showToast("タスクを完了にしました 🎉");
      return { ...t, done: !t.done };
    }));
  };
  const openOrder = (id) => setDrawer({ open: true, kind: "order", id });
  const openInquiry = (id) => setDrawer({ open: true, kind: "inquiry", id });
  const closeDrawer = () => setDrawer({ open: false, kind: null, id: null });

  // ===== カウンタ =====
  const newOrderCount = orders.filter(o => o.stage === "受注").length;
  const unhandledInq = inquiries.filter(i => i.status !== "完了").length;
  const undoneTasks = tasks.filter(t => !t.done).length;

  const drawerItem = drawer.open
    ? (drawer.kind === "order" ? orders.find(o => o.id === drawer.id) : inquiries.find(i => i.id === drawer.id))
    : null;

  const today = new Date(2026, 5, 2); // June 2, 2026
  const dateStr = `${today.getFullYear()}年${today.getMonth()+1}月${today.getDate()}日（火）`;

  const tabs = [
    { key: "summary",   label: "朝のサマリー", icon: "sun",     count: null },
    { key: "orders",    label: "注文の流れ",   icon: "package", count: newOrderCount, urgent: false },
    { key: "inquiries", label: "問い合わせ",   icon: "message", count: unhandledInq, urgent: inquiries.some(i => i.angerLevel >= 3 && i.status !== "完了") },
    { key: "tasks",     label: "今日のタスク", icon: "list",    count: undoneTasks },
  ];

  return (
    <div className="app">
      <header className="topbar">
        <div className="topbar-inner">
          <div className="topbar-row">
            <div className="brand">
              <div className="brand-mark">和</div>
              <div>
                <div className="brand-name">和牛屋ふくだ ・ 朝の整理</div>
                <div className="brand-sub">MORNING TRIAGE / EC OPERATIONS</div>
              </div>
            </div>
            <div className="greeting">
              <span className="greeting-hello">おはようございます、福田さん</span>
              <span className="greeting-date">{dateStr} 06:42</span>
            </div>
            <div style={{display:"flex", gap:10, alignItems:"center"}}>
              <button className="btn-icon" title="通知"><Icon name="bell" size={15}/></button>
              <div className="user-chip">
                <div className="user-avatar">福</div>
                <div>
                  <div className="user-chip-name">福田 修一</div>
                  <div className="user-chip-role">店主</div>
                </div>
              </div>
            </div>
          </div>
          <nav className="topnav">
            {tabs.map(t => (
              <button key={t.key} className={`tab ${view === t.key ? "active" : ""}`} onClick={() => setView(t.key)}>
                <Icon name={t.icon} size={15}/>
                {t.label}
                {t.count !== null && t.count > 0 && (
                  <span className={`tab-count ${t.urgent ? "urgent" : ""}`}>{t.count}</span>
                )}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main className="main">
        {view === "summary"   && <SummaryView orders={orders} inquiries={inquiries} tasks={tasks} openOrder={openOrder} openInquiry={openInquiry} setView={setView}/>}
        {view === "orders"    && <OrdersView orders={orders} onAdvance={advanceOrder} onBack={backOrder} openOrder={openOrder}/>}
        {view === "inquiries" && <InquiriesView inquiries={inquiries} onChangeStatus={changeInquiryStatus} openInquiry={openInquiry}/>}
        {view === "tasks"     && <TasksView tasks={tasks} onToggle={toggleTask}/>}
      </main>

      <Drawer
        open={drawer.open}
        onClose={closeDrawer}
        kind={drawer.kind}
        item={drawerItem}
        onAdvance={advanceOrder}
        onBack={backOrder}
        onChangeStatus={changeInquiryStatus}
      />

      {toast && (
        <div className="toast">
          <Icon name="check-circle" size={14}/>
          {toast}
        </div>
      )}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App/>);
