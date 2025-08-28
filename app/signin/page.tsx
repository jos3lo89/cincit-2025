import SigninForm from "@/components/auth/SigninForm";

const SigninPage = () => {
  return (
    <main className="max-w-md mx-auto mt-10 space-y-6">
      <section className="text-center">
        <h3 className="text-3xl font-semibold">Iniciar sesion</h3>
      </section>
      <SigninForm />
    </main>
  );
};
export default SigninPage;
