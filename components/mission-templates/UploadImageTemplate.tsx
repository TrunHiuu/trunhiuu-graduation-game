import React, { useEffect, useState } from "react";

const OPEN_TIME = new Date("2026-05-23T13:35:00+07:00").getTime();

type UploadImageTemplateProps = {
  previewUrl?: string | null;
  onFileSelect?: (file: File | null) => void;
  isSubmitting?: boolean;
  isDisabled?: boolean;
  isSubmitted?: boolean;
  onReview?: () => void;
  onSubmit?: () => void;
};

export default function UploadImageTemplate({
  previewUrl = null,
  onFileSelect,
  isSubmitting = false,
  isDisabled = false,
  isSubmitted = false,
  onReview,
  onSubmit,
}: UploadImageTemplateProps) {
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    setNow(Date.now());
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  const isTimeLocked = now !== null && now < OPEN_TIME;
  const effectiveIsDisabled = isDisabled || isTimeLocked;

  // enable Review button when already submitted even if parent `isDisabled`.
  // Disabled when submitting, or when there's no preview and not yet submitted.
  const submitDisabled = isSubmitting || (!previewUrl && !isSubmitted) || (effectiveIsDisabled && !isSubmitted);

  const getRemainingTime = () => {
    if (now === null) return "00:00:00";
    const diff = Math.max(0, OPEN_TIME - now);
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    const timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    if (days > 0) {
      return `${days} days ${timeString}`;
    }
    return timeString;
  };

  return (
    <div
      className="bg-slate-50 border-2 border-slate-300 rounded text-slate-700 max-w-full"
      style={{
        height: "175px",
        overflowY: "auto",
        padding: "10px",
      }}
    >
      <div className="mb-2 border-b border-slate-200 pb-2 flex items-start justify-between gap-2">
        {/* header left (title) */}
        <div
          style={{
            opacity: effectiveIsDisabled ? 0.35 : 1,
            filter: effectiveIsDisabled ? "grayscale(60%) brightness(0.85)" : undefined,
            pointerEvents: effectiveIsDisabled ? "none" : "auto",
          }}
          aria-disabled={effectiveIsDisabled}
        >
          <p className="text-[13px] font-bold tracking-[1px] text-sky-800 uppercase leading-tight">Mission 4</p>
          <p className="text-[13px] font-extrabold text-slate-900 leading-tight">Photographic Finale</p>
        </div>

        {/* submitted badge (dim if disabled) */}
        {isSubmitted ? (
          <div
            style={{
              opacity: effectiveIsDisabled ? 0.35 : 1,
              filter: effectiveIsDisabled ? "grayscale(60%) brightness(0.85)" : undefined,
            }
            }
            className="text-sm font-bold text-green-700 mr-2"
            aria-disabled={effectiveIsDisabled}
          >
            SUBMITTED
          </div>
        ) : null}

        {/* main action button (Submit or Review). keep enabled for REVIEW even if submitted, but respect isDisabled/isSubmitting */}
        <button
          type="button"
          disabled={submitDisabled}
          onClick={isSubmitted ? onReview : onSubmit}
          className="disabled:cursor-not-allowed shrink-0"
          style={{
            minWidth: "80px",
            padding: "5px 10px",
            borderRadius: "5px",
            border: "1px solid",
            borderColor: "#4a8ace #0a2a6a #0a2a6a #4a8ace",
            // Use same styling for REVIEW as for SUBMIT (only label changes)
            backgroundColor: isSubmitting ? "#7aa6d3" : "#1e5aa8",
            color: "#ffffff",
            fontFamily: "Arial Black, monospace",
            fontSize: "11px",
            letterSpacing: "1px",
            boxShadow: "inset 1px 1px 0 #6aadee, inset -1px -1px 0 #000000",
            opacity: submitDisabled ? 0.6 : 1,
            lineHeight: 1,
            pointerEvents: (effectiveIsDisabled && !isSubmitted) ? "none" : "auto",
          }}
        >
          {isSubmitted ? "REVIEW" : (isSubmitting ? "SAVING" : "SUBMIT")}
        </button>
      </div>

      <p
        className="text-[13px] font-bold leading-snug text-slate-800"
        style={{
          opacity: effectiveIsDisabled ? 0.35 : 1,
          filter: effectiveIsDisabled ? "grayscale(60%) brightness(0.85)" : undefined,
          pointerEvents: effectiveIsDisabled ? "none" : "auto",
        }}
      >
        Upload a photo with me to finish the final mission.
      </p>

      {isTimeLocked && !isSubmitted ? (
        <div className="mt-2 text-center text-[11px] font-bold text-red-600 bg-red-100 border border-red-300 rounded p-1.5 shadow-inner">
          <p>Coming soon 1:16 PM (23/5/2026)</p>
          <p>Remaining {getRemainingTime()}</p>
        </div>
      ) : (
        <>
          <label
            className="mt-2 block rounded border border-dashed border-slate-300 bg-white p-2 text-center text-[13px] font-semibold"
            style={{
              opacity: effectiveIsDisabled ? 0.35 : 1,
              filter: effectiveIsDisabled ? "grayscale(60%) brightness(0.85)" : undefined,
              pointerEvents: effectiveIsDisabled ? "none" : "auto",
              cursor: effectiveIsDisabled ? 'not-allowed' : 'pointer',
              color: effectiveIsDisabled ? '#9ca3af' : undefined
            }}
            aria-disabled={effectiveIsDisabled}
          >
            <input
              type="file"
              accept="image/*"
              className="hidden"
              disabled={effectiveIsDisabled || isSubmitted}
              onChange={(event) => onFileSelect?.(event.target.files?.[0] ?? null)}
            />
            Choose an image
          </label>

          {previewUrl ? (
            <div className="mt-2 overflow-hidden rounded border border-slate-300 bg-white p-1.5">
              {/* preview stays fully visible even when card is dimmed */}
              <img src={previewUrl} alt="Upload preview" className="h-24 w-full rounded object-cover" style={{ opacity: 1 }} />
            </div>
          ) : null}
        </>
      )}
    </div>
  );
}
