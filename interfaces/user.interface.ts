import { AttendanceType } from "@prisma/client";

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
