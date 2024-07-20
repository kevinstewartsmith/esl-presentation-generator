import React from "react";

const PartnerDiscussionSection = ({ slider }) => {
  return (
    <>
      <section>
        <h1>Partner Discussion</h1>
        <ul>
          <li>Discuss with your partner</li>
          <li></li>
          <li></li>
          <li>{slider.value + " minutes"}</li>
        </ul>
      </section>
    </>
  );
};

export default PartnerDiscussionSection;
