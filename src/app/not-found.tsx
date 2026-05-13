import Link from "next/link";
import { Button } from "@/components/ui/button";
export default function NotFound() {
  return (
    <div className="container py-32 text-center">
      <p className="text-7xl font-display font-bold text-accent/20">404</p>
      <h1 className="mt-2 text-2xl font-bold">Page Not Found</h1>
      <p className="mt-2 text-muted-foreground">The page you're looking for doesn't exist.</p>
      <Button asChild variant="accent" className="mt-6"><Link href="/">Go Home</Link></Button>
    </div>
  );
}
