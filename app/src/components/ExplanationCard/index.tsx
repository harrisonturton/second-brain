import { FC } from "react";
// import "./Explanation.css";

interface ExplanationProps {
  text: string;
}

const ExplanationCard: FC<ExplanationProps> = ({ text }) => {
  return (
    <div className="explanation-card">
      <p>{text}</p>
    </div>
  );
};

export default ExplanationCard;
