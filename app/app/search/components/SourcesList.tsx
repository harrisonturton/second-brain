import {Source} from "@/app/search/types";

interface SourcesListProps {
    sources: Source[];
}

export default function SourcesList({ sources }: SourcesListProps) {
    return (
        <div className="h-full w-full">
            <div className="h-full w-full">
                <ul className="list bg-base-100 rounded-box shadow-md h-full w-full overflow-y-auto">
                    <li className="p-4 pb-2 text-xs opacity-60 tracking-wide">Sources</li>
                    {sources.map((s, index) => (
                        <li key={index} className="list-row">
                            <div>
                                <div>{s.Title}</div>
                                <a className="link link-primary">{s.Link}</a>
                            </div>
                            <p className="list-col-wrap text-xs">
                                {s.Preview}
                            </p>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}