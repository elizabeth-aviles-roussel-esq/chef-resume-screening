import { useState, useEffect, useRef, useCallback } from "react";

const HIRING_SYSTEM_PROMPT = `You are an expert culinary hiring consultant with deep knowledge of the NYC restaurant industry. You are helping hire kitchen staff for a high-volume upscale casual New American and French restaurant in NYC doing 200 covers per night. The concept is upscale casual — elevated bistro fare, refined but approachable, not fine dining tasting menus. Benchmark restaurants for this style include Le Rock, Monkey Bar, Oceana, Gallagher's, Little Park, and the Happy Cooking group (Joseph Leonard, Perla, Bar Sardine).

Analyze the resume provided and return ONLY a valid JSON object with this exact structure, no preamble, no markdown, no backticks:
{
  "candidateName": <string - full name extracted from the resume, or "Unknown" if not found>,
  "score": <number 1-10>,
  "tier": <"interview" | "consider" | "pass">,
  "currentRole": <string - their most recent position and restaurant>,
  "relevantExperience": <string - 2-3 sentence analysis of relevant experience>,
  "volumeExperience": <string - 1-2 sentence assessment of high-volume kitchen experience>,
  "cuisineAlignment": <string - 1-2 sentences on how well their background matches upscale casual New American and French>,
  "redFlags": <string - gaps, overlaps, short tenures, or concerns. Use "None" if clean>,
  "leadershipLevel": <string - one of: "Line Cook" | "Lead Line Cook" | "Sous Chef" | "Chef de Cuisine">,
  "interviewQuestion": <string - the single most important question to ask this candidate>,
  "tags": [<2-4 short tags e.g. "High volume", "French brasserie", "Fine dining", "NYC pedigree", "Red flag", "Strong pedigree">],
  "highVolumeYears": <number - estimated years in genuinely high-volume kitchens>,
  "totalYears": <number - total years of professional kitchen experience>
}

Scoring guide: 8-10 = interview immediately, 5-7 = consider, 1-4 = pass.
Tier: score 8-10 → "interview", score 5-7 → "consider", score 1-4 → "pass".`;

export default function ResumeAnalyzer() {
  const [pdfReady, setPdfReady] = useState(false);
  const [candidates, setCandidates] = useState([]);
  const [analyzing, setAnalyzing] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [expandedId, setExpandedId] = useState(null);
  const [error, setError] = useState(null);
  const [pasteMode, setPasteMode] = useState(false);
  const [pasteText, setPasteText] = useState("");
  const [candidateCounter, setCandidateCounter] = useState(1);
  const fileInputRef = useRef(null);

  useEffect(() => {
    // Load PDF.js
    const pdfScript = document.createElement("script");
    pdfScript.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
    pdfScript.onload = () => {
      window.pdfjsLib.GlobalWorkerOptions.workerSrc =
        "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
      setPdfReady(true);
    };
    pdfScript.onerror = () => setPdfReady(true);
    document.head.appendChild(pdfScript);

    // Load Mammoth for .docx
    const mammothScript = document.createElement("script");
    mammothScript.src = "https://cdnjs.cloudflare.com/ajax/libs/mammoth/1.6.0/mammoth.browser.min.js";
    document.head.appendChild(mammothScript);

    return () => {
      if (document.head.contains(pdfScript)) document.head.removeChild(pdfScript);
      if (document.head.contains(mammothScript)) document.head.removeChild(mammothScript);
    };
  }, []);

  const extractPdfText = async (file) => {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await window.pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let fullText = "";
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      fullText += content.items.map((item) => item.str).join(" ") + "\n";
    }
    return fullText;
  };

  const extractDocxText = async (file) => {
    const arrayBuffer = await file.arrayBuffer();
    const result = await window.mammoth.extractRawText({ arrayBuffer });
    return result.value;
  };

  const extractTxtText = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = () => reject(new Error("Could not read text file"));
      reader.readAsText(file);
    });
  };

  const handleFile = async (file) => {
    if (!file) return;
    const name = file.name || "";
    const ext = name.split(".").pop().toLowerCase();
    const cleanLabel = name.replace(/\.[^.]+$/, "").replace(/[-_]/g, " ");

    try {
      if (ext === "pdf") {
        if (!window.pdfjsLib) { setError("PDF reader not ready. Please paste the resume text instead."); return; }
        const text = await extractPdfText(file);
        await analyzeResume(text, cleanLabel);
      } else if (ext === "docx") {
        if (!window.mammoth) { setError("Word doc reader not ready yet — try again in a moment or paste the text instead."); return; }
        const text = await extractDocxText(file);
        await analyzeResume(text, cleanLabel);
      } else if (ext === "txt") {
        const text = await extractTxtText(file);
        await analyzeResume(text, cleanLabel);
      } else {
        setError("Unsupported file type. Please upload a PDF, Word (.docx), or plain text (.txt) file.");
      }
    } catch {
      setError("Could not read this file. Try pasting the text instead.");
    }
  };

  const analyzeResume = async (resumeText, label) => {
    setAnalyzing(true);
    setError(null);
    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: HIRING_SYSTEM_PROMPT,
          messages: [{ role: "user", content: `Analyze this resume:\n\n${resumeText}` }],
        }),
      });
      const data = await response.json();
      const text = data.content.filter((b) => b.type === "text").map((b) => b.text).join("");
      const clean = text.replace(/```json|```/g, "").trim();
      const result = JSON.parse(clean);
      const num = candidateCounter;
      setCandidateCounter((n) => n + 1);
      const candidate = { id: Date.now(), label: label || `Candidate ${num}`, num, appliedDate: todayStr(), ...result };
      setCandidates((prev) => [...prev, candidate]);
      setExpandedId(candidate.id);
    } catch (err) {
      setError("Analysis failed — check the API connection or try pasting the text instead.");
    } finally {
      setAnalyzing(false);
    }
  };

  const handleFile = async (file) => {
    if (!file) return;
    if (file.type !== "application/pdf") { setError("Please upload a PDF file."); return; }
    if (!window.pdfjsLib) { setError("PDF reader not ready. Please paste the resume text instead."); return; }
    try {
      const text = await extractPdfText(file);
      const label = file.name.replace(/\.pdf$/i, "").replace(/[-_]/g, " ");
      await analyzeResume(text, label);
    } catch {
      setError("Could not read this PDF. Try pasting the text instead.");
    }
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragging(false);
    handleFile(e.dataTransfer.files[0]);
  }, [pdfReady]);

  const handlePasteSubmit = () => {
    if (!pasteText.trim()) return;
    analyzeResume(pasteText.trim(), `Candidate ${candidateCounter}`);
    setPasteText("");
    setPasteMode(false);
  };

  const getInitials = (name) => {
    if (!name || name === "Unknown") return "?";
    return name.trim().split(/\s+/).map(w => w[0]?.toUpperCase()).filter(Boolean).join("").slice(0, 3);
  };

  const todayStr = () => new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  const updateCandidate = (id, field, value) => {
    setCandidates(prev => prev.map(c => c.id === id ? { ...c, [field]: value } : c));
  };

  const scoreColor = (s) => s >= 8 ? "#6ABF69" : s >= 5 ? "#FFA726" : "#EF5350";
  const tierBg = { interview: "#1a2e1a", consider: "#2e2000", pass: "#2e1a1a" };
  const tierFg = { interview: "#6ABF69", consider: "#FFA726", pass: "#EF5350" };
  const tierLabel = { interview: "INTERVIEW", consider: "CONSIDER", pass: "PASS" };

  const sorted = [...candidates].sort((a, b) => b.score - a.score);

  const getTagStyle = (tag) => {
    const t = tag.toLowerCase();
    if (t.includes("red flag") || t.includes("gap")) return { background: "#2e1a1a", color: "#EF5350", border: "1px solid #3e2020" };
    if (t.includes("fine dining") || t.includes("lower") || t.includes("limited")) return { background: "#2e2000", color: "#FFA726", border: "1px solid #3e2a00" };
    return { background: "#1a2516", color: "#6ABF69", border: "1px solid #243520" };
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=DM+Mono:wght@400;500&family=DM+Sans:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html, body { background: #0f0f0e; height: 100%; }
        ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-track { background: #0f0f0e; } ::-webkit-scrollbar-thumb { background: #2a2a28; border-radius: 2px; }
        .app { display: flex; flex-direction: column; height: 100vh; background: #0f0f0e; color: #DDD8CE; font-family: 'DM Sans', sans-serif; }
        .topbar { display: flex; align-items: center; justify-content: space-between; padding: 14px 28px; border-bottom: 1px solid #232320; background: #0c0c0b; flex-shrink: 0; }
        .brand { font-family: 'Cormorant Garamond', serif; font-size: 19px; font-weight: 600; letter-spacing: 0.03em; color: #E8E2D6; }
        .concept { font-family: 'DM Mono', monospace; font-size: 9px; color: #3a3a36; letter-spacing: 0.12em; text-transform: uppercase; margin-top: 1px; }
        .topstats { display: flex; gap: 28px; }
        .tstat { text-align: right; }
        .tstat-n { font-family: 'Cormorant Garamond', serif; font-size: 20px; font-weight: 600; line-height: 1; }
        .tstat-l { font-family: 'DM Mono', monospace; font-size: 8px; color: #3a3a36; letter-spacing: 0.1em; text-transform: uppercase; margin-top: 1px; }
        .body { display: flex; flex: 1; overflow: hidden; }
        .sidebar { width: 300px; flex-shrink: 0; border-right: 1px solid #1e1e1b; background: #0c0c0b; display: flex; flex-direction: column; overflow-y: auto; padding: 20px 18px; gap: 10px; }
        .drop-zone { border: 1px dashed #2a2a26; border-radius: 8px; padding: 28px 16px; text-align: center; cursor: pointer; transition: all 0.2s; }
        .drop-zone:hover, .drop-zone.over { border-color: #B89A5A; background: #161510; }
        .drop-icon { font-size: 28px; margin-bottom: 8px; }
        .drop-title { font-family: 'Cormorant Garamond', serif; font-size: 15px; color: #B89A5A; margin-bottom: 4px; }
        .drop-sub { font-family: 'DM Mono', monospace; font-size: 10px; color: #3a3a36; }
        .btn-primary { background: #B89A5A; color: #0c0c0b; border: none; padding: 9px 14px; border-radius: 5px; font-size: 11px; font-weight: 600; font-family: 'DM Mono', monospace; letter-spacing: 0.08em; text-transform: uppercase; cursor: pointer; width: 100%; transition: background 0.2s; }
        .btn-primary:hover { background: #C8AA6A; } .btn-primary:disabled { background: #222; color: #444; cursor: not-allowed; }
        .btn-ghost { background: transparent; color: #444; border: 1px solid #1e1e1b; padding: 8px 14px; border-radius: 5px; font-size: 10px; font-weight: 500; font-family: 'DM Mono', monospace; letter-spacing: 0.06em; text-transform: uppercase; cursor: pointer; width: 100%; transition: all 0.2s; }
        .btn-ghost:hover { border-color: #3a3a36; color: #777; }
        .paste-box { width: 100%; background: #080808; border: 1px solid #1e1e1b; border-radius: 6px; color: #CCC; font-family: 'DM Mono', monospace; font-size: 10px; padding: 10px 12px; resize: vertical; min-height: 130px; outline: none; line-height: 1.6; }
        .paste-box:focus { border-color: #B89A5A; }
        .spinner-row { display: flex; align-items: center; gap: 10px; padding: 12px 14px; background: #161510; border: 1px solid #B89A5A22; border-radius: 6px; }
        .spin { width: 14px; height: 14px; border: 2px solid #2a2a26; border-top-color: #B89A5A; border-radius: 50%; animation: rot 0.7s linear infinite; flex-shrink: 0; }
        @keyframes rot { to { transform: rotate(360deg); } }
        .spin-txt { font-family: 'DM Mono', monospace; font-size: 11px; color: #B89A5A; }
        .err-box { background: #1e0e0e; border: 1px solid #EF535033; border-radius: 6px; padding: 10px 12px; font-size: 10px; color: #EF5350; font-family: 'DM Mono', monospace; line-height: 1.5; cursor: pointer; }
        .pill-list { display: flex; flex-direction: column; gap: 3px; }
        .pill-head { font-family: 'DM Mono', monospace; font-size: 8px; color: #2e2e2c; letter-spacing: 0.12em; text-transform: uppercase; padding-bottom: 8px; border-bottom: 1px solid #1a1a18; margin-bottom: 4px; }
        .pill { display: flex; align-items: center; gap: 8px; padding: 8px 10px; border-radius: 6px; cursor: pointer; border: 1px solid transparent; transition: all 0.15s; }
        .pill:hover { background: #141412; } .pill.active { background: #141410; border-color: #B89A5A22; }
        .pill-score { width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-family: 'Cormorant Garamond', serif; font-size: 13px; font-weight: 600; border: 1.5px solid; flex-shrink: 0; }
        .pill-name { font-size: 11px; color: #AAA; flex: 1; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .pill-badge { font-family: 'DM Mono', monospace; font-size: 8px; font-weight: 600; padding: 2px 5px; border-radius: 3px; letter-spacing: 0.06em; }
        .content { flex: 1; overflow-y: auto; padding: 28px 32px; }
        .empty { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 70%; color: #222; text-align: center; }
        .empty-icon { font-size: 40px; margin-bottom: 16px; opacity: 0.3; }
        .empty-h { font-family: 'Cormorant Garamond', serif; font-size: 20px; color: #2e2e2c; margin-bottom: 6px; }
        .empty-s { font-family: 'DM Mono', monospace; font-size: 10px; color: #222; }
        .page-title { font-family: 'Cormorant Garamond', serif; font-size: 24px; color: #E8E2D6; margin-bottom: 2px; }
        .page-sub { font-family: 'DM Mono', monospace; font-size: 9px; color: #333; letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 24px; }
        .card { background: #141412; border: 1px solid #1e1e1b; border-radius: 10px; margin-bottom: 16px; overflow: hidden; transition: border-color 0.2s; }
        .card:hover { border-color: #2a2a28; }
        .card-top { display: flex; align-items: flex-start; gap: 16px; padding: 18px 20px; cursor: pointer; }
        .rank-n { font-family: 'DM Mono', monospace; font-size: 9px; color: #2e2e2c; letter-spacing: 0.06em; padding-top: 4px; width: 20px; flex-shrink: 0; }
        .score-circle { width: 50px; height: 50px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-family: 'Cormorant Garamond', serif; font-size: 20px; font-weight: 600; border: 2px solid; flex-shrink: 0; }
        .card-info { flex: 1; }
        .card-leadership { font-family: 'DM Mono', monospace; font-size: 9px; color: #444; letter-spacing: 0.08em; text-transform: uppercase; margin-bottom: 3px; }
        .card-name { font-family: 'Cormorant Garamond', serif; font-size: 17px; color: #E8E2D6; font-weight: 600; margin-bottom: 4px; }
        .card-current { font-size: 11px; color: #666; margin-bottom: 8px; }
        .tags { display: flex; flex-wrap: wrap; gap: 5px; }
        .tag { font-family: 'DM Mono', monospace; font-size: 9px; padding: 2px 7px; border-radius: 3px; letter-spacing: 0.04em; }
        .tier-chip { font-family: 'DM Mono', monospace; font-size: 9px; font-weight: 600; padding: 4px 8px; border-radius: 4px; letter-spacing: 0.08em; flex-shrink: 0; }
        .card-body { border-top: 1px solid #1a1a18; padding: 18px 20px 20px; }
        .bars { margin-bottom: 14px; display: flex; flex-direction: column; gap: 7px; }
        .bar-row { display: flex; align-items: center; gap: 10px; }
        .bar-lbl { font-family: 'DM Mono', monospace; font-size: 9px; color: #3a3a36; width: 80px; flex-shrink: 0; }
        .bar-track { flex: 1; height: 3px; background: #1a1a18; border-radius: 2px; overflow: hidden; }
        .bar-fill { height: 100%; border-radius: 2px; }
        .bar-val { font-family: 'DM Mono', monospace; font-size: 9px; color: #444; width: 24px; text-align: right; }
        .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
        .cell { background: #0f0f0e; border: 1px solid #1a1a18; border-radius: 6px; padding: 12px 14px; }
        .cell.full { grid-column: 1 / -1; }
        .cell.gold { background: #141208; border-color: #B89A5A22; border-left: 2px solid #B89A5A; border-radius: 0 6px 6px 0; }
        .cell-lbl { font-family: 'DM Mono', monospace; font-size: 8px; color: #333; letter-spacing: 0.12em; text-transform: uppercase; margin-bottom: 5px; }
        .cell-gold-lbl { color: #B89A5A55; }
        .cell-txt { font-size: 11px; color: #888; line-height: 1.6; }
        .cell-gold-txt { color: #B89A5A; font-style: italic; font-size: 12px; }
        .manual-row { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px; }
        .manual-field { background: #0f0f0e; border: 1px solid #1a1a18; border-radius: 6px; padding: 10px 14px; }
        .manual-label { font-family: 'DM Mono', monospace; font-size: 8px; color: #333; letter-spacing: 0.12em; text-transform: uppercase; margin-bottom: 5px; }
        .manual-input { width: 100%; background: transparent; border: none; outline: none; font-family: 'DM Sans', sans-serif; font-size: 12px; color: #CCC; padding: 0; }
        .manual-input::placeholder { color: #333; font-style: italic; }
      `}</style>

      <div className="app">
        {/* Top bar */}
        <div className="topbar">
          <div>
            <div className="brand">Kitchen Hire</div>
            <div className="concept">Upscale Casual · New American & French · 200 Covers · NYC</div>
          </div>
          <div className="topstats">
            <div className="tstat">
              <div className="tstat-n" style={{ color: "#DDD8CE" }}>{candidates.length}</div>
              <div className="tstat-l">Reviewed</div>
            </div>
            <div className="tstat">
              <div className="tstat-n" style={{ color: "#6ABF69" }}>{candidates.filter(c => c.tier === "interview").length}</div>
              <div className="tstat-l">Interview</div>
            </div>
            <div className="tstat">
              <div className="tstat-n" style={{ color: "#FFA726" }}>{candidates.filter(c => c.tier === "consider").length}</div>
              <div className="tstat-l">Consider</div>
            </div>
            <div className="tstat">
              <div className="tstat-n" style={{ color: "#EF5350" }}>{candidates.filter(c => c.tier === "pass").length}</div>
              <div className="tstat-l">Pass</div>
            </div>
          </div>
        </div>

        <div className="body">
          {/* Sidebar */}
          <div className="sidebar">
            <input type="file" accept=".pdf,.docx,.txt" ref={fileInputRef} style={{ display: "none" }} onChange={e => handleFile(e.target.files[0])} />

            {!pasteMode ? (
              <>
                <div
                  className={`drop-zone ${dragging ? "over" : ""}`}
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={e => { e.preventDefault(); setDragging(true); }}
                  onDragLeave={() => setDragging(false)}
                  onDrop={handleDrop}
                >
                  <div className="drop-icon">📄</div>
                  <div className="drop-title">Drop Resume File</div>
                  <div className="drop-sub">PDF · Word (.docx) · Text (.txt)</div>
                </div>
                <button className="btn-ghost" onClick={() => setPasteMode(true)} disabled={analyzing}>
                  Paste text instead
                </button>
              </>
            ) : (
              <>
                <textarea
                  className="paste-box"
                  placeholder="Paste resume text here..."
                  value={pasteText}
                  onChange={e => setPasteText(e.target.value)}
                  autoFocus
                />
                <button className="btn-primary" onClick={handlePasteSubmit} disabled={!pasteText.trim() || analyzing}>
                  Analyze Resume
                </button>
                <button className="btn-ghost" onClick={() => { setPasteMode(false); setPasteText(""); }}>
                  ← Back to Upload
                </button>
              </>
            )}

            {analyzing && (
              <div className="spinner-row">
                <div className="spin" />
                <span className="spin-txt">Analyzing resume…</span>
              </div>
            )}

            {error && (
              <div className="err-box" onClick={() => setError(null)}>
                {error}<br /><span style={{ opacity: 0.5 }}>Tap to dismiss</span>
              </div>
            )}

            {sorted.length > 0 && (
              <div className="pill-list">
                <div className="pill-head">Candidates ({sorted.length})</div>
                {sorted.map((c, i) => {
                  const sc = scoreColor(c.score);
                  return (
                    <div key={c.id} className={`pill ${expandedId === c.id ? "active" : ""}`} onClick={() => setExpandedId(expandedId === c.id ? null : c.id)}>
                      <div className="pill-score" style={{ color: sc, borderColor: sc + "44", background: sc + "11" }}>{c.score}</div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "11px", fontWeight: 600, color: "#DDD8CE" }}>{getInitials(c.manualName || c.candidateName)}</span>
                          <span style={{ color: "#444", fontSize: "10px" }}>·</span>
                          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "9px", color: "#555" }}>#{i + 1}</span>
                        </div>
                        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "9px", color: "#3a3a36", marginTop: "1px" }}>{c.appliedDate}</div>
                      </div>
                      <div className="pill-badge" style={{ background: tierBg[c.tier], color: tierFg[c.tier] }}>{tierLabel[c.tier]}</div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Main content */}
          <div className="content">
            {candidates.length === 0 ? (
              <div className="empty">
                <div className="empty-icon">🍽</div>
                <div className="empty-h">No candidates yet</div>
                <div className="empty-s">Upload a PDF or paste resume text to begin</div>
              </div>
            ) : (
              <>
                <div className="page-title">Candidate Analysis</div>
                <div className="page-sub">Sorted by fit score · High-volume upscale casual NYC</div>

                {sorted.map((c, idx) => {
                  const isOpen = expandedId === c.id;
                  const sc = scoreColor(c.score);
                  return (
                    <div key={c.id} className="card">
                      <div className="card-top" onClick={() => setExpandedId(isOpen ? null : c.id)}>
                        <div className="rank-n">#{idx + 1}</div>
                        <div className="score-circle" style={{ color: sc, borderColor: sc + "55", background: sc + "0f" }}>{c.score}</div>
                        <div className="card-info">
                          <div className="card-leadership">{c.leadershipLevel}</div>
                          <div className="card-name">
                            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "15px", fontWeight: 600, marginRight: "10px", letterSpacing: "0.05em" }}>
                              {getInitials(c.manualName || c.candidateName)}
                            </span>
                            <span style={{ fontSize: "13px", color: "#666", fontWeight: 400 }}>
                              {c.manualName || (c.candidateName !== "Unknown" ? c.candidateName : "")}
                            </span>
                          </div>
                          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px", flexWrap: "wrap" }}>
                            <div className="card-current" style={{ marginBottom: 0 }}>{c.currentRole}</div>
                            <span style={{ color: "#2a2a28", fontSize: "10px" }}>·</span>
                            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "9px", color: "#3a3a36" }}>Applied {c.appliedDate}</div>
                            {c.manualPhone && (<>
                              <span style={{ color: "#2a2a28", fontSize: "10px" }}>·</span>
                              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "9px", color: "#5a5a54" }}>{c.manualPhone}</div>
                            </>)}
                          </div>
                          <div className="tags">
                            {(c.tags || []).map((tag, ti) => (
                              <span key={ti} className="tag" style={getTagStyle(tag)}>{tag}</span>
                            ))}
                          </div>
                        </div>
                        <div className="tier-chip" style={{ background: tierBg[c.tier], color: tierFg[c.tier] }}>
                          {tierLabel[c.tier]}
                        </div>
                      </div>

                      {isOpen && (
                        <div className="card-body">
                          <div className="manual-row">
                            <div className="manual-field">
                              <div className="manual-label">Candidate Name</div>
                              <input
                                className="manual-input"
                                placeholder="Enter name..."
                                value={c.manualName || ""}
                                onChange={e => updateCandidate(c.id, "manualName", e.target.value)}
                                onClick={e => e.stopPropagation()}
                              />
                            </div>
                            <div className="manual-field">
                              <div className="manual-label">Phone Number</div>
                              <input
                                className="manual-input"
                                placeholder="Enter phone..."
                                value={c.manualPhone || ""}
                                onChange={e => updateCandidate(c.id, "manualPhone", e.target.value)}
                                onClick={e => e.stopPropagation()}
                              />
                            </div>
                          </div>
                            <div className="bar-row">
                              <div className="bar-lbl">Total career</div>
                              <div className="bar-track"><div className="bar-fill" style={{ width: `${Math.min((c.totalYears / 25) * 100, 100)}%`, background: "#2a2a28" }} /></div>
                              <div className="bar-val">{c.totalYears}y</div>
                            </div>
                            <div className="bar-row">
                              <div className="bar-lbl">High volume</div>
                              <div className="bar-track"><div className="bar-fill" style={{ width: `${Math.min((c.highVolumeYears / 25) * 100, 100)}%`, background: "#4CAF50" }} /></div>
                              <div className="bar-val">{c.highVolumeYears}y</div>
                            </div>
                          </div>

                          <div className="grid">
                            <div className="cell">
                              <div className="cell-lbl">Relevant Experience</div>
                              <div className="cell-txt">{c.relevantExperience}</div>
                            </div>
                            <div className="cell">
                              <div className="cell-lbl">Volume Assessment</div>
                              <div className="cell-txt">{c.volumeExperience}</div>
                            </div>
                            <div className="cell">
                              <div className="cell-lbl">Cuisine Alignment</div>
                              <div className="cell-txt">{c.cuisineAlignment}</div>
                            </div>
                            <div className="cell">
                              <div className="cell-lbl">Red Flags</div>
                              <div className="cell-txt" style={{ color: c.redFlags === "None" ? "#6ABF69" : "#EF5350" }}>{c.redFlags}</div>
                            </div>
                            <div className="cell full gold">
                              <div className="cell-lbl cell-gold-lbl">Key Interview Question</div>
                              <div className="cell-txt cell-gold-txt">"{c.interviewQuestion}"</div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
