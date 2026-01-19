export const SVG_SHAPES: Record<string, string> = {
  // Basic Shapes
  square: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><rect x="10" y="10" width="80" height="80" fill="currentColor" /></svg>`,
  circle: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="40" fill="currentColor" /></svg>`,
  oval: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><ellipse cx="50" cy="50" rx="45" ry="30" fill="currentColor" /></svg>`,

  // Triangles
  change_history: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><polygon points="50,10 90,90 10,90" fill="currentColor" /></svg>`,

  // Polygons
  pentagon: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><polygon points="50,5 95,38 79,92 21,92 5,38" fill="currentColor" /></svg>`,

  // Special Shapes
  star: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><polygon points="50,5 61,35 95,35 68,57 79,91 50,70 21,91 32,57 5,35 39,35" fill="currentColor" /></svg>`,
  heart: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><path d="M50,90 C20,60 5,45 5,30 C5,15 15,10 25,10 C35,10 45,15 50,25 C55,15 65,10 75,10 C85,10 95,15 95,30 C95,45 80,60 50,90Z" fill="currentColor" /></svg>`,
  cross: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><polygon points="35,5 65,5 65,35 95,35 95,65 65,65 65,95 35,95 35,65 5,65 5,35 35,35" fill="currentColor" /></svg>`,

  // Arrows
  arrow: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><polygon points="50,10 95,50 50,50 50,90 5,50 50,50" fill="currentColor" /></svg>`,
  arrow_down: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><polygon points="10,10 90,10 50,90" fill="currentColor" /></svg>`,
  arrow_left: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><polygon points="90,10 10,50 90,90" fill="currentColor" /></svg>`,
  arrow_right: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><polygon points="10,10 90,50 10,90" fill="currentColor" /></svg>`,

  // Parallelograms & Trapezoids
  parallelogram: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><polygon points="25,15 85,15 75,85 15,85" fill="currentColor" /></svg>`,
  trapezoid: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><polygon points="20,15 80,15 90,85 10,85" fill="currentColor" /></svg>`,
  inverted_trapezoid: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><polygon points="10,15 90,15 80,85 20,85" fill="currentColor" /></svg>`,

  // Lines & Frames
  plus: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><rect x="45" y="10" width="10" height="80" fill="currentColor"/><rect x="10" y="45" width="80" height="10" fill="currentColor"/></svg>`,
  minus: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><rect x="10" y="45" width="80" height="10" fill="currentColor"/></svg>`,
  frame: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><rect x="10" y="10" width="80" height="80" fill="none" stroke="currentColor" stroke-width="10" /></svg>`,
  rounded_frame: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><rect x="10" y="10" width="80" height="80" rx="20" ry="20" fill="currentColor" /></svg>`,

  // Symbols
  check: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><polygon points="20,50 40,70 80,30" fill="none" stroke="currentColor" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  x_mark: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><line x1="25" y1="25" x2="75" y2="75" stroke="currentColor" stroke-width="12" stroke-linecap="round"/><line x1="75" y1="25" x2="25" y2="75" stroke="currentColor" stroke-width="12" stroke-linecap="round"/></svg>`,
  circle_mark: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="35" fill="none" stroke="currentColor" stroke-width="10" /></svg>`,
  dot: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="15" fill="currentColor" /></svg>`,
};

export const getShapeSvg = (shapeName: string): string => {
  return SVG_SHAPES[shapeName] || '';
};
