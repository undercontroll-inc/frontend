import { useState } from 'react';

const Tooltip = ({ children, content, side = 'right', delayDuration = 200 }) => {
  const [isVisible, setIsVisible] = useState(false);
  let timeoutId = null;

  const showTooltip = () => {
    timeoutId = setTimeout(() => {
      setIsVisible(true);
    }, delayDuration);
  };

  const hideTooltip = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    setIsVisible(false);
  };

  const positions = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  const arrowPositions = {
    top: 'top-full left-1/2 -translate-x-1/2 -mt-1',
    bottom: 'bottom-full left-1/2 -translate-x-1/2 -mb-1',
    left: 'left-full top-1/2 -translate-y-1/2 -ml-1',
    right: 'right-full top-1/2 -translate-y-1/2 -mr-1',
  };

  const arrowRotations = {
    top: 'rotate-180',
    bottom: '',
    left: 'rotate-90',
    right: '-rotate-90',
  };

  return (
    <div 
      className="relative inline-flex"
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
    >
      {children}
      {isVisible && content && (
        <div
          className={`
            absolute z-50 ${positions[side]}
            px-3 py-1.5 text-xs font-medium text-white
            bg-gray-900 rounded-lg shadow-lg
            whitespace-nowrap
            animate-in fade-in-0 zoom-in-95
            pointer-events-none
          `}
          role="tooltip"
        >
          {content}
          <div
            className={`
              absolute ${arrowPositions[side]} ${arrowRotations[side]}
              w-2 h-2 bg-gray-900 transform rotate-45
            `}
          />
        </div>
      )}
    </div>
  );
};

export default Tooltip;
