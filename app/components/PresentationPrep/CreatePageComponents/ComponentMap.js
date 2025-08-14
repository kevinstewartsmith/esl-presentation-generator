// ComponentMap.js
import {
  AdvantagesDisadvantages,
  ClassRules,
  EffortAndAttitudeScore,
  ListeningForGistAndDetail,
  ReadingForGistandDetailForm,
  WarmUpSpeaking,
  WritingEssay,
  Brainstorming,
  // SpeakingDebate,
  SpeakingPresentation,
  SpeakingRolePlay,
  SpeakingSurvey,
  WarmUpBoardRace,
} from "@app/components/PresentationPrep/CreatePageComponents/StageForms";

const ComponentMap = {
  "Class Rules": ClassRules,
  "Listening for Gist and Detail": ListeningForGistAndDetail,
  "Effort and Attitude Score": EffortAndAttitudeScore,
  "Warm-Up-Speaking": WarmUpSpeaking,
  "Reading For Gist and Detail": ReadingForGistandDetailForm,
  "Advantages - Disadvantages": AdvantagesDisadvantages,
  "Writing-Essay": WritingEssay,
  // "Speaking-Debate": SpeakingDebate,
  "Speaking-Presentation": SpeakingPresentation,
  "Speaking-Role Play": SpeakingRolePlay,
  "Speaking-Survey": SpeakingSurvey,
  "Warm-Up-Board Race": WarmUpBoardRace,
  Brainstorming: Brainstorming,
};

export default ComponentMap;
