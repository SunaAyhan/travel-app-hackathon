import React from 'react';
import '../app/animatedHeader.css';

const AnimatedHeader: React.FC = () => {
  const title = "TRAVEL BUDDY";
  
  return (
    <div className="animated-text">
      {title.split('').map((char, index) => (
        <div key={index} className="letter-wrapper">
          <div id={`letter-${index}`} className="letter">{char}</div>
          <div className="shadow">{char}</div>
        </div>
      ))}
    </div>
  );
};

export default AnimatedHeader;
