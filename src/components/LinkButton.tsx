import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface LinkButtonProps {
  href: string;
  children: React.ReactNode;
  variant?: "default" | "store";
  className?: string;
  icon?: LucideIcon;
}

export const LinkButton = ({ href, children, variant = "default", className, icon: Icon }: LinkButtonProps) => {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "w-full px-6 py-3 rounded-lg transition-all duration-300 flex items-center justify-center gap-2",
        variant === "default" 
          ? "bg-primary hover:bg-primary-hover text-white" 
          : "bg-primary hover:bg-primary-hover text-white",
        className
      )}
    >
      {Icon && <Icon className="w-5 h-5" />}
      {children}
    </a>
  );
};