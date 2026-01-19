import React, { useEffect, useRef, useState } from 'react';
import { getShapeSvg } from '../../../utils/svgShapes';
import { Theme } from '../../../types';

interface ShapeIconProps {
  shape: string;
  theme: Theme;
}

const ShapeIcon: React.FC<ShapeIconProps> = ({ shape, theme }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [svgContent, setSvgContent] = useState('');
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '50px',
        threshold: 0.1,
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (isVisible) {
      const svgString = getShapeSvg(shape);
      const fillColor = theme === 'dark' ? '#9ca3af' : '#6b7280';
      const processedSvg = svgString.replace(/fill="currentColor"/g, `fill="${fillColor}"`);

      setSvgContent(processedSvg);
    }
  }, [isVisible, shape, theme]);

  return (
    <div ref={ref} className="w-full h-full flex items-center justify-center p-1">
      {isVisible ? (
        <div
          className="w-full h-full"
          dangerouslySetInnerHTML={{ __html: svgContent }}
        />
      ) : (
        <div className="w-8 h-8 bg-gray-200/30 dark:bg-gray-700/30 rounded animate-pulse" />
      )}
    </div>
  );
};

export default ShapeIcon;
