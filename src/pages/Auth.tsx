import { AuthForm } from "@/components/auth/AuthForm";

const Auth = () => {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8 bg-white p-6 rounded-lg shadow-lg">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-black">Dashboard Login</h2>
        </div>
        <AuthForm />
      </div>
    </div>
  );
};

export default Auth;