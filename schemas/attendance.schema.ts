import z from "zod";

export const attendanceRegisterSchema = z.object({
  userId: z.string(),
  attendanceId: z.string(),
});

export const changeStateAttendance = z.object({
  attendanceState: z.enum(["visible", "hidden"]),
});
