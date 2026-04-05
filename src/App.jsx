import { useState, useEffect, useCallback } from "react";

const style = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Mono:wght@300;400;500&display=swap');
  * { margin: 0; padding: 0; box-sizing: border-box; }
  :root {
    --bg: #080C10; --surface: #0E1419; --surface2: #121920; --border: #1C2530;
    --accent: #00E5A0; --accent2: #0088FF; --gold: #FFB800; --warn: #FF6B35;
    --text: #E8EDF2; --muted: #5A6A7A;
    --font-head: 'Syne', sans-serif; --font-mono: 'DM Mono', monospace;
  }
  body { background:var(--bg); color:var(--text); font-family:var(--font-head); }
  .app { min-height:100vh; background:var(--bg); position:relative; overflow-x:hidden; }
  .app::before { content:''; position:fixed; inset:0; background-image:linear-gradient(rgba(0,229,160,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(0,229,160,0.03) 1px,transparent 1px); background-size:40px 40px; pointer-events:none; z-index:0; }
  .glow-orb { position:fixed; width:600px; height:600px; border-radius:50%; background:radial-gradient(circle,rgba(0,229,160,0.07) 0%,transparent 70%); pointer-events:none; z-index:0; top:-200px; right:-100px; animation:pulse 6s ease-in-out infinite; }
  .glow-orb2 { position:fixed; width:400px; height:400px; border-radius:50%; background:radial-gradient(circle,rgba(0,136,255,0.05) 0%,transparent 70%); pointer-events:none; z-index:0; bottom:100px; left:-100px; animation:pulse 8s ease-in-out infinite reverse; }
  @keyframes pulse { 0%,100%{transform:scale(1);opacity:1} 50%{transform:scale(1.1);opacity:0.7} }
  @keyframes fadeIn { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
  @keyframes spin { to{transform:rotate(360deg)} }
  @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.3} }
  @keyframes loadingAnim { 0%{width:0%;margin-left:0} 50%{width:70%;margin-left:15%} 100%{width:0%;margin-left:100%} }
  @keyframes expandIn { from{opacity:0;transform:scaleY(0.96)} to{opacity:1;transform:scaleY(1)} }
  @keyframes modalIn { from{opacity:0;transform:scale(0.95) translateY(10px)} to{opacity:1;transform:scale(1) translateY(0)} }
  nav { position:relative; z-index:10; display:flex; align-items:center; justify-content:space-between; padding:18px 48px; border-bottom:1px solid var(--border); backdrop-filter:blur(12px); }
  .logo { display:flex; align-items:center; gap:10px; font-size:20px; font-weight:800; letter-spacing:-0.5px; cursor:pointer; }
  .logo-icon { width:32px; height:32px; background:var(--accent); border-radius:8px; display:flex; align-items:center; justify-content:center; font-size:16px; }
  .logo span { color:var(--accent); }
  .nav-right { display:flex; align-items:center; gap:16px; }
  .nav-link { font-family:var(--font-mono); font-size:13px; color:var(--muted); cursor:pointer; transition:color 0.2s; border:none; background:none; }
  .nav-link:hover { color:var(--text); }
  .pro-badge { display:inline-flex; align-items:center; gap:6px; background:linear-gradient(135deg,rgba(255,184,0,0.15),rgba(255,184,0,0.05)); border:1px solid rgba(255,184,0,0.35); color:var(--gold); font-family:var(--font-mono); font-size:11px; padding:4px 12px; border-radius:100px; }
  .btn-outline { background:transparent; border:1px solid var(--border); color:var(--text); padding:8px 18px; border-radius:8px; font-family:var(--font-head); font-weight:600; font-size:13px; cursor:pointer; transition:all 0.2s; }
  .btn-outline:hover { border-color:var(--accent); color:var(--accent); }
  .btn-primary { background:var(--accent); color:#000; border:none; padding:9px 20px; border-radius:8px; font-family:var(--font-head); font-weight:700; font-size:13px; cursor:pointer; transition:opacity 0.2s; }
  .btn-primary:hover { opacity:0.85; }
  .hero { position:relative; z-index:1; padding:70px 48px 50px; max-width:900px; margin:0 auto; text-align:center; }
  .badge { display:inline-flex; align-items:center; gap:8px; background:rgba(0,229,160,0.08); border:1px solid rgba(0,229,160,0.2); color:var(--accent); font-family:var(--font-mono); font-size:12px; padding:6px 14px; border-radius:100px; margin-bottom:24px; }
  .badge-dot { width:6px; height:6px; background:var(--accent); border-radius:50%; animation:blink 1.5s infinite; }
  .hero h1 { font-size:clamp(36px,5vw,62px); font-weight:800; line-height:1.06; letter-spacing:-2px; margin-bottom:16px; animation:fadeIn 0.6s 0.1s both; }
  .hero h1 .hl { color:var(--accent); }
  .hero p { font-family:var(--font-mono); font-size:14px; color:var(--muted); line-height:1.7; max-width:520px; margin:0 auto 36px; }
  .url-form { display:flex; max-width:640px; margin:0 auto 14px; animation:fadeIn 0.6s 0.2s both; }
  .url-input { flex:1; background:var(--surface); border:1px solid var(--border); border-right:none; border-radius:12px 0 0 12px; padding:15px 20px; font-family:var(--font-mono); font-size:14px; color:var(--text); outline:none; transition:border-color 0.2s; }
  .url-input::placeholder { color:var(--muted); }
  .url-input:focus { border-color:var(--accent); }
  .analyse-btn { background:var(--accent); color:#000; border:none; padding:15px 26px; border-radius:0 12px 12px 0; font-family:var(--font-head); font-weight:700; font-size:14px; cursor:pointer; display:flex; align-items:center; gap:8px; transition:background 0.2s; white-space:nowrap; }
  .analyse-btn:hover { background:#00c988; }
  .analyse-btn:disabled { background:#005c40; color:#00E5A0; cursor:wait; }
  .url-hint { font-family:var(--font-mono); font-size:12px; color:var(--muted); }
  .loading-bar { height:2px; background:var(--border); max-width:640px; margin:14px auto 0; border-radius:2px; overflow:hidden; }
  .loading-bar-fill { height:100%; background:linear-gradient(90deg,var(--accent),var(--accent2)); animation:loadingAnim 2s ease-in-out infinite; }
  .error-box { max-width:640px; margin:14px auto 0; background:rgba(255,107,53,0.08); border:1px solid rgba(255,107,53,0.3); border-radius:10px; padding:14px 18px; font-family:var(--font-mono); font-size:13px; color:var(--warn); line-height:1.6; }
  .competitor-section { position:relative; z-index:1; max-width:640px; margin:0 auto 36px; }
  .competitor-section-title { font-family:var(--font-mono); font-size:11px; color:var(--muted); letter-spacing:2px; text-transform:uppercase; margin-bottom:10px; display:flex; align-items:center; gap:8px; }
  .competitor-input-row { display:flex; gap:8px; margin-bottom:10px; }
  .comp-input { flex:1; background:var(--surface); border:1px solid var(--border); border-radius:10px; padding:11px 16px; font-family:var(--font-mono); font-size:13px; color:var(--text); outline:none; transition:border-color 0.2s; }
  .comp-input::placeholder { color:var(--muted); }
  .comp-input:focus { border-color:rgba(0,136,255,0.5); }
  .add-comp-btn { background:var(--surface2); border:1px solid var(--border); color:var(--text); padding:11px 16px; border-radius:10px; font-family:var(--font-head); font-weight:700; font-size:13px; cursor:pointer; white-space:nowrap; transition:all 0.2s; }
  .add-comp-btn:hover { border-color:var(--accent2); color:var(--accent2); }
  .competitor-chips { display:flex; flex-wrap:wrap; gap:8px; }
  .competitor-chip { display:flex; align-items:center; gap:8px; background:var(--surface); border:1px solid var(--border); border-radius:8px; padding:6px 12px; font-family:var(--font-mono); font-size:12px; }
  .chip-remove { background:none; border:none; color:var(--muted); cursor:pointer; font-size:14px; line-height:1; padding:0; transition:color 0.2s; }
  .chip-remove:hover { color:var(--warn); }
  .dashboard { position:relative; z-index:1; max-width:1200px; margin:0 auto; padding:0 48px 80px; }
  .section-label { font-family:var(--font-mono); font-size:11px; color:var(--muted); letter-spacing:2px; text-transform:uppercase; margin-bottom:16px; }
  .summary-box { background:rgba(0,229,160,0.04); border:1px solid rgba(0,229,160,0.15); border-radius:10px; padding:14px 18px; margin-bottom:20px; font-family:var(--font-mono); font-size:13px; color:var(--text); line-height:1.7; }
  .score-row { display:grid; grid-template-columns:repeat(4,1fr); gap:14px; margin-bottom:20px; }
  .score-card { background:var(--surface); border:1px solid var(--border); border-radius:12px; padding:18px; position:relative; overflow:hidden; transition:border-color 0.2s; animation:fadeIn 0.5s ease both; }
  .score-card:hover { border-color:rgba(0,229,160,0.25); }
  .score-card-label { font-family:var(--font-mono); font-size:10px; color:var(--muted); letter-spacing:1px; text-transform:uppercase; margin-bottom:10px; }
  .score-value { font-size:34px; font-weight:800; letter-spacing:-1px; line-height:1; margin-bottom:4px; }
  .score-value.green{color:var(--accent)} .score-value.blue{color:var(--accent2)} .score-value.orange{color:var(--warn)} .score-value.yellow{color:#FFD700}
  .score-bar-bg { position:absolute; bottom:0; left:0; right:0; height:3px; background:var(--border); }
  .score-bar-fill { height:100%; border-radius:0 2px 2px 0; transition:width 1s ease; }
  .main-grid { display:grid; grid-template-columns:1fr 1fr; gap:14px; margin-bottom:20px; }
  .panel { background:var(--surface); border:1px solid var(--border); border-radius:12px; padding:22px; animation:fadeIn 0.6s ease both; }
  .panel-title { font-size:14px; font-weight:700; margin-bottom:3px; }
  .panel-sub { font-family:var(--font-mono); font-size:11px; color:var(--muted); margin-bottom:18px; }
  .full-width { grid-column:1/-1; }
  .content-item { display:flex; align-items:center; gap:10px; padding:10px 0; border-bottom:1px solid var(--border); }
  .content-item:last-child{border-bottom:none}
  .content-rank { font-family:var(--font-mono); font-size:11px; color:var(--muted); width:18px; flex-shrink:0; }
  .content-info { flex:1; overflow:hidden; }
  .content-title { font-size:13px; font-weight:600; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; margin-bottom:2px; }
  .content-url { font-family:var(--font-mono); font-size:10px; color:var(--muted); }
  .content-score { font-family:var(--font-mono); font-size:13px; font-weight:500; flex-shrink:0; }
  .pill { display:inline-flex; font-family:var(--font-mono); font-size:10px; padding:2px 8px; border-radius:100px; flex-shrink:0; }
  .pill.good{background:rgba(0,229,160,0.1);color:var(--accent)} .pill.bad{background:rgba(255,107,53,0.1);color:var(--warn)} .pill.mid{background:rgba(255,215,0,0.1);color:#FFD700}
  .llm-row { display:flex; align-items:center; gap:10px; margin-bottom:13px; }
  .llm-name { font-family:var(--font-mono); font-size:12px; width:76px; flex-shrink:0; }
  .llm-bar-bg { flex:1; height:7px; background:var(--border); border-radius:4px; overflow:hidden; }
  .llm-bar-fill { height:100%; border-radius:4px; transition:width 1.2s ease; }
  .llm-score { font-family:var(--font-mono); font-size:12px; font-weight:500; width:32px; text-align:right; flex-shrink:0; }
  .tabs { display:flex; gap:4px; background:var(--bg); border:1px solid var(--border); border-radius:10px; padding:4px; margin-bottom:18px; width:fit-content; }
  .tab { padding:7px 14px; border-radius:7px; font-family:var(--font-mono); font-size:12px; cursor:pointer; color:var(--muted); border:none; background:transparent; transition:all 0.2s; }
  .tab.active { background:var(--surface); color:var(--text); border:1px solid var(--border); }
  .lb-header { display:grid; grid-template-columns:32px 1fr 80px 80px 80px 80px 100px 90px; gap:12px; align-items:center; padding:8px 16px; font-family:var(--font-mono); font-size:10px; color:var(--muted); letter-spacing:1px; text-transform:uppercase; }
  .lb-row { display:grid; grid-template-columns:32px 1fr 80px 80px 80px 80px 100px 90px; gap:12px; align-items:center; padding:14px 16px; background:var(--surface); border:1px solid var(--border); border-radius:10px; transition:all 0.2s; animation:fadeIn 0.4s ease both; cursor:pointer; }
  .lb-row:hover { border-color:rgba(255,255,255,0.15); background:var(--surface2); }
  .lb-row.you { border-color:rgba(0,229,160,0.35); background:rgba(0,229,160,0.03); }
  .lb-row.selected { border-color:var(--accent2); background:rgba(0,136,255,0.05); }
  .lb-rank { font-family:var(--font-mono); font-size:13px; font-weight:700; color:var(--muted); text-align:center; }
  .lb-rank.top{color:#FFD700}
  .lb-domain{font-size:13px;font-weight:700}
  .lb-domain-sub{font-family:var(--font-mono);font-size:10px;color:var(--muted);margin-top:2px}
  .you-badge{display:inline-flex;font-family:var(--font-mono);font-size:10px;color:var(--accent);background:rgba(0,229,160,0.1);padding:2px 8px;border-radius:100px;margin-left:8px;vertical-align:middle}
  .lb-score{font-family:var(--font-mono);font-size:14px;font-weight:700;text-align:center}
  .lb-bar-cell{display:flex;align-items:center}
  .lb-mini-bar{flex:1;height:5px;background:var(--border);border-radius:3px;overflow:hidden}
  .lb-mini-fill{height:100%;border-radius:3px;transition:width 1s ease}
  .status-badge{display:inline-flex;align-items:center;gap:5px;font-family:var(--font-mono);font-size:10px;padding:3px 10px;border-radius:100px}
  .status-badge.done{background:rgba(0,229,160,0.08);color:var(--accent);border:1px solid rgba(0,229,160,0.2)}
  .status-badge.scanning{background:rgba(0,136,255,0.08);color:var(--accent2);border:1px solid rgba(0,136,255,0.2)}
  .status-badge.error{background:rgba(255,107,53,0.08);color:var(--warn);border:1px solid rgba(255,107,53,0.2)}
  .insight-bar{display:flex;align-items:center;gap:12px;background:rgba(0,136,255,0.05);border:1px solid rgba(0,136,255,0.15);border-radius:10px;padding:12px 18px;margin-bottom:18px;font-family:var(--font-mono);font-size:13px;line-height:1.6}
  .competitor-detail { border:1px solid var(--accent2); border-radius:12px; background:linear-gradient(135deg,rgba(0,136,255,0.04) 0%,rgba(0,0,0,0) 100%); padding:22px; margin-top:10px; animation:expandIn 0.25s ease both; transform-origin:top; }
  .competitor-detail.is-you { border-color:var(--accent); background:linear-gradient(135deg,rgba(0,229,160,0.04) 0%,rgba(0,0,0,0) 100%); }
  .detail-header { display:flex; align-items:center; justify-content:space-between; margin-bottom:18px; }
  .detail-domain { font-size:15px; font-weight:800; letter-spacing:-0.5px; }
  .detail-close { background:none; border:1px solid var(--border); color:var(--muted); width:28px; height:28px; border-radius:7px; cursor:pointer; font-size:14px; display:flex; align-items:center; justify-content:center; transition:all 0.2s; }
  .detail-close:hover { border-color:var(--warn); color:var(--warn); }
  .detail-grid { display:grid; grid-template-columns:1fr 1fr; gap:18px; }
  .detail-section-title { font-family:var(--font-mono); font-size:10px; color:var(--muted); letter-spacing:1.5px; text-transform:uppercase; margin-bottom:10px; }
  .history-panel { background:var(--surface); border:1px solid var(--border); border-radius:12px; padding:22px; margin-bottom:20px; animation:fadeIn 0.5s ease both; }
  .history-header { display:flex; align-items:flex-start; justify-content:space-between; margin-bottom:18px; }
  .history-meta { display:flex; gap:22px; }
  .history-stat-val { font-size:21px; font-weight:800; letter-spacing:-0.5px; }
  .history-stat-label { font-family:var(--font-mono); font-size:10px; color:var(--muted); margin-top:2px; }
  .history-entries { display:flex; gap:6px; margin-top:14px; font-family:var(--font-mono); font-size:10px; color:var(--muted); overflow-x:auto; padding-bottom:4px; }
  .history-entry { flex-shrink:0; background:var(--surface2); border:1px solid var(--border); border-radius:8px; padding:7px 11px; text-align:center; }
  .history-entry-score { font-size:15px; font-weight:800; color:var(--accent); margin-bottom:2px; }
  .clear-history-btn { background:none; border:1px solid var(--border); color:var(--muted); padding:5px 11px; border-radius:7px; font-family:var(--font-mono); font-size:11px; cursor:pointer; transition:all 0.2s; }
  .clear-history-btn:hover { border-color:var(--warn); color:var(--warn); }
  .spinner { width:15px; height:15px; border:2px solid rgba(0,229,160,0.3); border-top-color:var(--accent); border-radius:50%; animation:spin 0.8s linear infinite; }
  .spinner-sm { width:11px; height:11px; border:1.5px solid rgba(255,255,255,0.15); border-top-color:var(--muted); border-radius:50%; animation:spin 0.8s linear infinite; }
  .empty-state{text-align:center;padding:50px 20px;color:var(--muted)}
  .empty-icon{font-size:36px;margin-bottom:14px}
  .empty-title{font-size:17px;font-weight:700;color:var(--text);margin-bottom:8px}
  .empty-sub{font-family:var(--font-mono);font-size:13px;line-height:1.6}
  .paywall-wrapper { position:relative; border-radius:12px; overflow:hidden; }
  .paywall-blur { filter:blur(5px); pointer-events:none; user-select:none; opacity:0.5; }
  .paywall-overlay { position:absolute; inset:0; background:linear-gradient(to bottom,rgba(8,12,16,0) 0%,rgba(8,12,16,0.7) 30%,rgba(8,12,16,0.97) 60%); display:flex; flex-direction:column; align-items:center; justify-content:flex-end; padding:36px 24px 32px; text-align:center; }
  .paywall-icon { font-size:28px; margin-bottom:12px; }
  .paywall-title { font-size:18px; font-weight:800; letter-spacing:-0.5px; margin-bottom:8px; }
  .paywall-sub { font-family:var(--font-mono); font-size:12px; color:var(--muted); line-height:1.6; max-width:360px; margin-bottom:20px; }
  .paywall-btn { background:linear-gradient(135deg,var(--gold),#FF8C00); color:#000; border:none; padding:12px 28px; border-radius:10px; font-family:var(--font-head); font-weight:800; font-size:14px; cursor:pointer; transition:transform 0.15s,opacity 0.2s; display:flex; align-items:center; gap:8px; }
  .paywall-btn:hover { transform:scale(1.03); }
  .paywall-free-features { display:flex; gap:16px; margin-top:14px; font-family:var(--font-mono); font-size:11px; color:var(--muted); }
  .modal-backdrop { position:fixed; inset:0; background:rgba(0,0,0,0.75); backdrop-filter:blur(4px); z-index:100; display:flex; align-items:center; justify-content:center; padding:24px; animation:fadeIn 0.15s ease; }
  .modal { background:var(--surface); border:1px solid var(--border); border-radius:16px; padding:36px; width:100%; max-width:440px; position:relative; animation:modalIn 0.2s ease both; }
  .modal-close { position:absolute; top:16px; right:16px; background:none; border:1px solid var(--border); color:var(--muted); width:30px; height:30px; border-radius:8px; cursor:pointer; font-size:14px; display:flex; align-items:center; justify-content:center; transition:all 0.2s; }
  .modal-close:hover { border-color:var(--warn); color:var(--warn); }
  .modal-title { font-size:22px; font-weight:800; letter-spacing:-0.5px; margin-bottom:6px; }
  .modal-sub { font-family:var(--font-mono); font-size:13px; color:var(--muted); margin-bottom:28px; line-height:1.5; }
  .auth-input { width:100%; background:var(--surface2); border:1px solid var(--border); border-radius:10px; padding:13px 16px; font-family:var(--font-mono); font-size:14px; color:var(--text); outline:none; margin-bottom:12px; transition:border-color 0.2s; display:block; }
  .auth-input::placeholder { color:var(--muted); }
  .auth-input:focus { border-color:var(--accent); }
  .auth-submit { width:100%; background:var(--accent); color:#000; border:none; padding:13px; border-radius:10px; font-family:var(--font-head); font-weight:700; font-size:15px; cursor:pointer; margin-top:4px; transition:opacity 0.2s; }
  .auth-submit:hover { opacity:0.85; }
  .auth-switch { text-align:center; margin-top:16px; font-family:var(--font-mono); font-size:12px; color:var(--muted); }
  .auth-switch span { color:var(--accent); cursor:pointer; }
  .upgrade-modal { max-width:520px; }
  .pricing-grid { display:grid; grid-template-columns:1fr 1fr; gap:14px; margin-bottom:20px; }
  .pricing-card { background:var(--surface2); border:1px solid var(--border); border-radius:12px; padding:20px; position:relative; }
  .pricing-card.pro { border-color:rgba(255,184,0,0.4); background:linear-gradient(135deg,rgba(255,184,0,0.06),rgba(255,140,0,0.03)); }
  .pricing-tier { font-family:var(--font-mono); font-size:11px; letter-spacing:2px; text-transform:uppercase; color:var(--muted); margin-bottom:8px; }
  .pricing-tier.pro-label { color:var(--gold); }
  .pricing-price { font-size:28px; font-weight:800; letter-spacing:-1px; margin-bottom:4px; }
  .pricing-price-sub { font-family:var(--font-mono); font-size:11px; color:var(--muted); margin-bottom:16px; }
  .pricing-features { list-style:none; }
  .pricing-features li { font-family:var(--font-mono); font-size:12px; color:var(--muted); padding:5px 0; border-bottom:1px solid var(--border); display:flex; align-items:center; gap:8px; }
  .pricing-features li:last-child { border-bottom:none; }
  .pricing-features li.yes { color:var(--text); }
  .pricing-features li .check { color:var(--accent); flex-shrink:0; }
  .pricing-features li .cross { color:var(--border); flex-shrink:0; }
  .pricing-features li .gold-check { color:var(--gold); flex-shrink:0; }
  .stripe-btn { width:100%; background:linear-gradient(135deg,var(--gold),#FF8C00); color:#000; border:none; padding:14px; border-radius:10px; font-family:var(--font-head); font-weight:800; font-size:15px; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:8px; }
`;

async function callClaude(url) {
  const clean = url.startsWith("http") ? url : `https://${url}`;
  const res = await fetch("/api/analyse", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url: clean })
  });
  if (!res.ok) throw new Error(`API error ${res.status}`);
  const d = await res.json();
  if (!d || typeof d !== "object") throw new Error("Empty response");
  return d;
}

const HISTORY_KEY = "llmrank_history";
const USER_KEY = "llmrank_user";

function loadHistory(domain) {
  try { const all = JSON.parse(localStorage.getItem(HISTORY_KEY)||"{}"); return all[domain]||[]; }
  catch { return []; }
}
function saveHistory(domain, score) {
  try {
    const all = JSON.parse(localStorage.getItem(HISTORY_KEY)||"{}");
    const existing = all[domain]||[];
    all[domain] = [...existing, { score, date: new Date().toLocaleDateString("en-GB",{day:"numeric",month:"short"}), timestamp:Date.now() }].slice(-10);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(all));
    return all[domain];
  } catch { return []; }
}
function clearHistory(domain) {
  try { const all = JSON.parse(localStorage.getItem(HISTORY_KEY)||"{}"); delete all[domain]; localStorage.setItem(HISTORY_KEY,JSON.stringify(all)); } catch {}
}

function ScoreCard({ label, value, color="green", delay=0 }) {
  const [n,setN]=useState(0);
  useEffect(()=>{
    const t=setTimeout(()=>{let i=0;const tick=()=>{i+=2;setN(Math.min(i,value));if(i<value)requestAnimationFrame(tick);};requestAnimationFrame(tick);},delay);
    return ()=>clearTimeout(t);
  },[value,delay]);
  const colors={green:"var(--accent)",blue:"var(--accent2)",orange:"var(--warn)",yellow:"#FFD700"};
  return (
    <div className="score-card" style={{animationDelay:`${delay}ms`}}>
      <div className="score-card-label">{label}</div>
      <div className={`score-value ${color}`}>{n}</div>
      <div className="score-bar-bg"><div className="score-bar-fill" style={{width:`${n}%`,background:colors[color]}}/></div>
    </div>
  );
}

const LLM_COLORS={claude:"#CC8B3C",chatgpt:"#10A37F",gemini:"#4285F4",perplexity:"#6B46C1"};

function LLMBreakdown({scores}) {
  return <div>{Object.entries(scores).map(([llm,s])=>(
    <div key={llm} className="llm-row">
      <div className="llm-name" style={{color:LLM_COLORS[llm]}}>{llm[0].toUpperCase()+llm.slice(1)}</div>
      <div className="llm-bar-bg"><div className="llm-bar-fill" style={{width:`${s}%`,background:LLM_COLORS[llm]}}/></div>
      <div className="llm-score">{s}</div>
    </div>
  ))}</div>;
}

function ContentList({items,compact}) {
  return <div>{items.map((item,i)=>(
    <div key={i} className="content-item">
      <div className="content-rank">#{i+1}</div>
      <div className="content-info">
        <div className="content-title">{item.title}</div>
        {!compact&&<div className="content-url">{item.url}</div>}
      </div>
      <div className={`pill ${item.status}`}>{item.status==="good"?"Strong":item.status==="mid"?"Mid":"Weak"}</div>
      <div className="content-score" style={{color:item.status==="good"?"var(--accent)":item.status==="bad"?"var(--warn)":"#FFD700"}}>{item.score}</div>
    </div>
  ))}</div>;
}

function LockedRecommendations({ items, onUpgrade }) {
  const icons = { add:"✦", improve:"↑", remove:"✕" };
  return (
    <div className="paywall-wrapper">
      <div className="paywall-blur">
        {items.map((rec, i) => (
          <div key={i} style={{ display:"flex", gap:12, padding:"12px 0", borderBottom:"1px solid var(--border)" }}>
            <div style={{ width:30, height:30, borderRadius:8, display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, flexShrink:0, background: rec.type==="add"?"rgba(0,229,160,0.1)":rec.type==="remove"?"rgba(255,107,53,0.1)":"rgba(0,136,255,0.1)" }}>
              {icons[rec.type]||"→"}
            </div>
            <div style={{flex:1}}>
              <div style={{fontSize:13,fontWeight:600,marginBottom:3}}>{rec.title}</div>
              <div style={{fontFamily:"var(--font-mono)",fontSize:11,color:"var(--muted)",lineHeight:1.5}}>{rec.desc}</div>
            </div>
            <div style={{fontFamily:"var(--font-mono)",fontSize:11,color:"var(--accent)",flexShrink:0}}>{rec.impact}</div>
          </div>
        ))}
      </div>
      <div className="paywall-overlay">
        <div className="paywall-icon">🔒</div>
        <div className="paywall-title">Strategic Recommendations</div>
        <div className="paywall-sub">Upgrade to Pro to unlock Claude's full AI optimisation playbook.</div>
        <button className="paywall-btn" onClick={onUpgrade}>⭐ Get Pro Access — $29/mo</button>
        <div className="paywall-free-features">
          <span>✓ Cancel anytime</span>
          <span>✓ Instant access</span>
          <span>✓ All future features</span>
        </div>
      </div>
    </div>
  );
}

function UnlockedRecommendations({ items }) {
  const icons = { add:"✦", improve:"↑", remove:"✕" };
  return (
    <div>
      {items.map((rec,i)=>(
        <div key={i} style={{display:"flex",gap:12,padding:"12px 0",borderBottom:"1px solid var(--border)"}}>
          <div style={{width:30,height:30,borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,flexShrink:0,background:rec.type==="add"?"rgba(0,229,160,0.1)":rec.type==="remove"?"rgba(255,107,53,0.1)":"rgba(0,136,255,0.1)"}}>
            {icons[rec.type]||"→"}
          </div>
          <div style={{flex:1}}>
            <div style={{fontSize:13,fontWeight:600,marginBottom:3}}>{rec.title}</div>
            <div style={{fontFamily:"var(--font-mono)",fontSize:11,color:"var(--muted)",lineHeight:1.5}}>{rec.desc}</div>
          </div>
          <div style={{fontFamily:"var(--font-mono)",fontSize:11,color:"var(--accent)",flexShrink:0}}>{rec.impact}</div>
        </div>
      ))}
    </div>
  );
}

function AuthModal({ onClose, onSuccess }) {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!email || !password) { setError("Please fill in all fields."); return; }
    setLoading(true); setError("");
    await new Promise(r => setTimeout(r, 1000));
    const fakeUser = { email, name: email.split("@")[0], isPro: false };
    localStorage.setItem(USER_KEY, JSON.stringify(fakeUser));
    setLoading(false);
    onSuccess(fakeUser);
  };

  return (
    <div className="modal-backdrop" onClick={e => e.target===e.currentTarget && onClose()}>
      <div className="modal">
        <button className="modal-close" onClick={onClose}>✕</button>
        <div className="modal-title">{mode==="login" ? "Welcome back" : "Create account"}</div>
        <div className="modal-sub">{mode==="login" ? "Log in to access your scan history and Pro features." : "Free to start. Upgrade for strategic recommendations."}</div>
        {error && <div style={{background:"rgba(255,107,53,0.08)",border:"1px solid rgba(255,107,53,0.3)",borderRadius:8,padding:"10px 14px",fontFamily:"var(--font-mono)",fontSize:12,color:"var(--warn)",marginBottom:14}}>{error}</div>}
        <input className="auth-input" type="email" placeholder="Email address" value={email} onChange={e=>setEmail(e.target.value)} />
        <input className="auth-input" type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleSubmit()} />
        <button className="auth-submit" onClick={handleSubmit} disabled={loading}>{loading ? "..." : mode==="login" ? "Log in" : "Create account"}</button>
        <div className="auth-switch">
          {mode==="login" ? <>No account? <span onClick={()=>setMode("signup")}>Sign up free</span></> : <>Already have one? <span onClick={()=>setMode("login")}>Log in</span></>}
        </div>
      </div>
    </div>
  );
}

function UpgradeModal({ onClose }) {
  return (
    <div className="modal-backdrop" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="modal upgrade-modal">
        <button className="modal-close" onClick={onClose}>✕</button>
        <div className="modal-title">Upgrade to <span style={{color:"var(--gold)"}}>Pro</span></div>
        <div className="modal-sub">Unlock strategic recommendations and outrank your competitors on every AI platform.</div>
        <div style={{background:"linear-gradient(135deg,rgba(255,184,0,0.08),rgba(255,140,0,0.04))",border:"1px solid rgba(255,184,0,0.3)",borderRadius:12,padding:"20px 24px",textAlign:"center"}}>
          <div style={{fontSize:22,marginBottom:10}}>✉️</div>
          <div style={{fontWeight:800,fontSize:15,marginBottom:6}}>Get in touch to upgrade</div>
          <div style={{fontFamily:"var(--font-mono)",fontSize:12,color:"var(--muted)",marginBottom:16,lineHeight:1.6}}>Email us and we'll get you set up with Pro access.</div>
          <a href="mailto:4947marketing@gmail.com?subject=LLMrank%20Pro%20Access&body=Hi%2C%20I'd%20like%20to%20upgrade%20to%20LLMrank%20Pro%20(%2429%2Fmo)." style={{display:"inline-flex",alignItems:"center",gap:8,background:"linear-gradient(135deg,var(--gold),#FF8C00)",color:"#000",padding:"13px 28px",borderRadius:10,fontFamily:"var(--font-head)",fontWeight:800,fontSize:14,textDecoration:"none"}}>
            ⭐ Email to Upgrade — $29/mo
          </a>
          <div style={{fontFamily:"var(--font-mono)",fontSize:11,color:"var(--muted)",marginTop:12}}>4947marketing@gmail.com · Fast response · Cancel anytime</div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [url, setUrl] = useState("");
  const [status, setStatus] = useState("idle");
  const [loadingStep, setLoadingStep] = useState(0);
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [tab, setTab] = useState("top");
  const [competitorInput, setCompetitorInput] = useState("");
  const [competitors, setCompetitors] = useState([]);
  const [history, setHistory] = useState([]);
  const [user, setUser] = useState(() => { try { return JSON.parse(localStorage.getItem(USER_KEY)); } catch { return null; } });
  const [modal, setModal] = useState(null);

  const isPro = user?.isPro === true;

  useEffect(()=>{
    if(url.trim()){const domain=url.replace(/^https?:\/\//,"").replace(/\/$/,"");setHistory(loadHistory(domain));}
  },[url]);

  const addCompetitor=()=>{const t=competitorInput.trim();if(!t||competitors.length>=4||competitors.some(c=>c.url===t))return;setCompetitors(prev=>[...prev,{url:t,status:"idle",data:null,error:null}]);setCompetitorInput("");};
  const removeCompetitor=u=>setCompetitors(prev=>prev.filter(c=>c.url!==u));
  const updateCompetitor=useCallback((u,changes)=>setCompetitors(prev=>prev.map(c=>c.url===u?{...c,...changes}:c)),[]);

  const handleAnalyse=async()=>{
    if(!url.trim())return;
    setStatus("loading");setError("");setData(null);setLoadingStep(0);
    try{
      await new Promise(r=>setTimeout(r,600));setLoadingStep(1);
      const analysis=await callClaude(url);
      setLoadingStep(2);await new Promise(r=>setTimeout(r,400));
      setData(analysis);setStatus("results");
      const domain=url.replace(/^https?:\/\//,"").replace(/\/$/,"");
      setHistory(saveHistory(domain,analysis.overallScore));
      if(competitors.length>0){
        setCompetitors(prev=>prev.map(c=>({...c,status:"scanning"})));
        await Promise.allSettled(competitors.map(async comp=>{
          try{const d=await callClaude(comp.url);updateCompetitor(comp.url,{status:"done",data:d});}
          catch(err){updateCompetitor(comp.url,{status:"error",error:err.message});}
        }));
      }
    }catch(err){setStatus("error");setError(err.message||"Something went wrong.");}
  };

  const isScanning=competitors.some(c=>c.status==="scanning");
  const steps=["Validating URL...","Claude is analysing your site...","Building your report..."];

  return (
    <div className="app">
      <style>{style}</style>
      <div className="glow-orb"/><div className="glow-orb2"/>
      {modal==="auth" && <AuthModal onClose={()=>setModal(null)} onSuccess={u=>{setUser(u);setModal(null);}}/>}
      {modal==="upgrade" && <UpgradeModal onClose={()=>setModal(null)}/>}
      <nav>
        <div className="logo" onClick={()=>{setStatus("idle");setData(null);setUrl("");}}><div className="logo-icon">⬡</div>LLM<span>rank</span></div>
        <div className="nav-right">
          {user ? (
            <>
              {isPro ? <div className="pro-badge"><span>⭐</span> Pro</div> : <button className="paywall-btn" style={{fontSize:12,padding:"7px 16px"}} onClick={()=>setModal("upgrade")}>⭐ Upgrade</button>}
              <span style={{fontFamily:"var(--font-mono)",fontSize:12,color:"var(--muted)"}}>{user.name}</span>
              <button className="nav-link" onClick={()=>{localStorage.removeItem(USER_KEY);setUser(null);}}>Log out</button>
            </>
          ) : (
            <>
              <button className="btn-outline" onClick={()=>setModal("auth")}>Log in</button>
              <button className="btn-primary" onClick={()=>setModal("auth")}>Sign up free</button>
            </>
          )}
        </div>
      </nav>
      <div className="hero">
        <div className="badge"><div className="badge-dot"/>LLM Visibility Platform · Free to start</div>
        <h1>How does your site<br/>perform <span className="hl">across AI</span>?</h1>
        <p>Score your LLM visibility, track competitors, and get strategic recommendations to climb AI rankings.</p>
        <div className="url-form">
          <input className="url-input" placeholder="https://yourwebsite.com" value={url} onChange={e=>setUrl(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleAnalyse()} disabled={status==="loading"}/>
          <button className="analyse-btn" onClick={handleAnalyse} disabled={status==="loading"}>
            {status==="loading"?<><div className="spinner"/>Analysing...</>:"Analyse →"}
          </button>
        </div>
        {status==="loading"&&<div className="loading-bar"><div className="loading-bar-fill"/></div>}
        {status==="error"&&<div className="error-box">⚠ {error}</div>}
        {status==="idle"&&<div className="url-hint">Free scan · Powered by Claude · ~10 seconds</div>}
      </div>
      {(status==="idle"||status==="results")&&url.trim()&&(
        <div className="competitor-section">
          <div className="competitor-section-title"><span>⊕</span>Add competitors<span style={{color:"var(--border)"}}>— up to 4</span></div>
          {competitors.length<4&&<div className="competitor-input-row"><input className="comp-input" placeholder="https://competitor.com" value={competitorInput} onChange={e=>setCompetitorInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addCompetitor()}/><button className="add-comp-btn" onClick={addCompetitor}>+ Add</button></div>}
          {competitors.length>0&&<div className="competitor-chips">{competitors.map(c=><div key={c.url} className="competitor-chip">{c.status==="scanning"&&<div className="spinner-sm"/>}<span>{c.url.replace(/^https?:\/\//,"")}</span><button className="chip-remove" onClick={()=>removeCompetitor(c.url)}>×</button></div>)}</div>}
        </div>
      )}
      {status==="results"&&data&&(
        <div className="dashboard">
          {data.summary&&<div className="summary-box"><strong style={{color:"var(--accent)",marginRight:8}}>Claude's verdict:</strong>{data.summary}</div>}
          <div className="section-label">// Your LLM Performance</div>
          <div className="score-row">
            <ScoreCard label="Overall Score" value={data.overallScore} color="green" delay={0}/>
            <ScoreCard label="Claude" value={data.scores?.claude||0} color="yellow" delay={100}/>
            <ScoreCard label="ChatGPT" value={data.scores?.chatgpt||0} color="green" delay={200}/>
            <ScoreCard label="Gemini" value={data.scores?.gemini||0} color="blue" delay={300}/>
          </div>
          {competitors.length>0&&(
  <>
    <div className="section-label" style={{marginTop:8}}>// Competitor Leaderboard</div>
    <div className="panel full-width" style={{marginBottom:18}}>
      <div className="panel-title">Head-to-Head Comparison</div>
      <div className="panel-sub">How you stack up against competitors</div>
      <div className="lb-header"><div>#</div><div>Domain</div><div style={{textAlign:"center"}}>Score</div><div style={{textAlign:"center"}}>Claude</div><div style={{textAlign:"center"}}>ChatGPT</div><div style={{textAlign:"center"}}>Gemini</div></div>
      <div style={{display:"flex",flexDirection:"column",gap:8,marginTop:8}}>
        {[{url,isYou:true,score:data.overallScore,scores:data.scores},...competitors.map(c=>({url:c.url,isYou:false,score:c.data?.overallScore??null,scores:c.data?.scores??null,status:c.status}))].sort((a,b)=>(b.score??-1)-(a.score??-1)).map((entry,i)=>(
          <div key={entry.url} className={`lb-row ${entry.isYou?"you":""}`}>
            <div className={`lb-rank ${i===0?"top":""}`}>{i+1}</div>
            <div><div className="lb-domain">{entry.url.replace(/^https?:\/\//,"").replace(/\/$/,"")}{entry.isYou&&<span className="you-badge">YOU</span>}</div></div>
            <div className="lb-score" style={{color:entry.isYou?"var(--accent)":"var(--text)"}}>{entry.score??"-"}</div>
            <div className="lb-score" style={{color:"#CC8B3C",fontSize:12}}>{entry.scores?.claude??"—"}</div>
            <div className="lb-score" style={{color:"#10A37F",fontSize:12}}>{entry.scores?.chatgpt??"—"}</div>
            <div className="lb-score" style={{color:"#4285F4",fontSize:12}}>{entry.scores?.gemini??"—"}</div>
          </div>
        ))}
      </div>
    </div>
  </>
)}
          <div className="main-grid">
            <div className="panel">
              <div className="panel-title">Your Content Performance</div>
              <div className="panel-sub">How your pages rank for LLM visibility</div>
              <div className="tabs">
                <button className={`tab ${tab==="top"?"active":""}`} onClick={()=>setTab("top")}>Top performing</button>
                <button className={`tab ${tab==="worst"?"active":""}`} onClick={()=>setTab("worst")}>Needs work</button>
              </div>
              <ContentList items={tab==="top"?[...(data.topContent||[])].sort((a,b)=>b.score-a.score).slice(0,5):[...(data.topContent||[])].sort((a,b)=>a.score-b.score).slice(0,5)}/>
            </div>
            <div className="panel">
              <div className="panel-title">Platform Breakdown</div>
              <div className="panel-sub">Your score across each AI platform</div>
              {data.scores&&<LLMBreakdown scores={data.scores}/>}
              {data.strengths&&<div style={{marginTop:18}}><div className="panel-sub" style={{marginBottom:8}}>Strengths</div>{data.strengths.map((s,i)=><div key={i} style={{fontFamily:"var(--font-mono)",fontSize:12,color:"var(--accent)",marginBottom:5}}>✓ {s}</div>)}</div>}
              {data.weaknesses&&<div style={{marginTop:14}}><div className="panel-sub" style={{marginBottom:8}}>Weaknesses</div>{data.weaknesses.map((w,i)=><div key={i} style={{fontFamily:"var(--font-mono)",fontSize:12,color:"var(--warn)",marginBottom:5}}>✕ {w}</div>)}</div>}
            </div>
            <div className="panel full-width">
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:3}}>
                <div className="panel-title">Strategic Recommendations</div>
                {!isPro&&<div style={{fontFamily:"var(--font-mono)",fontSize:11,color:"var(--muted)"}}>🔒 Pro only</div>}
              </div>
              <div className="panel-sub">{isPro?"Claude's full AI optimisation playbook":"Upgrade to see exactly what to change and why"}</div>
              {isPro ? <UnlockedRecommendations items={data.recommendations||[]}/> : <LockedRecommendations items={data.recommendations||[]} onUpgrade={()=>user?setModal("upgrade"):setModal("auth")}/>}
            </div>
          </div>
        </div>
      )}
      {status==="idle"&&!url.trim()&&(
        <div style={{maxWidth:1200,margin:"0 auto",padding:"0 48px 80px",position:"relative",zIndex:1}}>
          <div className="panel" style={{textAlign:"center",border:"1px dashed var(--border)"}}>
            <div className="empty-state">
              <div className="empty-icon">⬡</div>
              <div className="empty-title">Paste your URL to start</div>
              <div className="empty-sub">Free analysis · Add competitors · Upgrade for strategic recommendations</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
