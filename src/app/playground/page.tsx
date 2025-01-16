"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Code } from "@/components/ui/code";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { useState } from "react";

type AnalysisResult = {
  repository: {
    owner: string;
    repo: string;
    url: string;
    stats: {
      stars: number;
      forks: number;
      watchers: number;
    };
    contributors: Array<{
      login: string;
      contributions: number;
    }>;
    latestRelease?: {
      name: string;
      tag_name: string;
      published_at: string;
    };
  };
  summary?: string;
  mainFeatures?: string[];
  technicalComplexity?: string;
  recommendedAudience?: string;
};

export default function PlaygroundPage() {
  const [validationApiKey, setValidationApiKey] = useState("");
  const [analysisApiKey, setAnalysisApiKey] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isValidatingKey, setIsValidatingKey] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(
    null
  );
  const { toast } = useToast();

  const handleValidateKey = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsValidatingKey(true);

    try {
      const response = await fetch("/api/validate-key", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ apiKey: validationApiKey }),
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "API key is valid.",
          className: "bg-green-500 text-white",
        });
      } else {
        toast({
          title: "Error",
          description: "Invalid API key. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsValidatingKey(false);
    }
  };

  const handleAnalyzeRepo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!githubUrl || !analysisApiKey) {
      toast({
        title: "Error",
        description: "Please enter both GitHub URL and API key",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/git-insight", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": analysisApiKey,
        },
        body: JSON.stringify({ githubUrl }),
      });

      if (!response.ok) {
        throw new Error("Failed to analyze repository");
      }

      const data = await response.json();
      setAnalysisResult(data);
      toast({
        title: "Success",
        description: "Repository analysis completed",
        className: "bg-green-500 text-white",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to analyze repository. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">API Playground</h1>
        <p className="text-sm text-muted-foreground">Pages / API Playground</p>
      </div>

      <div className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>API Key Validation</CardTitle>
            <CardDescription>Test if your API key is valid</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleValidateKey} className="space-y-4">
              <div className="space-y-2">
                <label
                  htmlFor="validationApiKey"
                  className="text-sm font-medium"
                >
                  API Key
                </label>
                <Input
                  id="validationApiKey"
                  type="text"
                  value={validationApiKey}
                  onChange={(e) => setValidationApiKey(e.target.value)}
                  placeholder="Enter your API key"
                  className="w-full"
                />
              </div>
              <Button type="submit" disabled={isValidatingKey}>
                {isValidatingKey ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Validating...
                  </>
                ) : (
                  "Validate Key"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Repository Analysis</CardTitle>
            <CardDescription>Analyze any GitHub repository</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAnalyzeRepo} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="analysisApiKey" className="text-sm font-medium">
                  API Key
                </label>
                <Input
                  id="analysisApiKey"
                  type="text"
                  value={analysisApiKey}
                  onChange={(e) => setAnalysisApiKey(e.target.value)}
                  placeholder="Enter your API key"
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="githubUrl" className="text-sm font-medium">
                  GitHub URL
                </label>
                <Input
                  id="githubUrl"
                  type="text"
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                  placeholder="https://github.com/owner/repo"
                  className="w-full"
                />
              </div>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  "Analyze Repository"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {analysisResult && (
          <>
            <Card>
              <CardHeader>
                <CardTitle>Analysis Results</CardTitle>
                <CardDescription>
                  Repository: {analysisResult.repository.owner}/
                  {analysisResult.repository.repo}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex gap-4">
                  <Badge variant="secondary">
                    ⭐ {analysisResult.repository.stats.stars} stars
                  </Badge>
                  <Badge variant="secondary">
                    🍴 {analysisResult.repository.stats.forks} forks
                  </Badge>
                  <Badge variant="secondary">
                    👀 {analysisResult.repository.stats.watchers} watchers
                  </Badge>
                </div>

                {analysisResult.summary && (
                  <div className="space-y-2">
                    <h3 className="font-semibold">Summary</h3>
                    <p className="text-sm text-muted-foreground">
                      {analysisResult.summary}
                    </p>
                  </div>
                )}

                {analysisResult.mainFeatures && (
                  <div className="space-y-2">
                    <h3 className="font-semibold">Main Features</h3>
                    <ul className="list-disc list-inside text-sm text-muted-foreground">
                      {analysisResult.mainFeatures.map((feature, index) => (
                        <li key={index}>{feature}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {analysisResult.technicalComplexity && (
                  <div className="space-y-2">
                    <h3 className="font-semibold">Technical Complexity</h3>
                    <p className="text-sm text-muted-foreground">
                      {analysisResult.technicalComplexity}
                    </p>
                  </div>
                )}

                {analysisResult.recommendedAudience && (
                  <div className="space-y-2">
                    <h3 className="font-semibold">Recommended Audience</h3>
                    <p className="text-sm text-muted-foreground">
                      {analysisResult.recommendedAudience}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Raw Response</CardTitle>
                <CardDescription>
                  The raw JSON response from the API
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Code language="json" className="w-full overflow-auto">
                  {JSON.stringify(analysisResult, null, 2)}
                </Code>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
