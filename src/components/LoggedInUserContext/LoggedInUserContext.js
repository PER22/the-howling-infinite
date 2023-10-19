import React, { createContext, useState, useContext } from 'react';
import { getLoggedInUser } from '../../utilities/users-service';

export const LoggedInUserContext = createContext();

export const LoggedInUserProvider = ({ children }) => {
  const [loggedInUser, setLoggedInUser] = useState(getLoggedInUser());

  return (
    <LoggedInUserContext.Provider value={{ loggedInUser, setLoggedInUser }}>
      {children}
    </LoggedInUserContext.Provider>
  );
};

export const useLoggedInUser = () => {
  const context = useContext(LoggedInUserContext);
  if (!context) {
    throw new Error('useLoggedInUser must be used within a UserProvider');
  }
  return context;
};
