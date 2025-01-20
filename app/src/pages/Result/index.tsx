// import "./App.css";
import Graph from "../../components/GraphWidget";
import Sidebar from "../../components/TraversalList";
import SuggestionsCard from "../../components/SuggestionsCard";
import SessionSummary from "../../components/SessionSummaryCard";
import Sources from "../../components/SourcesCard";
import Explanation from "../../components/ExplanationCard";

function Result() {
  return (
    <div className="app-container">
      <Sidebar items={[{ id: 1, title: "Home" }]} />
      <div className="graph-and-session-summary-container">
        <div className="graph-container">
          <Graph></Graph>
        </div>
        <div className="session-summary-container">
          <SessionSummary></SessionSummary>
        </div>
      </div>
      <div className="main-content-container">
        <div className="explanation-container">
          <Explanation text="This is an explanation of the session" />
        </div>
        <div className="sources-container">
          <Sources
            links={["https://www.google.com", "https://www.youtube.com"]}
          />
        </div>
      </div>
      <div className="suggestions-container">
        <SuggestionsCard title="Suggestions" />
        <SuggestionsCard title="Suggestions" />
        <SuggestionsCard title="Suggestions" />
      </div>
      <div className="test-container">
        <a
          href="#"
          className="relative block overflow-hidden rounded-lg border border-gray-100 p-4 sm:p-6 lg:p-8"
        >
          <span className="absolute inset-x-0 bottom-0 h-2 bg-gradient-to-r from-green-300 via-blue-500 to-purple-600"></span>

          <div className="sm:flex sm:justify-between sm:gap-4">
            <div>
              <h3 className="text-lg font-bold text-gray-900 sm:text-xl">
                Building a SaaS product as a software developer
              </h3>

              <p className="mt-1 text-xs font-medium text-gray-600">
                By John Doe
              </p>
            </div>

            <div className="hidden sm:block sm:shrink-0">
              <img
                alt=""
                src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1180&q=80"
                className="size-16 rounded-lg object-cover shadow-sm"
              />
            </div>
          </div>

          <div className="mt-4">
            <p className="text-pretty text-sm text-gray-500">
              Lorem ipsum dolor sit, amet consectetur adipisicing elit. At velit
              illum provident a, ipsa maiores deleniti consectetur nobis et
              eaque.
            </p>
          </div>

          <dl className="mt-6 flex gap-4 sm:gap-6">
            <div className="flex flex-col-reverse">
              <dt className="text-sm font-medium text-gray-600">Published</dt>
              <dd className="text-xs text-gray-500">31st June, 2021</dd>
            </div>

            <div className="flex flex-col-reverse">
              <dt className="text-sm font-medium text-gray-600">
                Reading time
              </dt>
              <dd className="text-xs text-gray-500">3 minute</dd>
            </div>
          </dl>
        </a>
      </div>
    </div>
  );
}

export default Result;
