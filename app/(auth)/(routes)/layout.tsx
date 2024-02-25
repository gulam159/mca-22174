import { ReactNode } from "react";

interface Auth {
  children: ReactNode;
}

const AuthLayout = ({ children }: Auth) => {
  return (
    <div className="h-screen flex justify-center items-center">{children}</div>
  );
};

export default AuthLayout;
