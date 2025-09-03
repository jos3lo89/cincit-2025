import { AttendanceState, AttendanceType } from "@prisma/client";

export interface AttendanceI {
  date: string;
  exit: Exit;
  entrance: Entrance;
}

export interface Exit {
  id: string;
  date: string;
  createdAt: string;
  updatedAt: string;
  cincitEdition: string;
  attendanceType: AttendanceType;
  attendanceState: AttendanceState;
}

export interface Entrance {
  id: string;
  date: string;
  createdAt: string;
  updatedAt: string;
  cincitEdition: string;
  attendanceType: AttendanceType;
  attendanceState: AttendanceState;
}
