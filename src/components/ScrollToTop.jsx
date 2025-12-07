import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * ScrollToTop component
 * Automatically scrolls to the top of the page when the route changes
 */
const ScrollToTop = () => {
    const { pathname, hash, key } = useLocation();

    useEffect(() => {
        // If there's a hash (anchor link), let browser handle it
        if (hash) {
            return;
        }

        // Force scroll to top using multiple methods for maximum compatibility
        try {
            // Method 1: Direct scroll
            window.scrollTo(0, 0);

            // Method 2: Scroll on document
            if (document.documentElement) {
                document.documentElement.scrollTop = 0;
            }

            // Method 3: Scroll on body
            if (document.body) {
                document.body.scrollTop = 0;
            }

            // Method 4: Delayed scroll for dynamic content
            requestAnimationFrame(() => {
                window.scrollTo(0, 0);
            });
        } catch (error) {
            console.error('ScrollToTop error:', error);
        }
    }, [pathname, hash, key]);

    return null;
};

export default ScrollToTop;
