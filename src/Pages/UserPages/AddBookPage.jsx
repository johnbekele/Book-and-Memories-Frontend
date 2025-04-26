import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBooks } from '../../Hook/useBooks';
import { usePost } from '../../Hook/usePost';
import BookPostCard from '../../Components/BookPostCard';
import ModerationWarning from '../../Components/ModerationWarning';
import BookFormOverlay from '../../Components/BookFormOverlay';
import AuthContext from '../../Context/AuthContext';

function AddBookPage({ onClose }) {
  const { user } = useContext(AuthContext);
  const { books, isLoading: booksLoading } = useBooks();
  const navigate = useNavigate();
  return <BookFormOverlay onClose={onClose} />;
}

export default AddBookPage;
