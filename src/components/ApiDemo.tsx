"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { ArrowRight, Play } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const defaultRequest = {
  method: "POST",
  url: "https://git-insight.vercel.app/api/git-insight",
  headers: {
    "Content-Type": "application/json",
    "x-api-key": "your-api-key-here",
  },
  body: {
    githubUrl: "https://github.com/vercel/next.js",
  },
};

const defaultResponse = {
  summary: "Next.js is a React framework for production-grade applications...",
  cool_facts: [
    "Used by some of the world's largest companies",
    "Supports both static and server-side rendering",
    "Has built-in performance optimizations",
  ],
};

export function ApiDemo() {
  const [request, setRequest] = useState(
    JSON.stringify(defaultRequest, null, 2)
  );
  const [response, setResponse] = useState(
    JSON.stringify(defaultResponse, null, 2)
  );
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleRequestChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setRequest(e.target.value);
    try {
      JSON.parse(e.target.value);
    } catch (error) {
      console.error(error);
      setResponse(JSON.stringify({ error: "Invalid JSON request" }, null, 2));
    }
  };

  const handleTryApi = async () => {
    try {
      setIsLoading(true);
      const parsedRequest = JSON.parse(request);

      const apiResponse = await fetch("/api/git-insight", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": parsedRequest.headers["x-api-key"],
        },
        body: JSON.stringify(parsedRequest.body),
      });

      const data = await apiResponse.json();

      if (!apiResponse.ok) {
        throw new Error(data.error || "Failed to fetch response");
      }

      setResponse(JSON.stringify(data, null, 2));
      toast({
        title: "Success",
        description: "API request completed successfully",
      });
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to call API",
      });
      setResponse(
        JSON.stringify(
          {
            error:
              error instanceof Error ? error.message : "Failed to call API",
          },
          null,
          2
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Request</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={request}
            onChange={handleRequestChange}
            className="min-h-[300px] bg-gray-900 text-gray-300 font-mono"
          />
        </CardContent>
        <CardFooter className="justify-end space-x-2">
          <Button
            variant="default"
            onClick={handleTryApi}
            disabled={isLoading}
            className="bg-indigo-600 hover:bg-indigo-700"
          >
            <Play className="mr-2 h-4 w-4" />
            {isLoading ? "Processing..." : "Try it"}
          </Button>
        </CardFooter>
      </Card>

      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Response</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={response}
            readOnly
            className="min-h-[300px] bg-gray-900 text-gray-300 font-mono"
          />
        </CardContent>
        <CardFooter className="justify-end">
          <Button variant="outline" asChild>
            <Link href="/docs">
              Documentation
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
