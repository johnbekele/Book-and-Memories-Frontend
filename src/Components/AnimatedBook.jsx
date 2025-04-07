import React from 'react';
import { useLottie } from 'lottie-react';
import BookAnime from '../assets/Animation/BookAnime.json';
import { useTheme } from '../Context/ThemeContext';

const AnimatedBook = () => {
  const { theme, toggleTheme, colors } = useTheme();
  // const isDark = theme === 'dark';
  const options = {
    animationData: BookAnime,
    loop: false,
    autoplay: true,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  const { View } = useLottie(options);

  return (
    <div
      style={{
        backgroundColor: colors.backgroundColor,
        borderColor: colors.borderColor,
        color: colors.textColor,
      }}
      className="h-full w-full flex items-center justify-center"
    >
      <div className="w-[80%] max-w-[400px]">{View}</div>
    </div>
  );
};

export default AnimatedBook;
