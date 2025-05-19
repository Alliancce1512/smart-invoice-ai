
import * as React from "react"
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area"

import { cn } from "@/lib/utils"

const ScrollArea = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root> & {
    orientation?: "vertical" | "horizontal";
    hideScrollbar?: boolean;
  }
>(({ className, children, orientation = "vertical", hideScrollbar = false, ...props }, ref) => (
  <ScrollAreaPrimitive.Root
    ref={ref}
    className={cn("relative overflow-hidden", className)}
    {...props}
  >
    <ScrollAreaPrimitive.Viewport className="h-full w-full rounded-[inherit]">
      {children}
    </ScrollAreaPrimitive.Viewport>
    {!hideScrollbar && <ScrollBar orientation={orientation} />}
    <ScrollAreaPrimitive.Corner />
  </ScrollAreaPrimitive.Root>
))
ScrollArea.displayName = ScrollAreaPrimitive.Root.displayName

const ScrollBar = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>
>(({ className, orientation = "vertical", ...props }, ref) => (
  <ScrollAreaPrimitive.ScrollAreaScrollbar
    ref={ref}
    orientation={orientation}
    className={cn(
      "flex touch-none select-none transition-colors",
      orientation === "vertical" &&
        "h-full w-2 border-l border-l-transparent p-[1px]",
      orientation === "horizontal" &&
        "h-2 flex-col border-t border-t-transparent p-[1px]",
      className
    )}
    {...props}
  >
    <ScrollAreaPrimitive.ScrollAreaThumb 
      className={cn(
        "relative flex-1 rounded-full bg-border opacity-50 hover:opacity-80 transition-opacity",
      )}
    />
  </ScrollAreaPrimitive.ScrollAreaScrollbar>
))
ScrollBar.displayName = ScrollAreaPrimitive.ScrollAreaScrollbar.displayName

// New component for horizontal scrolling with visual indicators
const HorizontalScrollArea = React.forwardRef<
  React.ElementRef<typeof ScrollArea>,
  React.ComponentPropsWithoutRef<typeof ScrollArea>
>(({ className, children, ...props }, ref) => {
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const [showLeftFade, setShowLeftFade] = React.useState(false);
  const [showRightFade, setShowRightFade] = React.useState(true);

  const handleScroll = () => {
    if (!scrollRef.current) return;
    
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    
    // Show left fade when scrolled right
    setShowLeftFade(scrollLeft > 10);
    
    // Show right fade when there's more content to scroll to
    setShowRightFade(scrollLeft < scrollWidth - clientWidth - 10);
  };

  React.useEffect(() => {
    const scrollElement = scrollRef.current;
    if (scrollElement) {
      scrollElement.addEventListener('scroll', handleScroll);
      // Check initial state
      handleScroll();
      
      return () => {
        scrollElement.removeEventListener('scroll', handleScroll);
      };
    }
  }, []);
  
  return (
    <div className={cn("relative", className)}>
      {/* Left fade indicator */}
      <div 
        className={cn(
          "absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none transition-opacity",
          showLeftFade ? "opacity-100" : "opacity-0"
        )}
        aria-hidden="true"
      />
      
      <div 
        ref={scrollRef} 
        className="overflow-x-auto scrollbar-hide" 
        style={{ 
          scrollbarWidth: 'none',
          msOverflowStyle: 'none'
        }}
        onScroll={handleScroll}
      >
        <ScrollArea 
          ref={ref}
          orientation="horizontal"
          hideScrollbar
          className="w-full"
          {...props}
        >
          {children}
        </ScrollArea>
      </div>
      
      {/* Right fade indicator */}
      <div 
        className={cn(
          "absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none transition-opacity",
          showRightFade ? "opacity-100" : "opacity-0"
        )}
        aria-hidden="true"
      />
    </div>
  );
});

HorizontalScrollArea.displayName = "HorizontalScrollArea";

export { ScrollArea, ScrollBar, HorizontalScrollArea }
