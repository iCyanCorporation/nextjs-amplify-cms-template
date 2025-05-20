"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="flex items-center justify-center min-h-[70vh]">
      <Card className="w-full max-w-md text-center border shadow-md dark:bg-gray-800 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="text-5xl font-bold text-primary">404</CardTitle>
          <CardDescription className="text-2xl mt-2 dark:text-gray-300">
            Page Not Found
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground dark:text-gray-400">
            The page you are looking for doesn't exist or has been moved.
          </p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button
            variant="default"
            onClick={() => router.push("/")}
            className="transition-colors hover:bg-primary-focus"
          >
            Return to Home
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
