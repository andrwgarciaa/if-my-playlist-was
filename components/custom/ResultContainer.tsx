import React from "react";
import ResultCard, { ResultCardProps } from "./ResultCard";
import { Button } from "../ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

type ResultContainerProps = {
  mood: string[];
  genre: string[];
  matches: ResultCardProps[];
};

function ResultContainer(props: ResultContainerProps) {
  return (
    <section className="space-y-4">
      <div className="mb-8">
        {props.genre && <h2>Genre: {props.genre}</h2>}
        {props.mood && <h3>Mood: {props.mood}</h3>}
      </div>
      <div className="grid lg:grid-cols-4 gap-4">
        {props.matches &&
          props.matches
            .sort((a, b) => a.category.localeCompare(b.category))
            .map((match: ResultCardProps) => (
              <ResultCard key={match.category} {...match} color="blue" />
            ))}
      </div>
      <Link href={"/"} className="">
        <Button variant="outline" className="w-full">
          <ArrowLeft />
          Back
        </Button>
      </Link>
    </section>
  );
}

export default ResultContainer;
