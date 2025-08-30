import { auth } from "@/auth";
import SuspenseLoading from "@/components/SuspenseLoading";
import ProfileCard from "@/components/user/ProfileCard";
import { redirect } from "next/navigation";
import { Suspense } from "react";

const ProfilePage = async () => {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/signin");
  }

  return (
    <Suspense fallback={<SuspenseLoading />}>
      <ProfileCard id={session.user.id} />
    </Suspense>
  );
};
export default ProfilePage;
