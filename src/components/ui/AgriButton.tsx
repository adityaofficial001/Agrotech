import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const agriButtonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-agri-sm hover:shadow-agri-md active:scale-[0.98] btn-liquid btn-liquid-default",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-agri-lime shadow-agri-sm hover:shadow-agri-md active:scale-[0.98]",
        outline:
          "border-2 border-primary bg-transparent text-primary hover:bg-primary hover:text-primary-foreground",
        ghost:
          "text-primary hover:bg-primary/10",
        link:
          "text-primary underline-offset-4 hover:underline",
        hero:
          "bg-agri-lime text-agri-green-dark font-bold shadow-agri-md hover:shadow-agri-glow active:scale-[0.98] btn-liquid btn-liquid-hero",
        cart:
          "bg-agri-yellow text-agri-brown font-bold shadow-agri-sm hover:shadow-agri-md active:scale-[0.98] btn-liquid btn-liquid-cart",
        danger:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-agri-sm",
      },
      size: {
        default: "h-10 px-5 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-12 rounded-lg px-8 text-base",
        xl: "h-14 rounded-xl px-10 text-lg",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface AgriButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof agriButtonVariants> {
  asChild?: boolean;
}

const AgriButton = React.forwardRef<HTMLButtonElement, AgriButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(agriButtonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
AgriButton.displayName = "AgriButton";

export { AgriButton, agriButtonVariants };
