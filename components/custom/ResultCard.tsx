import React from "react";
import { Button } from "../ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
  CardContent,
  CardFooter,
} from "../ui/card";
import Image from "next/image";
import { toPascalCase } from "@/lib/utils";

export type ResultCardProps = {
  category: string;
  name: string;
  image_url: string;
  description: string;
  reasoning: string;
  confidence: number;
  color: string;
};

function ResultCard(props: ResultCardProps) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl font-bold border-b pb-2 ">
          {toPascalCase(props.category)}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <CardDescription>
          <p>
            <span className="font-semibold">{props.name}</span>:{" "}
            {props.description}
          </p>
        </CardDescription>
        <CardDescription>{props.reasoning}</CardDescription>
      </CardContent>
    </Card>
  );
}

export default ResultCard;
