import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, LayoutDashboard } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-16 text-center bg-background">
      {/* Message and Explanations */}
      <h2 className="text-6xl font-extrabold text-foreground tracking-tight sm:text-7xl ">404</h2>
      <h3 className="mt-2 text-2xl font-bold text-muted-foreground sm:text-3xl">Page Not Found</h3>
      <p className="mt-4 text-muted-foreground max-w-md mx-auto text-sm sm:text-base leading-relaxed">
        The page you are looking for does not exist, has been moved, or is temporarily unavailable.
        Let's guide you back.
      </p>

      {/* Navigation Buttons */}
      <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center items-center w-full max-w-xs sm:max-w-md mx-auto">
        <Button asChild size="lg" className="w-full sm:w-auto font-bold transition-all shadow-none">
          <Link href="/">
            <Home className="w-4 h-4 mr-2" />
            Return Home
          </Link>
        </Button>

        <Button
          asChild
          variant="outline"
          size="lg"
          className="w-full sm:w-auto font-bold transition-all shadow-none"
        >
          <Link href="/dashboard">
            <LayoutDashboard className="w-4 h-4 mr-2" />
            Go to Dashboard
          </Link>
        </Button>
      </div>
    </div>
  );
}
