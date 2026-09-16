"use client";
import StegaIcon from "./StegaIcon";
import { Handjet } from "next/font/google";
import { useLessonStore } from "@app/stores/useLessonStore";

const handjet = Handjet({
  weight: ["400", "500"],
  subsets: ["latin"],
});

const Nav = ({ children }) => {
  const presentationIsShowing = useLessonStore((s) => s.presentationIsShowing);
  const lessonTitle = useLessonStore((s) => s.lessonTitle);

  return (
    <div>
      {!presentationIsShowing ? (
        <header style={styles.bar}>
          <div style={styles.brand}>
            <span style={styles.icon}>
              <StegaIcon />
            </span>
            <span className={handjet.className} style={styles.name}>
              Lesson Generator
            </span>
          </div>

          {lessonTitle ? (
            <div style={styles.titleWrap}>
              <span style={styles.divider} />
              <span className={handjet.className} style={styles.title}>
                {lessonTitle}
              </span>
            </div>
          ) : null}
        </header>
      ) : null}
      {children}
    </div>
  );
};

const TEAL = "#2f7d76";

const styles = {
  bar: {
    display: "flex",
    alignItems: "center",
    gap: 14,
    height: 56,
    padding: "0 24px",
    background: "#fff",
    borderBottom: "1px solid #ece9e1",
  },
  brand: { display: "flex", alignItems: "center", gap: 10 },
  icon: {
    display: "inline-flex",
    alignItems: "center",
    color: TEAL,
    width: 30,
    height: 30,
  },
  name: {
    color: TEAL,
    fontSize: 26,
    fontWeight: 500,
    letterSpacing: "0.02em",
    lineHeight: 1,
  },
  titleWrap: { display: "flex", alignItems: "center", gap: 14 },
  divider: {
    width: 1,
    height: 22,
    background: "#dcd8cf",
    display: "inline-block",
  },
  title: {
    color: "#8a857c",
    fontSize: 22,
    fontWeight: 400,
    lineHeight: 1,
  },
};

export default Nav;
