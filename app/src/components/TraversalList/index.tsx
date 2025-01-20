import { FC } from "react";
// import "./Sidebar.css";

interface TraversalListProps {
  items: {
    id: string | number;
    title: string;
  }[];
}

const TraversalList: FC<TraversalListProps> = ({ items }) => {
  return (
    <aside className="sidebar">
      <div className="sidebar-content">
        {items.map((item) => (
          <div key={item.id} className="sidebar-item">
            {item.title}
          </div>
        ))}
      </div>
    </aside>
  );
};

export default TraversalList;
