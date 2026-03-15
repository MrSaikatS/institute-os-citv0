import * as React from "react";

/**
 * Mobile breakpoint in pixels.
 * Screens with width less than this value are considered mobile.
 */
const MOBILE_BREAKPOINT = 768;

/**
 * Custom React hook to detect if the current viewport is mobile-sized.
 *
 * This hook uses a MediaQueryList and listens for the media query "change" event
 * (via MediaQueryList.addEventListener("change", ...)) instead of subscribing to
 * window resize events. It determines if the screen width is below the mobile
 * breakpoint (768px) and updates when the media query match state changes.
 * The hook properly cleans up the MediaQueryList listener on unmount
 * (via MediaQueryList.removeEventListener("change", ...)).
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
      setIsMobile(mql.matches);
    };
    mql.addEventListener("change", onChange);
    setIsMobile(mql.matches);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return !!isMobile;
}
