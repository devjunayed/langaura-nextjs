import { OAuthButtonGroup, SignIn } from "@stackframe/stack";

const LoginPage = () => {
  return (
    <div className="w-full flex-col flex items-center  absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 justify-center">
      <div className="w-2xl shadow p-10 rounded">
        <h1 className="my-1 text-2xl text-center font-bold">Sign in to your account</h1>
        <p className="text-center mb-6">Click either of any button</p>
        <div>
          <OAuthButtonGroup   type="sign-in" />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
