import React from 'react';
import { useLottie } from 'lottie-react';
import GoogleLoadAnime from '../assets/Animation/GoogleLoadAnime.json';
import { useTheme } from '../Context/ThemeContext';

const AnimatedGoogleLoad = () => {
  const { colors } = useTheme();

  // Fixed reasonable size for the animation
  const animationSize = { width: 100, height: 100 };

  const options = {
    animationData: GoogleLoadAnime,
    loop: true,
    autoplay: true,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
    ...animationSize, // Apply width and height
  };

  const { View } = useLottie(options);

  return (
    <div className="flex justify-center items-center">
      <div className="animation-container" style={animationSize}>
        {View}
      </div>
    </div>
  );
};

export default AnimatedGoogleLoad;
