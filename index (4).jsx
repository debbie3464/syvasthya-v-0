/**
 * pages/CreatePost/index.jsx
 * Composer for creating new posts.
 * Features:
 *  - Anonymous posting toggle for patients
 *  - AI summary auto-generated on submit
 *  - Hashtag picker
 *  - Image attachment (preview only)
 */

import { useState, useRef } from "react";
import { generateSymptomSummary, assessUrgency } from "../../services/aiSummary";
import { HASHTAGS } from "../../services/mockData";

const IC_plus = (
  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
    <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);
const IC_img = (
  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <circle cx="8.5" cy="8.5" r="1.5" />
    <polyline points="21 15 16 10 5 21" />
  </svg>
);
const IC_hash = (
  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <line x1="4" y1="9" x2="20" y2="9" /><line x1="4" y1="15" x2="20" y2="15" />
    <line x1="10" y1="3" x2="8" y2="21" /><line x1="16" y1="3" x2="14" y2="21" />
  </svg>
);
const IC_close = (
  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);
const Spinner = () => (
  <span
    style={{
      width: 14,
      height: 14,
      border: "2px solid rgba(255,255,255,0.3)",
      borderTopColor: "#fff",
      borderRadius: "50%",
      display: "inline-block",
      animation: "spin .7s linear infinite",
    }}
  />
);

const AV_G = [
  "linear-gradient(135deg,#00a896,#007a6e)",
  "linear-gradient(135deg,#1a73e8,#1558b0)",
  "linear-gradient(135deg,#f59e0b,#d97706)",
  "linear-gradient(135deg,#ec4899,#be185d)",
];
const avColor = (s) => AV_G[(s || "A").charCodeAt(0) % AV_G.length];

export const CreatePost = ({ user, onSubmit, defaultType, placeholder }) => {
  const [text, setText] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(user?.isAnonymous ?? false);
  const [imgPreview, setImgPreview] = useState(null);
  const [showTagPicker, setShowTagPicker] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [focused, setFocused] = useState(false);
  const imgRef = useRef(null);
  const textRef = useRef(null);
  const maxChars = 500;
  const isPatient = user?.role === "patient";
  const isDoctor = user?.role === "doctor";

  const handleImageSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { alert("Image must be under 5MB"); return; }
    const reader = new FileReader();
    reader.onload = (ev) => setImgPreview(ev.target.result);
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const insertTag = (tag) => {
    const suffix = text.endsWith(" ") || text === "" ? tag + " " : " " + tag + " ";
    setText((text + suffix).slice(0, maxChars));
    setShowTagPicker(false);
    textRef.current?.focus();
  };

  const submit = async () => {
    if (!text.trim() && !imgPreview) return;
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 600));

    const tags = [...text.matchAll(/#\w+/g)].map((m) => m[0]);
    // Auto-generate AI summary for patient posts
    const symptomSummary = isPatient ? generateSymptomSummary(text) : null;
    const urgency = isPatient ? assessUrgency(text) : null;

    onSubmit({
      content: text.trim(),
      tags,
      type: defaultType || (isDoctor ? "doctor_post" : "patient_post"),
      image: imgPreview || null,
      isAnonymous: isPatient ? isAnonymous : false,
      symptomSummary,
      urgency,
    });

    setText(""); setImgPreview(null); setFocused(false);
    setSubmitting(false); setShowTagPicker(false);
  };

  const pct = text.length / maxChars;
  const circumference = 2 * Math.PI * 10;

  return (
    <div className="composer">
      <div style={{ display: "flex", gap: 13, alignItems: "flex-start" }}>
        {/* Avatar */}
        <div
          style={{
            width: 42,
            height: 42,
            borderRadius: "50%",
            background: avColor(user?.avatar || "?"),
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 14,
            fontWeight: 800,
            fontFamily: "var(--font-b)",
            color: "#fff",
            flexShrink: 0,
            position: "relative",
          }}
        >
          {(user?.avatar || "?").slice(0, 2).toUpperCase()}
          <span
            style={{
              position: "absolute",
              bottom: 1,
              right: 1,
              width: 9,
              height: 9,
              background: "#22c55e",
              borderRadius: "50%",
              border: "2px solid #fff",
            }}
          />
        </div>

        <div style={{ flex: 1 }}>
          <textarea
            ref={textRef}
            className="compose-area"
            value={text}
            onChange={(e) => setText(e.target.value.slice(0, maxChars))}
            onFocus={() => setFocused(true)}
            placeholder={
              placeholder ||
              (isDoctor
                ? "Share medical knowledge or advice…"
                : "Describe your symptoms or ask a health question…")
            }
            rows={focused || text ? 3 : 1}
            style={{ transition: "all .2s", paddingTop: 4 }}
          />

          {/* Image preview */}
          {imgPreview && (
            <div
              className="fi"
              style={{
                position: "relative",
                marginTop: 10,
                borderRadius: 14,
                overflow: "hidden",
                border: "1px solid var(--border)",
              }}
            >
              <img
                src={imgPreview}
                alt="Preview"
                style={{ width: "100%", maxHeight: 240, objectFit: "cover", display: "block" }}
              />
              <button
                onClick={() => setImgPreview(null)}
                style={{
                  position: "absolute",
                  top: 8,
                  right: 8,
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  background: "rgba(0,0,0,0.6)",
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                }}
              >
                {IC_close}
              </button>
            </div>
          )}

          {(focused || text || imgPreview) && (
            <div
              className="fi"
              style={{
                marginTop: 10,
                paddingTop: 10,
                borderTop: "1px solid var(--border)",
              }}
            >
              {/* Top row: Anonymous toggle (patients only) + tools */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: isPatient ? 10 : 0,
                  gap: 8,
                  flexWrap: "wrap",
                }}
              >
                <div style={{ display: "flex", gap: 6, position: "relative" }}>
                  <input
                    ref={imgRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelect}
                    style={{ display: "none" }}
                  />
                  <button
                    className="action-btn"
                    style={{ padding: "6px 10px", color: "var(--teal2)" }}
                    onClick={() => imgRef.current?.click()}
                  >
                    {IC_img}
                    <span style={{ fontSize: 12 }}>Image</span>
                  </button>
                  <button
                    className="action-btn"
                    style={{ padding: "6px 10px", color: "var(--teal2)" }}
                    onClick={() => setShowTagPicker(!showTagPicker)}
                  >
                    {IC_hash}
                    <span style={{ fontSize: 12 }}>Tag</span>
                  </button>

                  {/* Hashtag picker dropdown */}
                  {showTagPicker && (
                    <div
                      className="si"
                      style={{
                        position: "absolute",
                        top: "100%",
                        left: 0,
                        marginTop: 6,
                        background: "var(--surface)",
                        border: "1px solid var(--border)",
                        borderRadius: 14,
                        padding: "10px 12px",
                        boxShadow: "var(--shadow2)",
                        zIndex: 30,
                        width: 260,
                        maxHeight: 180,
                        overflowY: "auto",
                      }}
                    >
                      <p
                        style={{
                          fontSize: 11,
                          fontWeight: 700,
                          color: "var(--text3)",
                          textTransform: "uppercase",
                          letterSpacing: ".04em",
                          marginBottom: 8,
                        }}
                      >
                        Insert Hashtag
                      </p>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                        {HASHTAGS.map((h) => (
                          <button
                            key={h}
                            onClick={() => insertTag(h)}
                            style={{
                              padding: "4px 10px",
                              borderRadius: 20,
                              border: "1px solid var(--border)",
                              background: "var(--surface2)",
                              cursor: "pointer",
                              fontSize: 12,
                              fontWeight: 600,
                              fontFamily: "var(--font-b)",
                              color: "var(--text2)",
                              transition: "all .15s",
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background = "var(--teal-bg)";
                              e.currentTarget.style.color = "var(--teal)";
                              e.currentTarget.style.borderColor = "var(--teal)";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = "var(--surface2)";
                              e.currentTarget.style.color = "var(--text2)";
                              e.currentTarget.style.borderColor = "var(--border)";
                            }}
                          >
                            {h}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Char counter + submit */}
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <svg width="24" height="24" style={{ transform: "rotate(-90deg)" }}>
                    <circle cx="12" cy="12" r="10" fill="none" stroke="var(--border)" strokeWidth="2.5" />
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      fill="none"
                      stroke={pct > 0.9 ? "#ef4444" : pct > 0.7 ? "#f59e0b" : "var(--teal)"}
                      strokeWidth="2.5"
                      strokeDasharray={circumference}
                      strokeDashoffset={circumference * (1 - pct)}
                      strokeLinecap="round"
                      style={{ transition: "all .2s" }}
                    />
                  </svg>
                  <span style={{ fontSize: 11.5, color: pct > 0.9 ? "#ef4444" : "var(--text3)" }}>
                    {maxChars - text.length}
                  </span>
                  <button
                    className="btn-p"
                    onClick={submit}
                    disabled={(!text.trim() && !imgPreview) || submitting}
                    style={{ padding: "8px 20px", fontSize: 13 }}
                  >
                    {submitting ? <Spinner /> : isDoctor ? "Publish" : "Post"}
                  </button>
                </div>
              </div>

              {/* Anonymous toggle — patients only */}
              {isPatient && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "10px 12px",
                    background: isAnonymous
                      ? "rgba(107,114,128,.08)"
                      : "var(--surface2)",
                    border: `1px solid ${isAnonymous ? "rgba(107,114,128,.3)" : "var(--border)"}`,
                    borderRadius: 12,
                    transition: "all .2s",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 16 }}>{isAnonymous ? "🔒" : "👤"}</span>
                    <div>
                      <p
                        style={{
                          fontWeight: 700,
                          fontSize: 13,
                          color: "var(--text)",
                          fontFamily: "var(--font-b)",
                        }}
                      >
                        {isAnonymous ? "Posting Anonymously" : "Post Anonymously"}
                      </p>
                      <p style={{ fontSize: 11, color: "var(--text3)", fontFamily: "var(--font-b)" }}>
                        {isAnonymous
                          ? "Your name, profile & medical details are hidden"
                          : "Hide your identity from this post"}
                      </p>
                    </div>
                  </div>
                  {/* Toggle switch */}
                  <button
                    onClick={() => setIsAnonymous(!isAnonymous)}
                    style={{
                      width: 44,
                      height: 24,
                      borderRadius: 12,
                      border: "none",
                      cursor: "pointer",
                      background: isAnonymous ? "#6b7280" : "var(--border2)",
                      transition: "background .2s",
                      position: "relative",
                      flexShrink: 0,
                    }}
                  >
                    <div
                      style={{
                        width: 18,
                        height: 18,
                        borderRadius: "50%",
                        background: "#fff",
                        position: "absolute",
                        top: 3,
                        left: isAnonymous ? 23 : 3,
                        transition: "left .2s",
                        boxShadow: "0 1px 3px rgba(0,0,0,.2)",
                      }}
                    />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
