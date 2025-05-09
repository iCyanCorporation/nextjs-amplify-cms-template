import React from 'react';

const AnimatedBackground = () => {
  return (
    <div className="fixed top-0 left-0 w-full h-full -z-10 overflow-hidden bg-gradient-to-br from-white to-[#f5f5f7] dark:from-[#13151a] dark:to-[#090b11]">
      <div className="absolute w-[70vw] h-[70vw] rounded-full pointer-events-none animate-float
        bg-[radial-gradient(circle_at_center,rgba(173,216,230,0.4),transparent_70%)] 
        dark:bg-[radial-gradient(circle_at_center,rgba(125,90,255,0.2),transparent_70%)]"></div>
      <div className="absolute w-[70vw] h-[70vw] rounded-full pointer-events-none animate-float-delay-2
        bg-[radial-gradient(circle_at_center,rgba(255,182,193,0.3),transparent_70%)]
        dark:bg-[radial-gradient(circle_at_center,rgba(255,123,234,0.15),transparent_70%)]"></div>
      <div className="absolute w-[70vw] h-[70vw] rounded-full pointer-events-none animate-float-delay-4
        bg-[radial-gradient(circle_at_center,rgba(176,224,230,0.35),transparent_70%)]
        dark:bg-[radial-gradient(circle_at_center,rgba(90,203,255,0.15),transparent_70%)]"></div>
    </div>
  );
};

export default AnimatedBackground;
