import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";

export interface FlipButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  /** Tone: primary uses emerald, dark uses near-black, light uses surface */
  tone?: "primary" | "dark" | "light";
  size?: "sm" | "md" | "lg";
}

/**
 * FlipButton — uppercase pill button with a diagonal white sweep on hover
 * and a vertical letter-flip animation. Text is always legible at rest
 * and at the end of the animation (initial + final transform === 0).
 *
 * Pure CSS / Tailwind — no styled-components dependency.
 */
export const FlipButton = React.forwardRef<HTMLButtonElement, FlipButtonProps>(
  (
    { className, children, asChild = false, tone = "primary", size = "md", ...props },
    ref,
  ) => {
    const Comp: any = asChild ? Slot : "button";

    const tones: Record<string, string> = {
      primary:
        "bg-primary text-primary-foreground [--flip-sweep:hsl(var(--primary-foreground))]",
      dark: "bg-foreground text-background [--flip-sweep:hsl(var(--background))]",
      light:
        "bg-background text-foreground border-border [--flip-sweep:hsl(var(--foreground))]",
    };

    const sizes: Record<string, string> = {
      sm: "text-xs px-5 py-2 tracking-widest",
      md: "text-sm px-7 py-3 tracking-widest",
      lg: "text-base px-9 py-4 tracking-widest",
    };

    return (
      <Comp
        ref={ref}
        className={cn(
          "flip-btn group relative inline-flex items-center justify-center overflow-hidden rounded-full border-2 font-display font-black uppercase leading-tight cursor-pointer select-none",
          "transition-colors disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background",
          "border-current/0",
          tones[tone],
          sizes[size],
          className,
        )}
        {...props}
      >
        <span className="flip-btn__text-wrap relative block overflow-hidden">
          <span className="flip-btn__text relative block">{children}</span>
        </span>
      </Comp>
    );
  },
);
FlipButton.displayName = "FlipButton";

export default FlipButton;
