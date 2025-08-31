import { AttendanceType, Role } from "@prisma/client";

export interface UserI {
  id: string;
  firstName: string;
  lastName: string;
  dni: string;
  email: string;
  institution: string;
}

export interface AttendanceI {
  id: string;
  date: string;
  attendanceType: AttendanceType;
}

export interface UserInterfaceI {
  id: string;
  dni: string;
  firstName: string;
  lastName: string;
  email: string;
  telephone: string;
  role: Role;
}
