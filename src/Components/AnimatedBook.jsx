import React from 'react';
import { useLottie } from 'lottie-react';
import BookAnime from '../assets/Animation/BookAnime.json';

const AnimatedBook = () => {
  const options = {
    animationData: BookAnime,
    loop: true,
  };
  const { View } = useLottie(options);
  return <div className="w-xl">{View}</div>;
};

export default AnimatedBook;
