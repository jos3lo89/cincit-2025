import { ModeToggle } from "@/components/theme/ModeToggle";

const SigninLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <header className="flex justify-end items-end p-4 border-b border-white/10">
        <ModeToggle />
      </header>
      {children}
    </>
  );
};
export default SigninLayout;
