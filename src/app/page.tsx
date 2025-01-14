import { auth, signIn } from "@/auth";
import { Button } from "@/components/ui/button";
import { Github, LogIn, Search, Shield, Zap } from "lucide-react";

export default async function Home() {
  await auth();

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      {/* Hero Section */}
      <section className="container mx-auto px-4 pt-20 pb-32">
        <div className="text-center space-y-6 max-w-3xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
            We analyze. We summarize.
            <br />
            We share insights.
          </h1>
          <p className="text-gray-400 text-lg md:text-xl">
            Unlock the power of GitHub repositories with AI-driven analysis. Get
            instant summaries and discover cool facts about any open source
            project.
          </p>
          <div className="flex items-center justify-center gap-4 pt-4">
            <form
              action={async () => {
                "use server";
                await signIn("google", { redirectTo: "/dashboard" });
              }}
            >
              <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700">
                <LogIn className="mr-2 h-5 w-5" />
                Get Started
              </Button>
            </form>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 rounded-lg bg-gray-800/50 backdrop-blur">
            <div className="h-12 w-12 rounded-lg bg-indigo-500/10 flex items-center justify-center mb-4">
              <Zap className="h-6 w-6 text-indigo-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-white">
              Instant Analysis
            </h3>
            <p className="text-gray-400">
              Get immediate insights into any GitHub repository with our
              AI-powered analysis tool.
            </p>
          </div>
          <div className="p-6 rounded-lg bg-gray-800/50 backdrop-blur">
            <div className="h-12 w-12 rounded-lg bg-purple-500/10 flex items-center justify-center mb-4">
              <Search className="h-6 w-6 text-purple-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-white">
              Smart Summaries
            </h3>
            <p className="text-gray-400">
              Understand complex repositories quickly with our concise and
              intelligent summaries.
            </p>
          </div>
          <div className="p-6 rounded-lg bg-gray-800/50 backdrop-blur">
            <div className="h-12 w-12 rounded-lg bg-blue-500/10 flex items-center justify-center mb-4">
              <Shield className="h-6 w-6 text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-white">
              Cool Facts
            </h3>
            <p className="text-gray-400">
              Discover interesting insights and unique aspects of any repository
              automatically.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-center mb-16 text-white">
          How it works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="text-center">
            <div className="bg-gray-800 p-6 rounded-xl mb-6 aspect-square flex items-center justify-center">
              <Github className="h-16 w-16 text-indigo-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-white">
              Enter Repository URL
            </h3>
            <p className="text-gray-400">
              Simply paste any GitHub repository URL you want to analyze
            </p>
          </div>
          <div className="text-center">
            <div className="bg-gray-800 p-6 rounded-xl mb-6 aspect-square flex items-center justify-center">
              <Zap className="h-16 w-16 text-purple-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-white">
              AI Analysis
            </h3>
            <p className="text-gray-400">
              Our AI processes the repository content instantly
            </p>
          </div>
          <div className="text-center">
            <div className="bg-gray-800 p-6 rounded-xl mb-6 aspect-square flex items-center justify-center">
              <Search className="h-16 w-16 text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-white">
              Get Insights
            </h3>
            <p className="text-gray-400">
              Receive detailed summaries and interesting facts
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-12 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to explore repositories smarter?
          </h2>
          <p className="text-gray-100 mb-8 max-w-2xl mx-auto">
            Join thousands of developers who are already using our AI-powered
            GitHub analyzer to understand repositories better and faster.
          </p>
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
        </div>
      </section>
    </main>
  );
}
