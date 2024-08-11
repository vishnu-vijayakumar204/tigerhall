export const getViewportDimensions = () => {
  if (typeof window === 'undefined') return { width: 800, height: 600 };

  const width = window.innerWidth;
  let maxWidth = 244;
  let maxHeight = 120;

  if (width < 780) {
    // Mobile
    maxWidth = 180;
    maxHeight = 90;
  } else if (width < 1200) {
    // Tablet
    maxWidth = 200;
    maxHeight = 100;
  } else {
    // Desktop
    maxWidth = 244;
    maxHeight = 120;
  }

  return { maxWidth, maxHeight };
};