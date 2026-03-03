import * as React from "react";

/**
 * Mobile breakpoint in pixels.
 * Screens with width less than this value are considered mobile.
 */
const MOBILE_BREAKPOINT = 768;

/**
 * Custom React hook to detect if the current viewport is mobile-sized.
 *
 * This hook uses a MediaQueryList to listen for window resize events and
 * determines if the screen width is below the mobile breakpoint (768px).
 * It automatically updates when the window is resized and properly cleans
 * up event listeners on unmount.
 *
 * @returns {boolean} True if the current viewport width is less than 768px, false otherwise
 *
 * @example
 * ```typescript
 * const isMobile = useIsMobile();
 *
 * if (isMobile) {
 *   // Render mobile-specific UI
 *   return <MobileNavigation />;
 * } else {
 *   // Render desktop UI
 *   return <DesktopNavigation />;
 * }
 * ```
 */
export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(
    undefined,
  );

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };
    mql.addEventListener("change", onChange);
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return !!isMobile;
}
