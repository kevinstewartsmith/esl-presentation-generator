"use client"
import React from 'react'
import {
    Presentation, Slide, Text,
    Shape, Image, render
  } from "react-pptx";
 // import fs from "fs";



export default function PresentationPreview() {
  return (
    <>
    <Presentation>
      <Slide>
        <Text style={{
          x: 3, y: 1, w: 3, h: 0.5,
          fontSize: 32
        }}>
          Hello there!
        </Text>
        <Shape
          type="rect"
          style={{
            x: 3, y: 1.55, w: 3, h: 0.1,
            backgroundColor: "#FF0000"
          }}
        />
      </Slide>
      <Slide>
        <Image
          src={{
            kind: "path",
            path: "https://picsum.photos/id/237/460/300"
          }}
          style={{
            x: "10%", y: "10%", w: "80%", h: "80%"
          }}
        />
      </Slide>
    </Presentation>
    </>
  )
}

