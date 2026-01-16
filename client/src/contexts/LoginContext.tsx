import { createContext, useContext, useState, ReactNode } from 'react';

export type UserRole = 'employee' | 'admin' | null;

interface LoginContextType {
  role: UserRole;
  isLoggedIn: boolean;
  loginAsEmployee: () => void;
  loginAsAdmin: (password: string) => boolean;
  logout: () => void;
  canEdit: boolean;
  canViewAll: boolean;
}

const LoginContext = createContext<LoginContextType | undefined>(undefined);

export function LoginProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<UserRole>(null);

  const loginAsEmployee = () => {
    setRole('employee');
  };

  const loginAsAdmin = (password: string): boolean => {
    if (password === 'Rr009988') {
      setRole('admin');
      return true;
    }
    return false;
  };

  const logout = () => {
    setRole(null);
  };

  const canEdit = role === 'admin';
  const canViewAll = role === 'admin';

  return (
    <LoginContext.Provider
      value={{
        role,
        isLoggedIn: role !== null,
        loginAsEmployee,
        loginAsAdmin,
        logout,
        canEdit,
        canViewAll,
      }}
    >
      {children}
    </LoginContext.Provider>
  );
}

export function useLogin() {
  const context = useContext(LoginContext);
  if (!context) {
    throw new Error('useLogin must be used within LoginProvider');
  }
  return context;
}
