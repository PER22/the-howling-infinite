// TitleContext.js
import React, { createContext, useState } from 'react';

// Create a context with 'createContext'
const TitleContext = createContext();

const TitleProvider = ({ children }) => {
  // Local state inside the provider to hold the title
  const [title, setTitle] = useState('');

  // The provider is rendering its children and providing the 'title' and 'setTitle' to its descendants
  return (
    <TitleContext.Provider value={{ title, setTitle }}>
      {children}
    </TitleContext.Provider>
  );
};

export { TitleProvider, TitleContext };
