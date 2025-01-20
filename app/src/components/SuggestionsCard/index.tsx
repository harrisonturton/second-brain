import { FC } from "react";
// import "./SuggestionsCard.css";

interface SuggestionsCardProps {
  title: string;
}

const SuggestionsCard: FC<SuggestionsCardProps> = ({ title }) => {
  const suggestions = ["tyre", "wheel", "seat", "brake", "pedal"];

  return (
    <div className="suggestions-card">
      <h3>{title}</h3>
      <ul className="suggestions-list">
        {suggestions.map((suggestion, index) => (
          <li key={index} className="suggestion-item">
            {suggestion}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SuggestionsCard;
