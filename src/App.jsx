// ============================================================
// 🚀 LLMrank — Deploy-Ready App
// ============================================================
// SETUP: Replace the API key below with your real Anthropic key
// Get your key at: https://console.anthropic.com → API Keys
// ============================================================

import { useState, useEffect, useCallback } from "react";


// ============================================================
// 🎨 STYLES
// ============================================================
const style = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Mono:wght@300;400;500&display=swap');

  * { margin: 0; padding: 0; box-sizing: border-box; }

  :root {
    --bg: #080C10;
    --surface: #0E1419;
    --surface2: #121920;
    --border: #1C2530;
    --accent: #00E5A0;
    --accent2: #0088FF;
    --gold: #FFB800;
    --warn: #FF6B35;
    --text: #E8EDF2;
    --muted: #5A6A7A;
    --font-head: 'Syne', sans-serif;
    --font-mono: 'DM Mono', monospace;
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
  @keyframes shimmer { 0%{background-position:-400px 0} 100%{background-position:400px 0} }

  /* ── NAV ── */
  nav { position:relative; z-index:10; display:flex; align-items:center; justify-content:space-between; padding:18px 48px; border-bottom:1px solid var(--border); backdrop-filter:blur(12px); }
  .logo { display:flex; align-items:center; gap:10px; font-size:20px; font-weight:800; letter-spacing:-0.5px; cursor:pointer; }
  .logo-icon { width:32px; height:32px; background:var(--accent); border-radius:8px; display:flex; align-items:center; justify-content:center; font-size:16px; }
  .logo span { color:var(--accent); }
  .nav-right { display:flex; align-items:center; gap:16px; }
  .nav-link { font-family:var(--font-mono); font-size:13px; color:var(--muted); cursor:pointer; transition:color 0.2s; border:none; background:none; }
  .nav-link:hover { color:var(--text); }

  /* Pro badge in nav */
  .pro-badge { display:inline-flex; align-items:center; gap:6px; background:linear-gradient(135deg,rgba(255,184,0,0.15),rgba(255,184,0,0.05)); border:1px solid rgba(255,184,0,0.35); color:var(--gold); font-family:var(--font-mono); font-size:11px; padding:4px 12px; border-radius:100px; }
  .pro-star { font-size:10px; }

  .btn-outline { background:transparent; border:1px solid var(--border); color:var(--text); padding:8px 18px; border-radius:8px; font-family:var(--font-head); font-weight:600; font-size:13px; cursor:pointer; transition:all 0.2s; }
  .btn-outline:hover { border-color:var(--accent); color:var(--accent); }
  .btn-primary { background:var(--accent); color:#000; border:none; padding:9px 20px; border-radius:8px; font-family:var(--font-head); font-weight:700; font-size:13px; cursor:pointer; transition:opacity 0.2s; }
  .btn-primary:hover { opacity:0.85; }

  /* ── HERO ── */
  .hero { position:relative; z-index:1; padding:70px 48px 50px; max-width:900px; margin:0 auto; text-align:center; }
  .badge { display:inline-flex; align-items:center; gap:8px; background:rgba(0,229,160,0.08); border:1px solid rgba(0,229,160,0.2); color:var(--accent); font-family:var(--font-mono); font-size:12px; padding:6px 14px; border-radius:100px; margin-bottom:24px; }
  .badge-dot { width:6px; height:6px; background:var(--accent); border-radius:50%; animation:blink 1.5s infinite; }
  .hero h1 { font-size:clamp(36px,5vw,62px); font-weight:800; line-height:1.06; letter-spacing:-2px; margin-bottom:16px; animation:fadeIn 0.6s 0.1s both; }
  .hero h1 .hl { color:var(--accent); }
  .hero p { font-family:var(--font-mono); font-size:14px; color:var(--muted); line-height:1.7; max-width:520px; margin:0 auto 36px; }

  /* ── URL INPUT ── */
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

  /* ── COMPETITOR INPUT ── */
  .competitor-section { position:relative; z-index:1; max-width:640px; margin:0 auto 36px; animation:fadeIn 0.5s ease both; }
  .competitor-section-title { font-family:var(--font-mono); font-size:11px; color:var(--muted); letter-spacing:2px; text-transform:uppercase; margin-bottom:10px; display:flex; align-items:center; gap:8px; }
  .competitor-input-row { display:flex; gap:8px; margin-bottom:10px; }
  .comp-input { flex:1; background:var(--surface); border:1px solid var(--border); border-radius:10px; padding:11px 16px; font-family:var(--font-mono); font-size:13px; color:var(--text); outline:none; transition:border-color 0.2s; }
  .comp-input::placeholder { color:var(--muted); }
  .comp-input:focus { border-color:rgba(0,136,255,0.5); }
  .add-comp-btn { background:var(--surface2); border:1px solid var(--border); color:var(--text); padding:11px 16px; border-radius:10px; font-family:var(--font-head); font-weight:700; font-size:13px; cursor:pointer; white-space:nowrap; transition:all 0.2s; }
  .add-comp-btn:hover { border-color:var(--accent2); color:var(--accent2); }
  .competitor-chips { display:flex; flex-wrap:wrap; gap:8px; }
  .competitor-chip { display:flex; align-items:center; gap:8px; background:var(--surface); border:1px solid var(--border); border-radius:8px; padding:6px 12px; font-family:var(--font-mono); font-size:12px; animation:fadeIn 0.3s ease both; }
  .chip-remove { background:none; border:none; color:var(--muted); cursor:pointer; font-size:14px; line-height:1; padding:0; transition:color 0.2s; }
  .chip-remove:hover { color:var(--warn); }

  /* ── DASHBOARD ── */
  .dashboard { position:relative; z-index:1; max-width:1200px; margin:0 auto; padding:0 48px 80px; }
  .section-label { font-family:var(--font-mono); font-size:11px; color:var(--muted); letter-spacing:2px; text-transform:uppercase; margin-bottom:16px; }
  .summary-box { background:rgba(0,229,160,0.04); border:1px solid rgba(0,229,160,0.15); border-radius:10px; padding:14px 18px; margin-bottom:20px; font-family:var(--font-mono); font-size:13px; color:var(--text); line-height:1.7; }

  /* Score cards */
  .score-row { display:grid; grid-template-columns:repeat(4,1fr); gap:14px; margin-bottom:20px; }
  .score-card { background:var(--surface); border:1px solid var(--border); border-radius:12px; padding:18px; position:relative; overflow:hidden; transition:border-color 0.2s; animation:fadeIn 0.5s ease both; }
  .score-card:hover { border-color:rgba(0,229,160,0.25); }
  .score-card-label { font-family:var(--font-mono); font-size:10px; color:var(--muted); letter-spacing:1px; text-transform:uppercase; margin-bottom:10px; }
  .score-value { font-size:34px; font-weight:800; letter-spacing:-1px; line-height:1; margin-bottom:4px; }
  .score-value.green{color:var(--accent)} .score-value.blue{color:var(--accent2)} .score-value.orange{color:var(--warn)} .score-value.yellow{color:#FFD700}
  .score-bar-bg { position:absolute; bottom:0; left:0; right:0; height:3px; background:var(--border); }
  .score-bar-fill { height:100%; border-radius:0 2px 2px 0; transition:width 1s ease; }

  /* Panels */
  .main-grid { display:grid; grid-template-columns:1fr 1fr; gap:14px; margin-bottom:20px; }
  .panel { background:var(--surface); border:1px solid var(--border); border-radius:12px; padding:22px; animation:fadeIn 0.6s ease both; }
  .panel-title { font-size:14px; font-weight:700; margin-bottom:3px; }
  .panel-sub { font-family:var(--font-mono); font-size:11px; color:var(--muted); margin-bottom:18px; }
  .full-width { grid-column:1/-1; }

  /* Content list */
  .content-item { display:flex; align-items:center; gap:10px; padding:10px 0; border-bottom:1px solid var(--border); }
  .content-item:last-child{border-bottom:none}
  .content-rank { font-family:var(--font-mono); font-size:11px; color:var(--muted); width:18px; flex-shrink:0; }
  .content-info { flex:1; overflow:hidden; }
  .content-title { font-size:13px; font-weight:600; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; margin-bottom:2px; }
  .content-url { font-family:var(--font-mono); font-size:10px; color:var(--muted); }
  .content-score { font-family:var(--font-mono); font-size:13px; font-weight:500; flex-shrink:0; }
  .pill { display:inline-flex; font-family:var(--font-mono); font-size:10px; padding:2px 8px; border-radius:100px; flex-shrink:0; }
  .pill.good{background:rgba(0,229,160,0.1);color:var(--accent)} .pill.bad{background:rgba(255,107,53,0.1);color:var(--warn)} .pill.mid{background:rgba(255,215,0,0.1);color:#FFD700}

  /* LLM bars */
  .llm-row { display:flex; align-items:center; gap:10px; margin-bottom:13px; }
  .llm-name { font-family:var(--font-mono); font-size:12px; width:76px; flex-shrink:0; }
  .llm-bar-bg { flex:1; height:7px; background:var(--border); border-radius:4px; overflow:hidden; }
  .llm-bar-fill { height:100%; border-radius:4px; transition:width 1.2s ease; }
  .llm-score { font-family:var(--font-mono); font-size:12px; font-weight:500; width:32px; text-align:right; flex-shrink:0; }

  /* Tabs */
  .tabs { display:flex; gap:4px; background:var(--bg); border:1px solid var(--border); border-radius:10px; padding:4px; margin-bottom:18px; width:fit-content; }
  .tab { padding:7px 14px; border-radius:7px; font-family:var(--font-mono); font-size:12px; cursor:pointer; color:var(--muted); border:none; background:transparent; transition:all 0.2s; }
  .tab.active { background:var(--surface); color:var(--text); border:1px solid var(--border); }

  /* Leaderboard */
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

  /* Competitor detail */
  .competitor-detail { border:1px solid var(--accent2); border-radius:12px; background:linear-gradient(135deg,rgba(0,136,255,0.04) 0%,rgba(0,0,0,0) 100%); padding:22px; margin-top:10px; animation:expandIn 0.25s ease both; transform-origin:top; }
  .competitor-detail.is-you { border-color:var(--accent); background:linear-gradient(135deg,rgba(0,229,160,0.04) 0%,rgba(0,0,0,0) 100%); }
  .detail-header { display:flex; align-items:center; justify-content:space-between; margin-bottom:18px; }
  .detail-domain { font-size:15px; font-weight:800; letter-spacing:-0.5px; }
  .detail-close { background:none; border:1px solid var(--border); color:var(--muted); width:28px; height:28px; border-radius:7px; cursor:pointer; font-size:14px; display:flex; align-items:center; justify-content:center; transition:all 0.2s; }
  .detail-close:hover { border-color:var(--warn); color:var(--warn); }
  .detail-grid { display:grid; grid-template-columns:1fr 1fr; gap:18px; }
  .detail-section-title { font-family:var(--font-mono); font-size:10px; color:var(--muted); letter-spacing:1.5px; text-transform:uppercase; margin-bottom:10px; }

  /* History */
  .history-panel { background:var(--surface); border:1px solid var(--border); border-radius:12px; padding:22px; margin-bottom:20px; animation:fadeIn 0.5s ease both; }
  .history-header { display:flex; align-items:flex-start; justify-content:space-between; margin-bottom:18px; }
  .history-meta { display:flex; gap:22px; }
  .history-stat-val { font-size:21px; font-weight:800; letter-spacing:-0.5px; }
  .history-stat-label { font-family:var(--font-mono); font-size:10px; color:var(--muted); margin-top:2px; }
  .history-entries { display:flex; gap:6px; margin-top:14px; font-family:var(--font-mono); font-size:10px; color:var(--muted); overflow-x:auto; padding-bottom:4px; }
  .history-entry { flex-shrink:0; background:var(--surface2); border:1px solid var(--border); border-radius:8px; padding:7px 11px; text-align:center; }
  .history-entry:last-child { border-color:rgba(0,229,160,0.4); }
  .history-entry-score { font-size:15px; font-weight:800; color:var(--accent); margin-bottom:2px; }
  .clear-history-btn { background:none; border:1px solid var(--border); color:var(--muted); padding:5px 11px; border-radius:7px; font-family:var(--font-mono); font-size:11px; cursor:pointer; transition:all 0.2s; }
  .clear-history-btn:hover { border-color:var(--warn); color:var(--warn); }

  /* Spinner */
  .spinner { width:15px; height:15px; border:2px solid rgba(0,229,160,0.3); border-top-color:var(--accent); border-radius:50%; animation:spin 0.8s linear infinite; }
  .spinner-sm { width:11px; height:11px; border:1.5px solid rgba(255,255,255,0.15); border-top-color:var(--muted); border-radius:50%; animation:spin 0.8s linear infinite; }

  /* Empty */
  .empty-state{text-align:center;padding:50px 20px;color:var(--muted)}
  .empty-icon{font-size:36px;margin-bottom:14px}
  .empty-title{font-size:17px;font-weight:700;color:var(--text);margin-bottom:8px}
  .empty-sub{font-family:var(--font-mono);font-size:13px;line-height:1.6}

  /* =====================================================
     NEW LESSON 5: PAYWALL STYLES
     ===================================================== */

  /* The locked recommendations wrapper */
  .paywall-wrapper {
    position: relative;
    border-radius: 12px;
    overflow: hidden;
  }

  /* The blurred content underneath */
  .paywall-blur {
    filter: blur(5px);
    pointer-events: none;
    user-select: none;
    opacity: 0.5;
  }

  /* The overlay that sits on top of the blurred content */
  .paywall-overlay {
    position: absolute;
    inset: 0;
    /* Gradient fades from transparent at top to full at bottom */
    background: linear-gradient(
      to bottom,
      rgba(8,12,16,0) 0%,
      rgba(8,12,16,0.7) 30%,
      rgba(8,12,16,0.97) 60%
    );
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-end;
    padding: 36px 24px 32px;
    text-align: center;
  }

  .paywall-icon {
    font-size: 28px;
    margin-bottom: 12px;
  }

  .paywall-title {
    font-size: 18px;
    font-weight: 800;
    letter-spacing: -0.5px;
    margin-bottom: 8px;
  }

  .paywall-sub {
    font-family: var(--font-mono);
    font-size: 12px;
    color: var(--muted);
    line-height: 1.6;
    max-width: 360px;
    margin-bottom: 20px;
  }

  .paywall-btn {
    background: linear-gradient(135deg, var(--gold), #FF8C00);
    color: #000;
    border: none;
    padding: 12px 28px;
    border-radius: 10px;
    font-family: var(--font-head);
    font-weight: 800;
    font-size: 14px;
    cursor: pointer;
    transition: transform 0.15s, opacity 0.2s;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .paywall-btn:hover { transform: scale(1.03); }

  .paywall-free-features {
    display: flex;
    gap: 16px;
    margin-top: 14px;
    font-family: var(--font-mono);
    font-size: 11px;
    color: var(--muted);
  }

  /* =====================================================
     NEW LESSON 5: MODAL STYLES
     ===================================================== */

  /* Dark overlay behind the modal */
  .modal-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.75);
    backdrop-filter: blur(4px);
    z-index: 100;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px;
    animation: fadeIn 0.15s ease;
  }

  /* The modal card itself */
  .modal {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 16px;
    padding: 36px;
    width: 100%;
    max-width: 440px;
    position: relative;
    animation: modalIn 0.2s ease both;
  }

  .modal-close {
    position: absolute;
    top: 16px; right: 16px;
    background: none; border: 1px solid var(--border);
    color: var(--muted); width: 30px; height: 30px;
    border-radius: 8px; cursor: pointer; font-size: 14px;
    display: flex; align-items: center; justify-content: center;
    transition: all 0.2s;
  }
  .modal-close:hover { border-color:var(--warn); color:var(--warn); }

  .modal-title { font-size: 22px; font-weight: 800; letter-spacing: -0.5px; margin-bottom: 6px; }
  .modal-sub { font-family: var(--font-mono); font-size: 13px; color: var(--muted); margin-bottom: 28px; line-height: 1.5; }

  /* Auth form */
  .auth-input {
    width: 100%; background: var(--surface2); border: 1px solid var(--border);
    border-radius: 10px; padding: 13px 16px; font-family: var(--font-mono);
    font-size: 14px; color: var(--text); outline: none; margin-bottom: 12px;
    transition: border-color 0.2s; display: block;
  }
  .auth-input::placeholder { color: var(--muted); }
  .auth-input:focus { border-color: var(--accent); }

  .auth-submit {
    width: 100%; background: var(--accent); color: #000; border: none;
    padding: 13px; border-radius: 10px; font-family: var(--font-head);
    font-weight: 700; font-size: 15px; cursor: pointer; margin-top: 4px;
    transition: opacity 0.2s;
  }
  .auth-submit:hover { opacity: 0.85; }

  .auth-switch {
    text-align: center; margin-top: 16px;
    font-family: var(--font-mono); font-size: 12px; color: var(--muted);
  }
  .auth-switch span { color: var(--accent); cursor: pointer; }
  .auth-switch span:hover { text-decoration: underline; }

  /* =====================================================
     NEW LESSON 5: UPGRADE / PRICING MODAL
     ===================================================== */

  .upgrade-modal { max-width: 520px; }

  /* The two pricing tiers */
  .pricing-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 20px; }

  .pricing-card {
    background: var(--surface2); border: 1px solid var(--border);
    border-radius: 12px; padding: 20px;
    position: relative; transition: border-color 0.2s;
  }

  .pricing-card.pro {
    border-color: rgba(255,184,0,0.4);
    background: linear-gradient(135deg, rgba(255,184,0,0.06), rgba(255,140,0,0.03));
  }

  .pricing-tier { font-family: var(--font-mono); font-size: 11px; letter-spacing: 2px; text-transform: uppercase; color: var(--muted); margin-bottom: 8px; }
  .pricing-tier.pro-label { color: var(--gold); }
  .pricing-price { font-size: 28px; font-weight: 800; letter-spacing: -1px; margin-bottom: 4px; }
  .pricing-price-sub { font-family: var(--font-mono); font-size: 11px; color: var(--muted); margin-bottom: 16px; }

  .pricing-features { list-style: none; }
  .pricing-features li {
    font-family: var(--font-mono); font-size: 12px; color: var(--muted);
    padding: 5px 0; border-bottom: 1px solid var(--border);
    display: flex; align-items: center; gap: 8px;
  }
  .pricing-features li:last-child { border-bottom: none; }
  .pricing-features li.yes { color: var(--text); }
  .pricing-features li .check { color: var(--accent); flex-shrink: 0; }
  .pricing-features li .cross { color: var(--border); flex-shrink: 0; }
  .pricing-features li .gold-check { color: var(--gold); flex-shrink: 0; }

  .stripe-btn {
    width: 100%; background: linear-gradient(135deg, var(--gold), #FF8C00);
    color: #000; border: none; padding: 14px; border-radius: 10px;
    font-family: var(--font-head); font-weight: 800; font-size: 15px;
    cursor: pointer; transition: transform 0.15s, opacity 0.2s;
    display: flex; align-items: center; justify-content: center; gap: 8px;
  }
  .stripe-btn:hover { transform: scale(1.02); }

  .stripe-note {
    text-align: center; margin-top: 10px;
    font-family: var(--font-mono); font-size: 11px; color: var(--muted);
  }
`;

// ============================================================
// 🤖 callClaude() — same as Lesson 4
// ============================================================
async function callClaude(url) {
  const clean = url.startsWith("http") ? url : `https://${url}`;
  const res = await fetch("/api/analyse", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url: clean })
  });
  if (!res.ok) throw new Error(`API error ${res.status}`);
  return await res.json();
}
Include 5-6 topContent and exactly 4 recommendations. Vary scores realistically.`;

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type":"application/json", "anthropic-version":"2023-06-01", "x-api-key": ANTHROPIC_API_KEY },
    body: JSON.stringify({ model:"claude-sonnet-4-20250514", max_tokens:2000, messages:[{role:"user",content:prompt}] })
  });
  if (!res.ok) throw new Error(`API error ${res.status}`);
  const d = await res.json();
  const text = d.content?.[0]?.text;
  if (!text) throw new Error("Empty response");
  return JSON.parse(text.replace(/^```json\s*/i,"").replace(/^```\s*/i,"").replace(/\s*```$/i,"").trim());
}

// ============================================================
// 📦 localStorage helpers (same as Lesson 4)
// ============================================================
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

// ============================================================
// 📈 SparklineChart — same as Lesson 4
// ============================================================
function SparklineChart({ history }) {
  if (!history||history.length<2) return null;
  const W=280,H=60,PAD=8;
  const scores=history.map(h=>h.score);
  const min=Math.min(...scores)-5, max=Math.max(...scores)+5;
  const points=scores.map((s,i)=>{
    const x=PAD+(i/(scores.length-1))*(W-PAD*2);
    const y=H-PAD-((s-min)/(max-min))*(H-PAD*2);
    return `${x},${y}`;
  });
  const last=points[points.length-1].split(",");
  const trend=scores[scores.length-1]-scores[0];
  return (
    <div style={{position:"relative"}}>
      <svg width={W} height={H} style={{overflow:"visible"}}>
        <defs><linearGradient id="sg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="var(--accent)" stopOpacity="0.15"/><stop offset="100%" stopColor="var(--accent)" stopOpacity="0"/></linearGradient></defs>
        <polygon points={`${PAD},${H} ${points.join(" ")} ${W-PAD},${H}`} fill="url(#sg)"/>
        <polyline points={points.join(" ")} fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round"/>
        <circle cx={parseFloat(last[0])} cy={parseFloat(last[1])} r="4" fill="var(--accent)"/>
      </svg>
      <div style={{position:"absolute",top:0,right:0,fontFamily:"var(--font-mono)",fontSize:11,color:trend>0?"var(--accent)":trend<0?"var(--warn)":"var(--muted)"}}>
        {trend>0?`▲ +${trend}`:trend<0?`▼ ${trend}`:"— no change"}
      </div>
    </div>
  );
}

function ScoreHistoryPanel({ history, domain, onClear }) {
  if (!history||history.length===0) return null;
  const best=Math.max(...history.map(h=>h.score));
  const latest=history[history.length-1].score;
  const prev=history.length>1?history[history.length-2].score:null;
  const change=prev!==null?latest-prev:0;
  return (
    <div className="history-panel">
      <div className="history-header">
        <div>
          <div className="panel-title">Score History</div>
          <div className="panel-sub" style={{marginBottom:0}}>{domain} — {history.length} scan{history.length>1?"s":""}</div>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:20}}>
          <div className="history-meta">
            <div><div className="history-stat-val" style={{color:"var(--accent)"}}>{latest}</div><div className="history-stat-label">Latest</div></div>
            <div><div className="history-stat-val" style={{color:change>0?"var(--accent)":change<0?"var(--warn)":"var(--muted)"}}>{change>0?`+${change}`:change}</div><div className="history-stat-label">vs last</div></div>
            <div><div className="history-stat-val" style={{color:"#FFD700"}}>{best}</div><div className="history-stat-label">Best</div></div>
          </div>
          <button className="clear-history-btn" onClick={onClear}>Clear</button>
        </div>
      </div>
      {history.length>=2 && <SparklineChart history={history}/>}
      <div className="history-entries">
        {history.map((e,i)=><div key={i} className="history-entry"><div className="history-entry-score">{e.score}</div><div style={{fontFamily:"var(--font-mono)",fontSize:10,color:"var(--muted)"}}>{e.date}</div></div>)}
      </div>
    </div>
  );
}

// ============================================================
// 🎨 Shared UI components
// ============================================================
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

// ============================================================
// 🔒 NEW LESSON 5: LockedRecommendations
//
// This component shows a blurred preview of recommendations
// with an upgrade prompt overlaid on top.
//
// It receives:
//   items   — the real recommendations from Claude
//   onUpgrade — function to call when user clicks "Unlock"
// ============================================================
function LockedRecommendations({ items, onUpgrade }) {
  const icons = { add:"✦", improve:"↑", remove:"✕" };

  return (
    // paywall-wrapper creates the "relative" positioning context
    // so we can absolutely position the overlay on top
    <div className="paywall-wrapper">

      {/* The real content — blurred so user can see it exists but can't read it */}
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

      {/* The overlay — gradient fade + lock icon + upgrade button */}
      <div className="paywall-overlay">
        <div className="paywall-icon">🔒</div>
        <div className="paywall-title">Strategic Recommendations</div>
        <div className="paywall-sub">
          Upgrade to Pro to unlock Claude's full AI optimisation playbook —
          exactly what to add, remove, and rewrite to climb LLM rankings.
        </div>
        <button className="paywall-btn" onClick={onUpgrade}>
          ⭐ Get Pro Access — $29/mo
        </button>
        <div className="paywall-free-features">
          <span>✓ Cancel anytime</span>
          <span>✓ Instant access</span>
          <span>✓ All future features</span>
        </div>
      </div>
    </div>
  );
}

// Unlocked version — shown to Pro users
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

// ============================================================
// 🔑 NEW LESSON 5: AuthModal
//
// A sign up / log in form.
// In this demo it's simulated — just updates state.
// TO GO LIVE: replace the handleSubmit body with Supabase calls:
//   const { data, error } = await supabase.auth.signInWithPassword({email, password})
// ============================================================
function AuthModal({ onClose, onSuccess }) {
  const [mode, setMode] = useState("login"); // "login" | "signup"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!email || !password) { setError("Please fill in all fields."); return; }
    setLoading(true); setError("");

    // ── SIMULATED AUTH ──
    // In production, replace this with:
    //
    // import { createClient } from '@supabase/supabase-js'
    // const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
    //
    // For login:
    //   const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    //
    // For signup:
    //   const { data, error } = await supabase.auth.signUp({ email, password })
    //
    await new Promise(r => setTimeout(r, 1000)); // simulate network delay
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

        <button className="auth-submit" onClick={handleSubmit} disabled={loading}>
          {loading ? "..." : mode==="login" ? "Log in" : "Create account"}
        </button>

        <div className="auth-switch">
          {mode==="login" ? <>No account? <span onClick={()=>setMode("signup")}>Sign up free</span></> : <>Already have one? <span onClick={()=>setMode("login")}>Log in</span></>}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// 💳 NEW LESSON 5: UpgradeModal
//
// Shows the pricing comparison and Stripe checkout button.
// TO GO LIVE: replace the handleCheckout function with:
//   const stripe = await loadStripe(STRIPE_PUBLIC_KEY)
//   const { error } = await stripe.redirectToCheckout({ sessionId })
//   (You need a backend endpoint to create the Stripe session)
// ============================================================
function UpgradeModal({ onClose, onSuccess }) {
  const FREE_FEATURES = [
    { label:"URL analysis", yes:true },
    { label:"LLM platform scores", yes:true },
    { label:"Content performance audit", yes:true },
    { label:"Competitor leaderboard", yes:true },
    { label:"Strategic recommendations", yes:false },
    { label:"Score history & trends", yes:false },
    { label:"Competitor content deep-dive", yes:false },
  ];

  const PRO_FEATURES = [
    { label:"Everything in Free", yes:true, gold:true },
    { label:"Strategic AI recommendations", yes:true, gold:true },
    { label:"Score history & trends", yes:true, gold:true },
    { label:"Competitor content deep-dive", yes:true, gold:true },
    { label:"Priority Claude analysis", yes:true, gold:true },
    { label:"Export PDF reports", yes:true, gold:true },
    { label:"API access (coming soon)", yes:true, gold:true },
  ];

  return (
    <div className="modal-backdrop" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="modal upgrade-modal">
        <button className="modal-close" onClick={onClose}>✕</button>
        <div className="modal-title">Upgrade to <span style={{color:"var(--gold)"}}>Pro</span></div>
        <div className="modal-sub">Unlock strategic recommendations and outrank your competitors on every AI platform.</div>

        <div className="pricing-grid">
          {/* Free tier */}
          <div className="pricing-card">
            <div className="pricing-tier">Free</div>
            <div className="pricing-price">$0</div>
            <div className="pricing-price-sub">forever</div>
            <ul className="pricing-features">
              {FREE_FEATURES.map((f,i)=>(
                <li key={i} className={f.yes?"yes":""}>
                  <span className={f.yes?"check":"cross"}>{f.yes?"✓":"✕"}</span>
                  {f.label}
                </li>
              ))}
            </ul>
          </div>

          {/* Pro tier */}
          <div className="pricing-card pro">
            <div className="pricing-tier pro-label">⭐ Pro</div>
            <div className="pricing-price" style={{color:"var(--gold)"}}>$29</div>
            <div className="pricing-price-sub">per month</div>
            <ul className="pricing-features">
              {PRO_FEATURES.map((f,i)=>(
                <li key={i} className="yes">
                  <span className="gold-check">✓</span>
                  {f.label}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div style={{background:"linear-gradient(135deg,rgba(255,184,0,0.08),rgba(255,140,0,0.04))",border:"1px solid rgba(255,184,0,0.3)",borderRadius:12,padding:"20px 24px",textAlign:"center"}}>
          <div style={{fontSize:22,marginBottom:10}}>✉️</div>
          <div style={{fontWeight:800,fontSize:15,marginBottom:6}}>Get in touch to upgrade</div>
          <div style={{fontFamily:"var(--font-mono)",fontSize:12,color:"var(--muted)",marginBottom:16,lineHeight:1.6}}>
            Email us and we'll get you set up with Pro access — usually within a few hours.
          </div>
          <a
            href="mailto:4947marketing@gmail.com?subject=LLMrank%20Pro%20Access&body=Hi%2C%20I'd%20like%20to%20upgrade%20to%20LLMrank%20Pro%20(%2429%2Fmo).%20Please%20send%20me%20details."
            style={{display:"inline-flex",alignItems:"center",gap:8,background:"linear-gradient(135deg,var(--gold),#FF8C00)",color:"#000",padding:"13px 28px",borderRadius:10,fontFamily:"var(--font-head)",fontWeight:800,fontSize:14,textDecoration:"none"}}
          >
            ⭐ Email to Upgrade — $29/mo
          </a>
          <div style={{fontFamily:"var(--font-mono)",fontSize:11,color:"var(--muted)",marginTop:12}}>
            4947marketing@gmail.com · Fast response · Cancel anytime
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// Leaderboard + Detail Panel (same as Lesson 4, unchanged)
// ============================================================
function CompetitorDetailPanel({ entry, yourData, onClose }) {
  const d = entry.isYou ? yourData : entry.data;
  if (!d) return null;
  const domain = entry.url.replace(/^https?:\/\//,"").replace(/\/$/,"");
  const topContent = [...(d.topContent||[])].sort((a,b)=>b.score-a.score).slice(0,4);
  const weakContent = [...(d.topContent||[])].sort((a,b)=>a.score-b.score).slice(0,4);
  const yourTop = yourData ? [...(yourData.topContent||[])].sort((a,b)=>b.score-a.score) : [];
  return (
    <div className={`competitor-detail ${entry.isYou?"is-you":""}`}>
      <div className="detail-header">
        <div>
          <div className="detail-domain">{domain}{entry.isYou&&<span className="you-badge" style={{marginLeft:10}}>YOUR SITE</span>}</div>
          <div style={{fontFamily:"var(--font-mono)",fontSize:11,color:"var(--muted)",marginTop:4}}>
            Score: <strong style={{color:entry.isYou?"var(--accent)":"var(--text)"}}>{d.overallScore}</strong>
            {!entry.isYou&&yourData&&<span style={{marginLeft:10,color:d.overallScore>yourData.overallScore?"var(--warn)":"var(--accent)"}}>{d.overallScore>yourData.overallScore?`▲ ${d.overallScore-yourData.overallScore}pts ahead`:`▼ ${yourData.overallScore-d.overallScore}pts behind`}</span>}
          </div>
        </div>
        <button className="detail-close" onClick={onClose}>✕</button>
      </div>
      {d.summary&&<div style={{fontFamily:"var(--font-mono)",fontSize:12,color:"var(--muted)",lineHeight:1.6,marginBottom:18,padding:"10px 14px",background:"rgba(255,255,255,0.02)",borderRadius:8,border:"1px solid var(--border)"}}>{d.summary}</div>}
      <div className="detail-grid">
        <div>
          <div className="detail-section-title">🏆 Top performing content</div>
          <ContentList items={topContent} compact/>
          {d.scores&&<div style={{marginTop:18}}><div className="detail-section-title">Platform breakdown</div><LLMBreakdown scores={d.scores}/></div>}
        </div>
        <div>
          <div className="detail-section-title">⚠ Weakest content</div>
          <ContentList items={weakContent} compact/>
          {d.strengths&&<div style={{marginTop:18}}><div className="detail-section-title">Strengths</div>{d.strengths.map((s,i)=><div key={i} style={{fontFamily:"var(--font-mono)",fontSize:11,color:"var(--accent)",marginBottom:5,display:"flex",gap:6}}><span>✓</span><span>{s}</span></div>)}</div>}
          {d.weaknesses&&<div style={{marginTop:14}}><div className="detail-section-title">Weaknesses</div>{d.weaknesses.map((w,i)=><div key={i} style={{fontFamily:"var(--font-mono)",fontSize:11,color:"var(--warn)",marginBottom:5,display:"flex",gap:6}}><span>✕</span><span>{w}</span></div>)}</div>}
        </div>
      </div>
      {!entry.isYou&&yourData&&yourTop.length>0&&(
        <div style={{marginTop:18,padding:16,background:"rgba(0,0,0,0.2)",borderRadius:10,border:"1px solid var(--border)"}}>
          <div className="detail-section-title" style={{marginBottom:12}}>📊 Content gap — you vs {domain}</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
            <div>
              <div style={{fontFamily:"var(--font-mono)",fontSize:10,color:"var(--accent)",letterSpacing:"1px",textTransform:"uppercase",marginBottom:10,paddingBottom:8,borderBottom:"1px solid var(--border)"}}>Your best content</div>
              {yourTop.slice(0,3).map((item,i)=><div key={i} style={{display:"flex",justifyContent:"space-between",fontFamily:"var(--font-mono)",fontSize:11,marginBottom:7}}><span style={{color:"var(--muted)",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",maxWidth:"70%"}}>{item.title}</span><span style={{color:"var(--accent)",flexShrink:0}}>{item.score}</span></div>)}
            </div>
            <div>
              <div style={{fontFamily:"var(--font-mono)",fontSize:10,color:"var(--accent2)",letterSpacing:"1px",textTransform:"uppercase",marginBottom:10,paddingBottom:8,borderBottom:"1px solid var(--border)"}}>Their best content</div>
              {topContent.slice(0,3).map((item,i)=><div key={i} style={{display:"flex",justifyContent:"space-between",fontFamily:"var(--font-mono)",fontSize:11,marginBottom:7}}><span style={{color:"var(--muted)",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",maxWidth:"70%"}}>{item.title}</span><span style={{color:"var(--accent2)",flexShrink:0}}>{item.score}</span></div>)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function CompetitorLeaderboard({ competitors, yourUrl, yourScore, yourData, selectedUrl, onSelect }) {
  const yourEntry={url:yourUrl,isYou:true,status:"done",score:yourScore,data:yourData};
  const allEntries=[yourEntry,...competitors.map(c=>({url:c.url,isYou:false,status:c.status,score:c.data?.overallScore??null,data:c.data,error:c.error}))];
  const sorted=[...allEntries].sort((a,b)=>{if(a.score===null)return 1;if(b.score===null)return -1;return b.score-a.score;});
  const topScore=sorted.find(e=>e.score!==null)?.score||0;
  const yourRank=sorted.findIndex(e=>e.isYou)+1;
  const doneCount=competitors.filter(c=>c.status==="done").length;
  const insight=doneCount>0?(yourRank===1?`🏆 You're leading! ${doneCount} competitor${doneCount>1?"s":""} analysed.`:`Ranked #${yourRank} — ${topScore-yourScore}pts behind ${sorted[0].url.replace(/^https?:\/\//,"").replace(/\/$/,"")}. Click any row for their content breakdown.`):null;
  return (
    <div>
      {insight&&<div className="insight-bar"><div style={{fontSize:18,flexShrink:0}}>📊</div><div>{insight}</div></div>}
      <div className="lb-header"><div>#</div><div>Domain</div><div style={{textAlign:"center"}}>Overall</div><div style={{textAlign:"center"}}>Claude</div><div style={{textAlign:"center"}}>ChatGPT</div><div style={{textAlign:"center"}}>Gemini</div><div>Bar</div><div>Status</div></div>
      <div style={{display:"flex",flexDirection:"column",gap:8}}>
        {sorted.map((entry,i)=>{
          const cData=entry.isYou?yourData:competitors.find(c=>c.url===entry.url)?.data;
          const isSelected=selectedUrl===entry.url;
          return (
            <div key={entry.url}>
              <div className={`lb-row ${entry.isYou?"you":""} ${isSelected?"selected":""}`} style={{animationDelay:`${i*60}ms`}} onClick={()=>onSelect(isSelected?null:entry)}>
                <div className={`lb-rank ${i===0?"top":""}`}>{entry.status==="scanning"?<div className="spinner-sm"/>:i+1}</div>
                <div>
                  <div className="lb-domain">{entry.url.replace(/^https?:\/\//,"").replace(/\/$/,"")}{entry.isYou&&<span className="you-badge">YOU</span>}<span style={{fontFamily:"var(--font-mono)",fontSize:10,color:"var(--muted)",marginLeft:8}}>{isSelected?"▲ collapse":"▼ details"}</span></div>
                  {cData?.summary&&<div className="lb-domain-sub">{cData.summary.slice(0,55)}...</div>}
                </div>
                <div className="lb-score" style={{color:entry.isYou?"var(--accent)":entry.score>yourScore?"var(--warn)":"var(--text)"}}>{entry.status==="scanning"?"—":entry.score??"✕"}</div>
                <div className="lb-score" style={{color:LLM_COLORS.claude,fontSize:12}}>{cData?.scores?.claude??"—"}</div>
                <div className="lb-score" style={{color:LLM_COLORS.chatgpt,fontSize:12}}>{cData?.scores?.chatgpt??"—"}</div>
                <div className="lb-score" style={{color:LLM_COLORS.gemini,fontSize:12}}>{cData?.scores?.gemini??"—"}</div>
                <div className="lb-bar-cell"><div className="lb-mini-bar"><div className="lb-mini-fill" style={{width:entry.score?`${entry.score}%`:"0%",background:entry.isYou?"var(--accent)":"var(--accent2)"}}/></div></div>
                <div>
                  {entry.status==="scanning"&&<span className="status-badge scanning">⟳ Scanning</span>}
                  {entry.status==="done"&&<span className="status-badge done">✓ Done</span>}
                  {entry.status==="error"&&<span className="status-badge error">✕ Error</span>}
                </div>
              </div>
              {isSelected&&<CompetitorDetailPanel entry={entry} yourData={yourData} onClose={()=>onSelect(null)}/>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ============================================================
// 🏠 MAIN APP
// ============================================================
export default function App() {
  // ── Core state (lessons 1-4) ──
  const [url, setUrl] = useState("");
  const [status, setStatus] = useState("idle");
  const [loadingStep, setLoadingStep] = useState(0);
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [tab, setTab] = useState("top");
  const [competitorInput, setCompetitorInput] = useState("");
  const [competitors, setCompetitors] = useState([]);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [history, setHistory] = useState([]);

  // ── NEW LESSON 5: Auth + paywall state ──
  //
  // user     — null (logged out) or { email, name, isPro }
  // modal    — which modal is open: null | "auth" | "upgrade"
  //
  // When isPro is true, the locked recommendations section
  // renders the full content instead of the blurred paywall.
  const [user, setUser] = useState(() => {
    // Load saved user from localStorage on first render
    // This is called a "lazy initialiser" — it only runs once
    try { return JSON.parse(localStorage.getItem(USER_KEY)); }
    catch { return null; }
  });
  const [modal, setModal] = useState(null);

  const isPro = user?.isPro === true;

  useEffect(()=>{
    if(url.trim()){const domain=url.replace(/^https?:\/\//,"").replace(/\/$/,"");setHistory(loadHistory(domain));}
  },[url]);

  const addCompetitor=()=>{const t=competitorInput.trim();if(!t||competitors.length>=4||competitors.some(c=>c.url===t))return;setCompetitors(prev=>[...prev,{url:t,status:"idle",data:null,error:null}]);setCompetitorInput("");};
  const removeCompetitor=u=>setCompetitors(prev=>prev.filter(c=>c.url!==u));
  const updateCompetitor=useCallback((url,changes)=>setCompetitors(prev=>prev.map(c=>c.url===url?{...c,...changes}:c)),[]);

  const handleAnalyse=async()=>{
    if(!url.trim())return;
    setStatus("loading");setError("");setData(null);setLoadingStep(0);setSelectedEntry(null);
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

  const handleLogout=()=>{
    localStorage.removeItem(USER_KEY);
    setUser(null);
  };

  const handleAuthSuccess=(newUser)=>{
    setUser(newUser);
    setModal(null);
  };

  const handleUpgradeSuccess=()=>{
    // Update user to isPro: true
    const updatedUser={...user,isPro:true};
    localStorage.setItem(USER_KEY,JSON.stringify(updatedUser));
    setUser(updatedUser);
    setModal(null);
  };

  const isScanning=competitors.some(c=>c.status==="scanning");
  const steps=["Validating URL...","Claude is analysing your site...","Building your report..."];

  return (
    <div className="app">
      <style>{style}</style>
      <div className="glow-orb"/><div className="glow-orb2"/>

      {/* ── MODALS ── */}
      {modal==="auth" && <AuthModal onClose={()=>setModal(null)} onSuccess={handleAuthSuccess}/>}
      {modal==="upgrade" && <UpgradeModal onClose={()=>setModal(null)} onSuccess={handleUpgradeSuccess}/>}

      {/* ── NAV ── */}
      <nav>
        <div className="logo" onClick={()=>{setStatus("idle");setData(null);setUrl("");}}><div className="logo-icon">⬡</div>LLM<span>rank</span></div>
        <div className="nav-right">
          {user ? (
            <>
              {isPro
                ? <div className="pro-badge"><span className="pro-star">⭐</span> Pro</div>
                : <button className="paywall-btn" style={{fontSize:12,padding:"7px 16px"}} onClick={()=>setModal("upgrade")}>⭐ Upgrade</button>
              }
              <span style={{fontFamily:"var(--font-mono)",fontSize:12,color:"var(--muted)"}}>{user.name}</span>
              <button className="nav-link" onClick={handleLogout}>Log out</button>
            </>
          ) : (
            <>
              <button className="btn-outline" onClick={()=>setModal("auth")}>Log in</button>
              <button className="btn-primary" onClick={()=>setModal("auth")}>Sign up free</button>
            </>
          )}
        </div>
      </nav>

      {/* ── HERO ── */}
      <div className="hero">
        <div className="badge"><div className="badge-dot"/>LLM Visibility Platform · Free to start</div>
        <h1>How does your site<br/>perform <span className="hl">across AI</span>?</h1>
        <p>Score your LLM visibility, track competitors, and get strategic recommendations to climb AI rankings.</p>
        <div className="url-form">
          <input className="url-input" placeholder="https://yourwebsite.com" value={url} onChange={e=>setUrl(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleAnalyse()} disabled={status==="loading"}/>
          <button className="analyse-btn" onClick={handleAnalyse} disabled={status==="loading"}>
            {status==="loading"?<><div className="spinner"/>Analysing...</>:history.length>0?"Re-scan →":"Analyse →"}
          </button>
        </div>
        {status==="loading"&&(<><div className="loading-bar"><div className="loading-bar-fill"/></div><div style={{display:"flex",flexDirection:"column",gap:8,maxWidth:400,margin:"20px auto 0",textAlign:"left"}}>{steps.map((s,i)=><div key={i} style={{display:"flex",alignItems:"center",gap:10,fontFamily:"var(--font-mono)",fontSize:12,color:i===loadingStep?"var(--accent)":i<loadingStep?"var(--muted)":"var(--border)",textDecoration:i<loadingStep?"line-through":"none"}}><span>{i<loadingStep?"✓":i===loadingStep?"→":"○"}</span>{s}</div>)}</div></>)}
        {status==="error"&&<div className="error-box">⚠ {error}<br/><span style={{color:"var(--muted)"}}>Make sure the URL is accessible.</span></div>}
        {status==="idle"&&<div className="url-hint">{history.length>0?`${history.length} previous scan${history.length>1?"s":""} saved`:"Free scan · Powered by Claude · ~10 seconds"}</div>}
        {status==="results"&&data&&<div className="url-hint">✓ Scan #{history.length} complete{isScanning?" — scanning competitors...":""}</div>}
      </div>

      {/* ── COMPETITOR INPUT ── */}
      {(status==="idle"||status==="results")&&url.trim()&&(
        <div className="competitor-section">
          <div className="competitor-section-title"><span>⊕</span>Add competitors<span style={{color:"var(--border)"}}>— up to 4</span></div>
          {competitors.length<4&&<div className="competitor-input-row"><input className="comp-input" placeholder="https://competitor.com" value={competitorInput} onChange={e=>setCompetitorInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addCompetitor()}/><button className="add-comp-btn" onClick={addCompetitor}>+ Add</button></div>}
          {competitors.length>0&&<div className="competitor-chips">{competitors.map(c=><div key={c.url} className="competitor-chip">{c.status==="scanning"&&<div className="spinner-sm"/>}{c.status==="done"&&<span style={{color:"var(--accent)",fontSize:11}}>✓</span>}{c.status==="error"&&<span style={{color:"var(--warn)",fontSize:11}}>✕</span>}<span>{c.url.replace(/^https?:\/\//,"")}</span><button className="chip-remove" onClick={()=>removeCompetitor(c.url)}>×</button></div>)}</div>}
        </div>
      )}

      {/* ── DASHBOARD ── */}
      {status==="results"&&data&&(
        <div className="dashboard">
          <ScoreHistoryPanel history={history} domain={url.replace(/^https?:\/\//,"").replace(/\/$/,"")} onClear={()=>{const d=url.replace(/^https?:\/\//,"").replace(/\/$/,"");clearHistory(d);setHistory([]);}}/>
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
              <div className="section-label" style={{marginTop:8}}>// Competitor Leaderboard{isScanning&&<span style={{color:"var(--accent2)",marginLeft:12}}>⟳ scanning...</span>}</div>
              <div className="panel full-width" style={{marginBottom:18}}>
                <div className="panel-title">Head-to-Head Comparison</div>
                <div className="panel-sub">Click any row to deep-dive into their content performance</div>
                <CompetitorLeaderboard competitors={competitors} yourUrl={url} yourScore={data.overallScore} yourData={data} selectedUrl={selectedEntry?.url} onSelect={setSelectedEntry}/>
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

            {/* ── RECOMMENDATIONS — GATED ── */}
            {/* This is the paywall in action. */}
            {/* isPro ? show full content : show blurred locked version */}
            <div className="panel full-width">
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:3}}>
                <div className="panel-title">Strategic Recommendations</div>
                {isPro
                  ? <div className="pro-badge"><span className="pro-star">⭐</span> Pro feature</div>
                  : <div style={{fontFamily:"var(--font-mono)",fontSize:11,color:"var(--muted)"}}>🔒 Pro only</div>
                }
              </div>
              <div className="panel-sub">{isPro?"Claude's full AI optimisation playbook for your site":"Upgrade to see exactly what to change and why"}</div>

              {isPro
                ? <UnlockedRecommendations items={data.recommendations||[]}/>
                : <LockedRecommendations items={data.recommendations||[]} onUpgrade={()=>user?setModal("upgrade"):setModal("auth")}/>
              }
            </div>
          </div>
        </div>
      )}

      {/* Empty state */}
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
