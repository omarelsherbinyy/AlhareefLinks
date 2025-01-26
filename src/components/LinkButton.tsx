import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { AppleIcon, PlayIcon } from "lucide-react";

interface LinkButtonProps {
  href: string;
  children: React.ReactNode;
  variant?: "default" | "store";
  customColor?: string;
}

export const LinkButton = ({
  href,
  children,
  variant = "default",
  customColor,
}: LinkButtonProps) => {
  const buttonStyle = customColor ? { backgroundColor: customColor } : {};

  return (
    <Button
      asChild
      className={cn(
        "w-full px-6 py-3 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 font-bold",
        variant === "default"
          ? "hover:opacity-90 text-white"
          : "hover:opacity-90 text-white"
      )}
      style={buttonStyle}
    >
      <a href={href} target="_blank" rel="noopener noreferrer">
        {variant === "store" && (
          <>
            {href.includes("apple") ? (
              <AppleIcon className="w-5 h-5" />
            ) : (
              <PlayIcon className="w-5 h-5" />
            )}
          </>
        )}
        {children}
      </a>
    </Button>
  );
};