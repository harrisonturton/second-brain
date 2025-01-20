import { FC } from "react";
// import "./Sources.css";

interface SourcesProps {
  links: string[];
}

const SourcesCard: FC<SourcesProps> = ({ links }) => {
  return (
    <div className="sources-card">
      <h3>Sources</h3>
      <ul className="sources-list">
        {links.map((link, index) => (
          <li key={index} className="source-item">
            <a href={link} target="_blank" rel="noopener noreferrer">
              {link}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SourcesCard;
