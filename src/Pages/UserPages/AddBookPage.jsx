import React, { useContext, useState } from 'react';
import { useBooks } from '../../Hook/useBooks';
import { usePost } from '../../Hook/usePost';
import BookPostCard from '../../Components/BookPostCard';
import ModerationWarning from '../../Components/ModerationWarning';
import BookForm from '../../Components/BookForm';
import AuthContext from '../../Context/AuthContext';

function AddBookPage() {
  const { user } = useContext(AuthContext);
  const { books, isLoading: booksLoading } = useBooks();
  return <BookForm />;
}

export default AddBookPage;
