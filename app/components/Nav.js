"use client";
import StegaIcon from "./StegaIcon";
//import handjet from "handjet";
import { Handjet } from "next/font/google";
import { GlobalVariablesContext } from "@app/contexts/GlobalVariablesContext";
import { useContext } from "react";
import { Anton } from "next/font/google";
//import Anton font from next font
const anton = Anton({
  weight: "400",
  subsets: ["latin"],
});

const handjet = Handjet({
  weight: ["400"],
  subsets: ["latin"],
});

const Nav = ({ children }) => {
  const { presentationIsShowing } = useContext(GlobalVariablesContext);
  return (
    <div>
      {!presentationIsShowing ? (
        <div
          style={{
            backgroundColor: "white",
            height: 50,
            display: "flex",
            alignItems: "center",

            height: 50,
            paddingTop: 10,
          }}
        >
          <StegaIcon />{" "}
          <h1
            style={{
              color: "#3C5997",
              marginLeft: 20,
              fontSize: 30,
              display: "inline",
            }}
            className={handjet.className}
          >
            {"  Lesson Generator - "}
          </h1>
          <h1
            className={anton.className}
            style={{
              fontSize: 25,
              marginLeft: 10,
              color: "lightgray",
            }}
          >
            {"The Loneliest Boy In Britain"}
          </h1>
        </div>
      ) : null}
      {children}
    </div>
  );
};

export default Nav;
