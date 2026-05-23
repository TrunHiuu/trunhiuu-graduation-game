"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import PixelWindow from "@/components/PixelWindow";
import ConfirmationModal from "@/components/ConfirmationModal";
import { User } from "@/types/invite";
import { CalendarIcon, ClockIcon, MapPinIcon } from '@heroicons/react/24/solid';
import { TShirt } from 'phosphor-react';
import QuizTemplate from "@/components/mission-templates/QuizTemplate";
import WishCraftingTemplate from "@/components/mission-templates/WishCraftingTemplate";
import UploadImageTemplate from "@/components/mission-templates/UploadImageTemplate";
import ImageReviewModal from "@/components/ImageReviewModal";
import { buildMissionTemplates, type MissionQuizAssignment } from "@/components/mission-templates/missionContent";

type Props = {
  user: User;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  scores: Record<number, { score: number; completed: boolean; completed_at?: string | null }>;
  setScores: React.Dispatch<React.SetStateAction<Record<number, { score: number; completed: boolean; completed_at?: string | null }>>>;
};

const MISSION_4_OPEN_TIME = new Date("2026-05-23T13:28:00+07:00").getTime();

export default function MissionWindow({ user, setUser, scores, setScores }: Props) {
  const router = useRouter();
  const [attendanceStatusCode, setAttendanceStatusCode] = useState<"waiting" | "confirmed" | "declined">(
    user.attendance_status?.code ?? "waiting"
  );
  const [denyPressed, setDenyPressed] = useState(false);
  const [confirmPressed, setConfirmPressed] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [missionIndex, setMissionIndex] = useState(0);
  const [wishText, setWishText] = useState("");
  const [mission3Submitted, setMission3Submitted] = useState(false);
  const [mission4Submitted, setMission4Submitted] = useState(false);
  const [uploadPreviewUrl, setUploadPreviewUrl] = useState<string | null>(null);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [selectedQuizOptionByMission, setSelectedQuizOptionByMission] = useState<Record<number, number | null>>({});
  const [quizAssignments, setQuizAssignments] = useState<MissionQuizAssignment[]>([]);
  // scores now lifted to parent via props.scores
  const [missionsLoading, setMissionsLoading] = useState(true);
  const [activeDialog, setActiveDialog] = useState<
    | { kind: "attendance"; action: "deny" | "confirm" }
    | { kind: "quizSubmit"; missionId: number; missionTitle: string; selectedOptionIndex: number; selectedOptionLabel: string }
    | { kind: "missionSubmit"; missionId: 3 | 4; missionTitle: string }
    | null
  >(null);

  useEffect(() => {
    setAttendanceStatusCode(user.attendance_status?.code ?? "waiting");
  }, [user.attendance_status?.code]);

  useEffect(() => {
    let isMounted = true;

    async function loadMission3Submission() {
      try {
        const response = await fetch(`/api/invite/mission3?userId=${encodeURIComponent(user.id)}`);

        if (!response.ok) {
          throw new Error("Failed to load mission 3 submission");
        }

        const data = await response.json() as {
          submission?: { answer?: string | null; submitted_at?: string | null } | null;
          isSubmitted?: boolean;
        };

        if (!isMounted) {
          return;
        }

        const savedAnswer = data.submission?.answer ?? "";
        setWishText(savedAnswer);
        setMission3Submitted(Boolean(data.isSubmitted && savedAnswer));
      } catch (error) {
        console.error("Failed to load mission 3 submission:", error);
      }
    }

    async function loadMission4Submission() {
      try {
        const resp = await fetch(`/api/invite/mission4?userId=${encodeURIComponent(user.id)}`);
        if (!resp.ok) throw new Error("Failed to load mission 4 submission");
        const json = await resp.json() as { imageUrl?: string | null; submittedAt?: string | null };
        if (!isMounted) return;
        if (json.imageUrl) {
          setUploadPreviewUrl(json.imageUrl);
          setMission4Submitted(true);
        }
      } catch (err) {
        console.error("Failed to load mission 4 submission:", err);
      }
    }

    async function loadMissionQuizzes() {
      try {
        setMissionsLoading(true);

        const response = await fetch(`/api/invite/missions?userId=${encodeURIComponent(user.id)}`);

        if (!response.ok) {
          throw new Error("Failed to load mission quizzes");
        }

        const data = await response.json() as { missions?: MissionQuizAssignment[]; scores?: { mission_id: number; score: number; completed: boolean; completed_at?: string | null }[] };

        if (!isMounted) {
          return;
        }

        const loadedAssignments = data.missions ?? [];
        setQuizAssignments(loadedAssignments);
        const scoresArr = data.scores ?? [];
        const scoresMap: Record<number, { score: number; completed: boolean; completed_at?: string | null }> = {};
        for (const s of scoresArr) {
          scoresMap[s.mission_id] = { score: s.score, completed: Boolean(s.completed), completed_at: s.completed_at ?? null };
        }
        setScores(scoresMap);
        setSelectedQuizOptionByMission(
          loadedAssignments.reduce<Record<number, number | null>>((accumulator, assignment) => {
            let selectedIndex: number | null = null;

            if (assignment.user_option) {
              const index = ["A", "B", "C", "D"].indexOf(assignment.user_option);
              selectedIndex = index >= 0 ? index : null;
            }

            accumulator[assignment.mission_id] = selectedIndex;
            return accumulator;
          }, {}),
        );
      } catch (error) {
        console.error("Failed to load mission quizzes:", error);
      } finally {
        if (isMounted) {
          setMissionsLoading(false);
        }
      }
    }

    loadMission3Submission();
    loadMission4Submission();
    loadMissionQuizzes();

    return () => {
      isMounted = false;
    };
  }, [user.id]);

  const canRespond = attendanceStatusCode === "waiting";
  const canWorkOnQuizCards = attendanceStatusCode === "confirmed";
  const mission3IsLocked = !canWorkOnQuizCards || mission3Submitted;
  // Lock mission 4 when attendance is not confirmed.
  // If an image already exists in DB, the card should also render as locked/dimmed,
  // while REVIEW remains clickable for submitted entries.
  const mission4IsLocked = !canWorkOnQuizCards;
  // enforce order: mission3 requires mission2 completed; mission4 requires mission3 completed
  const mission2Completed = Boolean(scores[2]?.completed);
  const mission3Completed = Boolean(scores[3]?.completed);
  const mission1Completed = Boolean(scores[1]?.completed);
  const mission3LockedFinal = mission3IsLocked || !mission2Completed;
  const mission4LockedFinal = mission4IsLocked || !mission3Completed;

  const closeConfirmation = () => setActiveDialog(null);

  const handleConfirmation = async () => {
    if (!activeDialog) {
      return;
    }

    try {
      setIsSaving(true);

      if (activeDialog.kind === "attendance") {
        const statusCode = activeDialog.action === "deny" ? "declined" : "confirmed";

        const response = await fetch("/api/invite", {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: user.id,
            statusCode,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => null);
          throw new Error(errorData?.error || "Failed to update attendance status");
        }

        setAttendanceStatusCode(statusCode as "confirmed" | "declined");
        // update parent user so PlayerWindow header updates immediately
        setUser((u) => u ? { ...u, attendance_status: { id: u.attendance_status?.id ?? 0, code: statusCode as any, label: statusCode === 'confirmed' ? 'Confirmed' : statusCode === 'declined' ? 'Declined' : 'Waiting' } } : u);
        closeConfirmation();
        return;
      }

      if (activeDialog.kind === "missionSubmit") {
        if (activeDialog.missionId === 3) {
          const response = await fetch("/api/invite/mission3", {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              userId: user.id,
              answer: wishText,
            }),
          });

          if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            throw new Error(errorData?.error || "Failed to save mission 3 answer");
          }

          setMission3Submitted(true);
          // update lifted scores state so Player and Mission reflect completion immediately
          setScores((cur) => ({
            ...cur,
            3: { score: 1, completed: true, completed_at: new Date().toISOString() },
          }));
          closeConfirmation();
          return;
          return;
        }
        if (activeDialog.missionId === 4) {
          // upload file via POST /api/invite/mission4 (form-data)
          if (!uploadFile) {
            throw new Error("No file selected");
          }

          const fd = new FormData();
          fd.append("userId", user.id);
          fd.append("file", uploadFile);

          const resp = await fetch("/api/invite/mission4", {
            method: "POST",
            body: fd,
          });

          if (!resp.ok) {
            const errorData = await resp.json().catch(() => null);
            throw new Error(errorData?.error || "Failed to upload mission 4 image");
          }

          const result = await resp.json().catch(() => ({}));
          const imageUrl = result?.imageUrl ?? null;

            if (imageUrl) {
              setUploadPreviewUrl(imageUrl);
              setMission4Submitted(true);
              // update lifted scores state so Player and Mission reflect completion immediately
              setScores((cur) => ({
                ...cur,
                4: { score: 1, completed: true, completed_at: new Date().toISOString() },
              }));
            }

            closeConfirmation();
            return;
        }

        closeConfirmation();
        return;
      }

      if (activeDialog.kind !== "quizSubmit") {
        // unexpected dialog kind — bail out safely
        closeConfirmation();
        return;
      }

      // capture dialog values into locals before any await to keep type narrowing
      const dialog = activeDialog as { kind: "quizSubmit"; missionId: number; missionTitle: string; selectedOptionIndex: number; selectedOptionLabel: string };
      const missionIdForSubmit = dialog.missionId;
      const optionIndexForSubmit = dialog.selectedOptionIndex;

      const response = await fetch("/api/invite/missions", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,
          missionId: missionIdForSubmit,
          optionIndex: optionIndexForSubmit,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.error || "Failed to save quiz answer");
      }

      const submittedOption = (["A", "B", "C", "D"] as const)[optionIndexForSubmit];
      // update local quiz assignment state
      setQuizAssignments((current) =>
        current.map((assignment) =>
          assignment.mission_id === missionIdForSubmit
            ? {
                ...assignment,
                user_option: submittedOption,
              }
            : assignment,
        ),
      );

        // compute correctness client-side and update lifted scores state so next mission unlocks immediately
      try {
        const currentMission = missionTemplates.find((m) => (m as any).missionId === missionIdForSubmit) as { missionId: number; correctOptionIndex?: number } | undefined;
        const correctIndex = currentMission?.correctOptionIndex ?? null;
        const isCorrect = correctIndex !== null && correctIndex === optionIndexForSubmit;
        setScores((cur) => ({
          ...cur,
          [activeDialog.missionId]: { score: isCorrect ? 1 : 0, completed: true, completed_at: new Date().toISOString() },
        }));
      } catch (e) {
        // non-fatal
        console.error("Failed to update local score state:", e);
      }

      setSelectedQuizOptionByMission((current) => ({
        ...current,
        [missionIdForSubmit]: optionIndexForSubmit,
      }));
      closeConfirmation();
    } catch (error) {
      console.error("Failed to save action:", error);
      closeConfirmation();
    } finally {
      setIsSaving(false);
    }
  };

  const confirmationTitle = activeDialog?.kind === "quizSubmit"
    ? "SUBMIT QUIZ ANSWER"
    : activeDialog?.kind === "missionSubmit"
      ? `SUBMIT ${activeDialog.missionTitle.toUpperCase()}`
    : activeDialog?.action === "deny"
      ? "DECLINE ATTENDANCE"
      : "CONFIRM ATTENDANCE";
  const confirmationMessage =
    activeDialog?.kind === "quizSubmit"
      ? `Submit option ${String.fromCharCode(65 + activeDialog.selectedOptionIndex)}: ${activeDialog.selectedOptionLabel}?`
      : activeDialog?.kind === "missionSubmit"
        ? `Are you sure you want to submit ${activeDialog.missionTitle}?`
      : activeDialog?.action === "deny"
        ? "Are you sure you want to decline attendance?"
        : "Are you sure you want to confirm attendance?";
  const missionTemplates = buildMissionTemplates(user, quizAssignments);

  const currentMission = missionTemplates[missionIndex];

  const goPreviousMission = () => {
    setMissionIndex((current) => Math.max(0, current - 1));
  };

  const goNextMission = () => {
    setMissionIndex((current) => Math.min(missionTemplates.length - 1, current + 1));
  };

  const handleUploadFile = (file: File | null) => {
    setUploadPreviewUrl((currentUrl) => {
      if (currentUrl?.startsWith("blob:")) {
        URL.revokeObjectURL(currentUrl);
      }

      return file ? URL.createObjectURL(file) : null;
    });
    setUploadFile(file);
  };

  const renderMissionContent = () => {
    if (currentMission.kind === "quiz") {
      const selectedOptionIndex = currentMission.isSubmitted
        ? currentMission.selectedOptionIndex
        : selectedQuizOptionByMission[currentMission.missionId] ?? currentMission.selectedOptionIndex;
      const quizIsLocked = !canWorkOnQuizCards || currentMission.isSubmitted || missionsLoading || !currentMission.isLoaded || (currentMission.missionId === 2 && !Boolean(scores[1]?.completed));

      return (
        <QuizTemplate
          missionBadge={currentMission.missionBadge}
          missionTitle={currentMission.missionTitle}
          question={currentMission.question}
          options={currentMission.options}
          selectedOptionIndex={selectedOptionIndex}
          correctOptionIndex={currentMission.correctOptionIndex}
          isLoading={missionsLoading || !currentMission.isLoaded}
          isSubmitting={isSaving && activeDialog?.kind === "quizSubmit" && activeDialog.missionId === currentMission.missionId}
          isDisabled={quizIsLocked}
          isSubmitted={currentMission.isSubmitted}
          onSelectOption={(optionIndex) => {
            if (quizIsLocked) {
              return;
            }

            setSelectedQuizOptionByMission((current) => ({
              ...current,
              [currentMission.missionId]: optionIndex,
            }));
          }}
          onSubmit={() => {
            if (quizIsLocked) {
              return;
            }

            const currentSelection = selectedQuizOptionByMission[currentMission.missionId] ?? currentMission.selectedOptionIndex;

            if (currentSelection === null || currentSelection === undefined) {
              return;
            }

            setActiveDialog({
              kind: "quizSubmit",
              missionId: currentMission.missionId,
              missionTitle: currentMission.missionTitle,
              selectedOptionIndex: currentSelection,
              selectedOptionLabel: currentMission.options[currentSelection],
            });
          }}
        />
      );
    }

    if (currentMission.kind === "wish") {
      return (
        <WishCraftingTemplate
          wish={wishText}
          onWishChange={setWishText}
          isSubmitting={isSaving && activeDialog?.kind === "missionSubmit" && activeDialog.missionId === 3}
          isDisabled={mission3LockedFinal}
          isSubmitted={mission3Submitted}
          onSubmit={() => {
            if (mission3LockedFinal || !wishText.trim()) {
              return;
            }

            setActiveDialog({
              kind: "missionSubmit",
              missionId: 3,
              missionTitle: "Mission 3",
            });
          }}
        />
      );
    }

    return (
      <UploadImageTemplate
        previewUrl={uploadPreviewUrl}
        onFileSelect={handleUploadFile}
        isSubmitting={isSaving && activeDialog?.kind === "missionSubmit" && activeDialog.missionId === 4}
        isDisabled={mission4LockedFinal || mission4Submitted}
        isSubmitted={mission4Submitted}
        onReview={() => setReviewOpen(true)}
        onSubmit={() => {
          if (mission4LockedFinal || !uploadPreviewUrl || Date.now() < MISSION_4_OPEN_TIME) {
            return;
          }

          setActiveDialog({
            kind: "missionSubmit",
            missionId: 4,
            missionTitle: "Photographic Finale:",
          });
        }}
      />
    );
  };

  return (
    <PixelWindow title="Mission.exe" width="100%" height="100%" titleBarColor="#0066CC" contentBg="#ffffff">
      <div className="space-y-2 text-gray-700 w-full h-full leading-snug" style={{ fontFamily: 'var(--font-roboto)' }}>
        <div className="mb-3">
          <p style={{ color: "#97871f" }} className="text-2xl font-extrabold">
            <span className="welcome-player-label">Welcome player</span>{' '}
            <span className="animated-nickname">{user.nickname || user.name}</span>
          </p>
        </div>

        <p style={{ fontSize: "13px" }} className="text-sm font-bold leading-snug">
          You are invited to join the <span style={{ color: "#ec4899", fontWeight: 700 }}>TrunHiuu Graduation Ceremony</span> - and the opening of the last round of the game.
        </p>

        <p style={{ fontSize: "13px" }} className="text-sm font-bold leading-snug">
          <span className="text-gray-700">4th Round - </span>
          <span style={{ color: "#ec4899", fontWeight: 700 }}>Photographic Finale</span>
        </p>

        <p style={{ fontSize: "13px" }} className="text-sm font-bold leading-snug">
          It would mean a lot to have you there and share this special moment with me.
        </p>

        {/* Location + Character */}
        <div className="grid grid-cols-1 sm:grid-cols-3 items-center gap-0 mt-2">
          <div className="sm:col-span-2">
            <div className="bg-slate-50 border-2 p-3 rounded text-slate-700 max-w-full animated-info-box">
              <p style={{ fontSize: '13px' }} className="font-bold flex items-center">
                <CalendarIcon className="w-4 h-4 mr-2 text-sky-800" />
                <span className="text-sky-800">Date:</span><span className="ml-2">09/06/2026</span>
              </p>
              <p style={{ fontSize: '13px' }} className="font-bold flex items-center">
                <ClockIcon className="w-4 h-4 mr-2 text-indigo-700" />
                <span className="text-indigo-700">Time:</span><span className="ml-2">4:45 - 5:30 PM</span>
              </p>
              <p style={{ fontSize: '13px' }} className="font-bold flex items-center">
                <MapPinIcon className="w-4 h-4 mr-2 text-red-700" />
                <span className="text-red-700">Location:</span>
                <a href="https://www.google.com/maps/place/Tr%C6%B0%E1%BB%9Dng+%C4%90%E1%BA%A1i+h%E1%BB%8Dc+C%C3%B4ng+ngh%E1%BB%97+Th%C3%B4ng+tin+-+%C4%90HQG+TP.HCM/@10.8700142,106.8004792,17z/data=!4m14!1m7!3m6!1s0x317527587e9ad5bf:0xafa66f9c8be3c91!2zVHLGsOG7nW5nIMSQ4bqhaSBo4buNYyBDw7RuZyBuZ2jhu4cgVGjDtG5nIHRpbiAtIMSQSFFHIFRQLkhDTQ!8m2!3d10.8700089!4d106.8030541!16s%2Fm%2F02qqlmm!3m5!1s0x317527587e9ad5bf:0xafa66f9c8be3c91!8m2!3d10.8700089!4d106.8030541!16s%2Fm%2F02qqlmm?entry=ttu&g_ep=EgoyMDI2MDUxMy4wIKXMDSoASAFQAw%3D%3D" target="_blank" rel="noreferrer" className="text-blue-700 underline ml-2">
                  University of Information Technology
                </a>
              </p>
              <p style={{ fontSize: '13px' }} className="font-bold flex items-center">
                <TShirt size={16} weight="regular" className="mr-2 text-amber-700" />
                <span className="text-amber-700">Dresscode:</span><span className="ml-2">Just be yourself</span>
              </p>
            </div>

            <div className="flex w-full justify-center mt-3">
              <div className="inline-flex w-fit max-w-full justify-center gap-2" style={{ padding: "2px", backgroundColor: "#9abacc", border: "1px solid", borderColor: "#d0e0f0 #404060 #404060 #d0e0f0", boxShadow: "inset 1px 1px 0 #e0f0ff, inset -1px -1px 0 #303050" }}>
              <button
                type="button"
                onMouseDown={() => setDenyPressed(true)}
                onMouseUp={() => setDenyPressed(false)}
                onMouseLeave={() => setDenyPressed(false)}
                onClick={() => canRespond && setActiveDialog({ kind: "attendance", action: "deny" })}
                disabled={!canRespond || isSaving}
                className="inline-flex items-center justify-center"
                style={{
                  backgroundColor: denyPressed ? "#d4d4d4" : "#e6e6e6",
                  border: "2px solid",
                  borderColor: denyPressed ? "#505050 #ffffff #ffffff #505050" : "#ffffff #505050 #505050 #ffffff",
                  padding: "5px 6px",
                  fontFamily: "Arial Black, monospace",
                  fontSize: "10px",
                  fontWeight: 900,
                  color: "#333333",
                  textAlign: "center",
                  letterSpacing: "1px",
                  textShadow: "1px 1px 0 #ffffff",
                  outline: "none",
                  boxShadow: denyPressed ? "inset 1px 1px 0 #a0a0a0, inset -1px -1px 0 #ffffff" : "inset 1px 1px 0 #ffffff, inset -1px -1px 0 #a0a0a0",
                  minWidth: "68px",
                  minHeight: "28px",
                  transform: denyPressed ? "scale(0.98)" : "scale(1)",
                  transition: "all 0.05s ease-out",
                  borderRadius: "4px",
                  opacity: canRespond && !isSaving ? 1 : 0.55,
                  cursor: canRespond && !isSaving ? "pointer" : "not-allowed"
                }}
              >
                Deny
              </button>
              <button
                type="button"
                onMouseDown={() => setConfirmPressed(true)}
                onMouseUp={() => setConfirmPressed(false)}
                onMouseLeave={() => setConfirmPressed(false)}
                onClick={() => canRespond && setActiveDialog({ kind: "attendance", action: "confirm" })}
                disabled={!canRespond || isSaving}
                className="inline-flex items-center justify-center"
                style={{
                  backgroundColor: confirmPressed ? "#165295" : "#1e5aa8",
                  border: "2px solid",
                  borderColor: confirmPressed ? "#0a2a6a #4a8ace #4a8ace #0a2a6a" : "#4a8ace #0a2a6a #0a2a6a #4a8ace",
                  padding: "5px 6px",
                  fontFamily: "Arial Black, monospace",
                  fontSize: "10px",
                  fontWeight: 900,
                  color: "#ffffff",
                  textAlign: "center",
                  letterSpacing: "1px",
                  textShadow: "1px 1px 0 #000000",
                  outline: "none",
                  boxShadow: confirmPressed ? "inset -1px -1px 0 #4a8ace, inset 1px 1px 0 #000000" : "inset 1px 1px 0 #6aadee, inset -1px -1px 0 #000000",
                  minWidth: "68px",
                  minHeight: "28px",
                  transform: confirmPressed ? "scale(0.98)" : "scale(1)",
                  transition: "all 0.05s ease-out",
                  borderRadius: "4px",
                  opacity: canRespond && !isSaving ? 1 : 0.55,
                  cursor: canRespond && !isSaving ? "pointer" : "not-allowed"
                }}
              >
                Confirm
              </button>
              </div>
            </div>
          </div>

          <div className="sm:col-span-1 flex justify-center items-center">
            <div className="w-56 mx-auto">
              <Image src="/Character_mission-removebg-preview.png" alt="Character" width={220} height={300} className="img-safe object-contain" />
            </div>
          </div>
        </div>

        <div className="my-4 h-px w-full bg-gradient-to-r from-transparent via-slate-400/60 to-transparent opacity-70" />

        <div className="flex items-stretch gap-2">
          <button
            type="button"
            onClick={goPreviousMission}
            disabled={missionIndex === 0}
              className="inline-flex items-center justify-center shrink-0 self-center"
            style={{
                width: "34px",
                height: "34px",
                minHeight: "34px",
                padding: 0,
              border: "2px solid",
              borderColor: "#4a8ace #0a2a6a #0a2a6a #4a8ace",
              backgroundColor: missionIndex === 0 ? "#8ab2d7" : "#1e5aa8",
              color: "#ffffff",
              fontFamily: "Arial Black, monospace",
              fontSize: "16px",
              fontWeight: 900,
              boxShadow: "inset 1px 1px 0 #6aadee, inset -1px -1px 0 #000000",
              borderRadius: "4px",
              opacity: missionIndex === 0 ? 0.6 : 1,
              cursor: missionIndex === 0 ? "not-allowed" : "pointer",
            }}
          >
            &lt;
          </button>

          <div className="flex-1 min-w-0">
            {renderMissionContent()}
          </div>

          <button
            type="button"
            onClick={goNextMission}
            disabled={missionIndex === missionTemplates.length - 1}
              className="inline-flex items-center justify-center shrink-0 self-center"
            style={{
                width: "34px",
                height: "34px",
                minHeight: "34px",
                padding: 0,
              border: "2px solid",
              borderColor: "#4a8ace #0a2a6a #0a2a6a #4a8ace",
              backgroundColor: missionIndex === missionTemplates.length - 1 ? "#8ab2d7" : "#1e5aa8",
              color: "#ffffff",
              fontFamily: "Arial Black, monospace",
              fontSize: "16px",
              fontWeight: 900,
              boxShadow: "inset 1px 1px 0 #6aadee, inset -1px -1px 0 #000000",
              borderRadius: "4px",
              opacity: missionIndex === missionTemplates.length - 1 ? 0.6 : 1,
              cursor: missionIndex === missionTemplates.length - 1 ? "not-allowed" : "pointer",
            }}
          >
            &gt;
          </button>
        </div>
      </div>

      <ConfirmationModal
        open={activeDialog !== null}
        title={confirmationTitle}
        message={confirmationMessage}
        cancelText="Cancel"
        confirmText={isSaving ? "Saving" : "OK"}
        onCancel={closeConfirmation}
        onConfirm={handleConfirmation}
      />

      <ImageReviewModal open={reviewOpen} imageUrl={uploadPreviewUrl} onClose={() => setReviewOpen(false)} />

      <style jsx>{`
        .animated-nickname {
          display: inline-block;
          font-weight: 900;
          color: #ec4899; /* rose */
          animation: nicknamePulse 3s ease-in-out infinite;
        }

        .welcome-player-label {
          color: #346cb6;
        }

        /* subtle pulse + lift, no color cycling */
        @keyframes nicknamePulse {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-3px) scale(1.03); }
        }

        /* ensure Next/Image keeps aspect ratio inside wrapper */
        .img-safe {
          width: auto;
          height: auto;
          max-width: 100%;
          max-height: 100%;
          display: block;
        }

        .animated-info-box {
          border-color: #cbd5e1;
          animation: infoBoxPulse 2.5s infinite ease-in-out;
        }

        @keyframes infoBoxPulse {
          0%, 100% {
            border-color: #cbd5e1;
            box-shadow: 0 0 0px transparent, inset 0 0 0px transparent;
          }
          50% {
            border-color: #ec4899;
            box-shadow: 0 0 10px rgba(236, 72, 153, 0.4), inset 0 0 6px rgba(236, 72, 153, 0.1);
          }
        }
      `}</style>
    </PixelWindow>
  );
}
