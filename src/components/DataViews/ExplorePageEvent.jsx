import { useState } from "react";

const eventTemplate = {
    id: 0,
    iconColor: "var(--clr-primary)",
    glowColor: "rgba(224,142,254,0.05)",
    icon: "rocket-launch",

}

export default function ExplorePageEvent({ data, isSaved, onToggleBookmark, onOpen }) {

    return (
        <div className="signal-card h-100">
            <div className="card-glow" style={{ background: data.glowColor }} />

            <div className="d-flex justify-content-between align-items-start mb-4">
                <div className="card-icon-wrap">
                    <span
                        className="material-symbols-outlined"
                        style={{ color: data.iconColor }}
                    >
                        {data.icon}
                    </span>
                </div>

                <button
                    className={`bookmark-btn ${isSaved ? "saved" : ""}`}
                    onClick={() => onToggleBookmark(data.id)}
                >
                    <span
                        className="material-symbols-outlined"
                        style={{
                            fontVariationSettings: isSaved ? "'FILL' 1" : "'FILL' 0",
                        }}
                    >
                        bookmark
                    </span>
                </button>
            </div>

            <h3 className="font-headline fw-bold card-title">{data.title}</h3>
            <p className="card-desc">{data.desc}</p>


            <div className="d-flex justify-content-between align-items-center card-footer-row">
                <span className="scan-time">Last Scanned:</span>
                <button className="open-signal-link" onClick={onOpen}>
                    OPEN SIGNAL
                    <span className="material-symbols-outlined">arrow_forward</span>
                </button>
            </div>

        </div>
    );
}