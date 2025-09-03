import { UserI } from "@/interfaces/user.interface";
import { User } from "lucide-react";

type Props = {
  user: UserI;
};

const UserCardAttendance = ({ user }: Props) => {
  return (
    <>
      <div className="flex justify-center gap-2 items-center my-4">
        <User className="h-4 w-4 text-green-600" />
        <p className="text-green-600">Encontrado!</p>
      </div>
      <div className="space-y-2">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
          <div className="rounded-md border p-2">
            <p className="text-xs mb-1">Nombre</p>
            <p className="font-medium text-sm truncate">
              {user.firstName} {user.lastName}
            </p>
          </div>
          <div className="rounded-md border p-2">
            <p className="text-xs  mb-1">Email</p>
            <p className="font-medium text-sm  truncate">{user.email}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-md border p-2">
            <p className="text-xs  mb-1">DNI</p>
            <p className="font-medium text-sm ">{user.dni}</p>
          </div>

          <div className="rounded-md border p-2">
            <p className="text-xs  mb-1">Institución</p>
            <p className="font-medium text-sm  truncate">{user.institution}</p>
          </div>
        </div>
      </div>
    </>
  );
};
export default UserCardAttendance;
