// ComponentMap.js util
// import
//   AdvantagesDisadvantages,
//   ClassRules,
//   EffortAndAttitudeScore,
//   ListeningForGistAndDetail,
//   ReadingForGistAndDetail,
//   WarmUpSpeaking,
//   WritingEssay,
//   Brainstorming,
//   SpeakingDebate,
//   SpeakingPresentation,
//   SpeakingRolePlay,
//   SpeakingSurvey,
//   WarmUpBoardRace,
//  from "@app/components/PresentationPrep/CreatePageComponents/StageForms";
import ClassRules from "@app/components/PresentationPrep/CreatePageComponents/StageForms/ClassRules";
import ListeningForGistAndDetail from "@app/components/PresentationPrep/CreatePageComponents/StageForms/ListeningForGistAndDetail";
import EffortAndAttitudeScore from "@app/components/PresentationPrep/CreatePageComponents/StageForms/EffortAndAttitudeScore";
import WarmUpSpeaking from "@app/components/PresentationPrep/CreatePageComponents/StageForms/WarmUpSpeaking";
import ReadingForGistandDetailForm from "@app/components/PresentationPrep/CreatePageComponents/StageForms/ReadingForGistandDetailForm";
import AdvantagesDisadvantages from "@app/components/PresentationPrep/CreatePageComponents/StageForms/AdvantagesDisadvantages";
import WritingEssay from "@app/components/PresentationPrep/CreatePageComponents/StageForms/WritingEssay";
import SpeakingDebate from "@app/components/PresentationPrep/CreatePageComponents/StageForms/SpeakingDebate";
import SpeakingPresentation from "@app/components/PresentationPrep/CreatePageComponents/StageForms/SpeakingPresentation";
import SpeakingRolePlay from "@app/components/PresentationPrep/CreatePageComponents/StageForms/SpeakingRolePlay";
import SpeakingSurvey from "@app/components/PresentationPrep/CreatePageComponents/StageForms/SpeakingSurvey";
import WarmUpBoardRace from "@app/components/PresentationPrep/CreatePageComponents/StageForms/WarmUpBoardRace";
import Brainstorming from "@app/components/PresentationPrep/CreatePageComponents/StageForms/Brainstorming";
import ThinkPairShare from "@app/components/PresentationPrep/CreatePageComponents/StageForms/ThinkPairShare";
import StartPresentation from "@app/components/PresentationPrep/CreatePageComponents/StartPresentation";

const ComponentMap = {
  "Class Rules": ClassRules,
  "Listening for Gist and Detail": ListeningForGistAndDetail,
  "Effort and Attitude Score": EffortAndAttitudeScore,
  "Warm-Up: Speaking": WarmUpSpeaking,
  "Reading For Gist and Detail": ReadingForGistandDetailForm,
  "Advantages - Disadvantages": AdvantagesDisadvantages,
  "Writing: Essay": WritingEssay,
  "Speaking: Debate": SpeakingDebate,
  "Speaking: Presentation": SpeakingPresentation,
  "Speaking: Role Play": SpeakingRolePlay,
  "Speaking: Survey": SpeakingSurvey,
  "Warm-Up: Board Race": WarmUpBoardRace,
  Brainstorming: Brainstorming,
  "Think - Pair - Share": ThinkPairShare,
  Vocabulary: null,
  "Start Presentation": StartPresentation,
};

export default ComponentMap;
