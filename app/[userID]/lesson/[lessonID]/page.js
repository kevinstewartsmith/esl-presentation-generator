"use client";
import React, { useEffect, useState, use } from "react";
import Link from "next/link";
import StageSorter from "@app/components/PresentationPrep/DragAndDropSkills/stage_sorter";
import { useLessonStore } from "@app/stores/useLessonStore";
import { loadLessons } from "@app/utils/lessonApi";
import { useStageOrderStore } from "@app/stores/useStageOrderStore";

const LessonPageComponent = ({ params }) => {
  const setCurrentLessonID = useLessonStore((s) => s.setCurrentLessonID);
  const updateLessonTitle = useLessonStore((s) => s.updateLessonTitle);
  const setHydratedItems = useStageOrderStore((s) => s.setHydratedItems);

  const resolvedParams = use(params);
  const { userID, lessonID: paramsLessonID } = resolvedParams;

  const [lesson, setLesson] = useState(null);

  useEffect(() => {
    setCurrentLessonID(paramsLessonID);
  }, [paramsLessonID]);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await loadLessons(userID, "getOneLesson", paramsLessonID);
        if (!response.ok) throw new Error("Network response was not ok");
        const data = await response.json();
        setLesson(data);
        updateLessonTitle(data.title);
      } catch (error) {
        console.error(error);
      }
    }
    fetchData();

    async function getLessonStages() {
      try {
        const response = await fetch(
          `/api/firestore/get-stage-order?userID=${userID}&lessonID=${paramsLessonID}`,
        );
        const data = await response.json();
        setHydratedItems(data);
      } catch (error) {
        console.error(error);
      }
    }
    getLessonStages();
  }, [paramsLessonID]);

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <div style={styles.headRow}>
          <div>
            <div style={styles.eyebrow}>Build a lesson</div>
            <h1 style={styles.title}>{lesson ? lesson.title : "Untitled lesson"}</h1>
            <p style={styles.sub}>
              Drag the stages you want into your lesson, in the order you&rsquo;ll
              teach them. When you&rsquo;re ready, build it out.
            </p>
          </div>
          <Link
            href={`/${userID}/create/${paramsLessonID}`}
            style={styles.cta}
          >
            Build lesson →
          </Link>
        </div>
      </header>

      <StageSorter lessonID={paramsLessonID} />
    </div>
  );
};

const styles = {
  page: {
    fontFamily: "'Inter', system-ui, sans-serif",
    color: "#1c1c1e",
    maxWidth: "min(1240px, 94vw)",
    margin: "0 auto",
    padding: "8px 4px 48px",
  },
  header: { marginBottom: "24px" },
  headRow: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: "24px",
    flexWrap: "wrap",
  },
  eyebrow: {
    fontSize: "12px",
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    color: "#2f7d76",
    fontWeight: 600,
  },
  title: {
    fontFamily: "'Fraunces', Georgia, serif",
    fontSize: "30px",
    fontWeight: 600,
    margin: "2px 0 8px",
    letterSpacing: "-0.01em",
  },
  sub: {
    fontSize: "15px",
    color: "#6f6b63",
    maxWidth: "58ch",
    lineHeight: 1.5,
    margin: 0,
  },
  cta: {
    flexShrink: 0,
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    background: "#2f7d76",
    color: "#fff",
    fontSize: "14px",
    fontWeight: 600,
    textDecoration: "none",
    padding: "10px 18px",
    borderRadius: "10px",
    marginTop: "4px",
  },
};

const page = (props) => <LessonPageComponent {...props} />;
export default page;
