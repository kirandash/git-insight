import { auth, signIn } from "@/auth";
import { Header } from "@/components/Header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ArrowRight,
  Check,
  Github,
  LogIn,
  Search,
  Shield,
  Zap,
} from "lucide-react";
import Link from "next/link";

export default async function Home() {
  const session = await auth();

  const pricingPlans = [
    {
      name: "Free",
      price: "$0",
      description: "Perfect for getting started",
      features: [
        "50 repository analyses per month",
        "Basic repository insights",
        "Community support",
      ],
      badge: "Popular",
    },
    {
      name: "Pro",
      price: "$19",
      description: "Best for professional developers",
      features: [
        "Unlimited repository analyses",
        "Advanced AI insights",
        "Priority support",
        "API access",
        "Team collaboration",
      ],
    },
    {
      name: "Enterprise",
      price: "Custom",
      description: "For large organizations",
      features: [
        "Custom repository limits",
        "Advanced security features",
        "Dedicated support",
        "Custom integrations",
        "SLA guarantee",
      ],
      comingSoon: true,
    },
  ];

  const HeroCTA = () => {
    if (!session) {
      return (
        <form
          action={async () => {
            "use server";
            await signIn("google", { redirectTo: "/dashboard" });
          }}
        >
          <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700">
            <LogIn className="mr-2 h-5 w-5" />
            Get Started Free
          </Button>
        </form>
      );
    }

    return (
      <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700" asChild>
        <Link href="/dashboard">
          <ArrowRight className="mr-2 h-5 w-5" />
          Go to Dashboard
        </Link>
      </Button>
    );
  };

  return (
    <>
      <Header user={session?.user} />
      <main className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 pt-16">
        {/* Hero Section */}
        <section className="container mx-auto px-4 pt-20 pb-32">
          <div className="text-center space-y-6 max-w-3xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
              Git Insight
              <br />
              AI-Powered Repository Analysis
            </h1>
            <p className="text-gray-400 text-lg md:text-xl">
              Unlock the power of GitHub repositories with AI-driven analysis.
              Get instant summaries and discover cool facts about any open
              source project.
            </p>
            <div className="flex items-center justify-center gap-4 pt-4">
              <HeroCTA />
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="container mx-auto px-4 py-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-indigo-500/10 flex items-center justify-center mb-4">
                  <Zap className="h-6 w-6 text-indigo-400" />
                </div>
                <CardTitle className="text-white">Instant Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400">
                  Get immediate insights into any GitHub repository with our
                  AI-powered analysis tool.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-purple-500/10 flex items-center justify-center mb-4">
                  <Search className="h-6 w-6 text-purple-400" />
                </div>
                <CardTitle className="text-white">Smart Summaries</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400">
                  Understand complex repositories quickly with our concise and
                  intelligent summaries.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-blue-500/10 flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-blue-400" />
                </div>
                <CardTitle className="text-white">Cool Facts</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400">
                  Discover interesting insights and unique aspects of any
                  repository automatically.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="container mx-auto px-4 py-20">
          <h2 className="text-3xl font-bold text-center mb-16 text-white">
            How it works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <Card className="bg-gray-800 border-gray-700 text-center">
              <CardHeader>
                <div className="aspect-square flex items-center justify-center">
                  <Github className="h-16 w-16 text-indigo-400" />
                </div>
                <CardTitle className="text-white">
                  Enter Repository URL
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400">
                  Simply paste any GitHub repository URL you want to analyze
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700 text-center">
              <CardHeader>
                <div className="aspect-square flex items-center justify-center">
                  <Zap className="h-16 w-16 text-purple-400" />
                </div>
                <CardTitle className="text-white">AI Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400">
                  Our AI processes the repository content instantly
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700 text-center">
              <CardHeader>
                <div className="aspect-square flex items-center justify-center">
                  <Search className="h-16 w-16 text-blue-400" />
                </div>
                <CardTitle className="text-white">Get Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400">
                  Receive detailed summaries and interesting facts
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="container mx-auto px-4 py-20">
          <h2 className="text-3xl font-bold text-center mb-4 text-white">
            Simple, transparent pricing
          </h2>
          <p className="text-gray-400 text-center mb-16 max-w-2xl mx-auto">
            Choose the plan that&apos;s right for you. All plans include a
            14-day free trial.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {pricingPlans.map((plan) => (
              <Card
                key={plan.name}
                className="bg-gray-800/50 border-gray-700 relative"
              >
                {plan.badge && (
                  <Badge className="absolute -top-2 -right-2 bg-indigo-500">
                    {plan.badge}
                  </Badge>
                )}
                <CardHeader>
                  <CardTitle className="text-white">
                    {plan.name}
                    {plan.comingSoon && (
                      <Badge
                        variant="secondary"
                        className="ml-2 bg-gray-700 text-gray-300"
                      >
                        Coming Soon
                      </Badge>
                    )}
                  </CardTitle>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-white">
                      {plan.price}
                    </span>
                    {plan.price !== "Custom" && (
                      <span className="text-gray-400">/month</span>
                    )}
                  </div>
                  <p className="text-gray-400">{plan.description}</p>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {plan.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-center gap-2 text-gray-300"
                      >
                        <Check className="h-4 w-4 text-indigo-400" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  {plan.comingSoon ? (
                    <Button
                      size="lg"
                      className="w-full"
                      variant="outline"
                      disabled
                    >
                      Coming Soon
                    </Button>
                  ) : !session ? (
                    <form
                      className="w-full"
                      action={async () => {
                        "use server";
                        await signIn("google", { redirectTo: "/dashboard" });
                      }}
                    >
                      <Button
                        size="lg"
                        className="w-full"
                        variant={plan.badge ? "default" : "outline"}
                      >
                        Get Started
                      </Button>
                    </form>
                  ) : (
                    <Button
                      size="lg"
                      className="w-full"
                      variant={plan.badge ? "default" : "outline"}
                      asChild
                    >
                      <Link href="/dashboard">
                        Start Using {plan.name} Plan
                      </Link>
                    </Button>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-4 py-20">
          <Card className="bg-gradient-to-r from-indigo-600 to-purple-600 border-0">
            <CardHeader>
              <CardTitle className="text-3xl text-white text-center">
                {session
                  ? "Continue Exploring Repositories"
                  : "Ready to explore repositories smarter?"}
              </CardTitle>
              <p className="text-gray-100 text-center max-w-2xl mx-auto">
                {session
                  ? "Head to your dashboard to analyze more repositories and discover insights."
                  : "Join thousands of developers who are already using Git Insight to understand repositories better and faster."}
              </p>
            </CardHeader>
            <CardFooter className="flex justify-center">
              {!session ? (
                <form
                  action={async () => {
                    "use server";
                    await signIn("google", { redirectTo: "/dashboard" });
                  }}
                >
                  <Button size="lg" variant="secondary">
                    <LogIn className="mr-2 h-5 w-5" />
                    Start Analyzing Now
                  </Button>
                </form>
              ) : (
                <Button size="lg" variant="secondary" asChild>
                  <Link href="/dashboard">
                    <ArrowRight className="mr-2 h-5 w-5" />
                    Go to Dashboard
                  </Link>
                </Button>
              )}
            </CardFooter>
          </Card>
        </section>
      </main>
    </>
  );
}
