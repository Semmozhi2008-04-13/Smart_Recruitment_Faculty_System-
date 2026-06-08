import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [role, setRole] = useState(null); // 'HR', 'INTERVIEWER', 'CANDIDATE'

  const updateRole = (newRole) => {
    setRole(newRole);
    localStorage.setItem('userRole', newRole);
  };

  return (
    <AuthContext.Provider value={{ role, setRole: updateRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (context === undefined || context === null) {
    console.error("useAuth was called outside of an AuthProvider!");
    return { role: null, setRole: () => console.warn("AuthProvider not found") };
  }
  
  return context;

};
