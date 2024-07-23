import * as React from "react";
//next image
import Image from "next/image";
//import stega icon svg
import stegaIcon from "@public/stega-icon.svg";

const StegaIcon = (props) => (
  //
  <Image
    src={stegaIcon}
    alt="Stega Icon"
    width={60}
    height={60}
    className="pl-6"
  />
);
export default StegaIcon;
