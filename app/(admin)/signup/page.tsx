import SignupForm from "@/components/auth/SignupForm";

const SignupPage = () => {
  return (
    <main className="max-w-xl mx-auto mt-10 space-y-6">
      <section className="text-center">
        <h3 className="text-3xl font-semibold">Registrar usuario</h3>
      </section>
      <SignupForm />
    </main>
  );
};
export default SignupPage;
