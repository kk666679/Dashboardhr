import { getLeaveInfo } from "@/lib/actions/hr-actions";

export async function leaveAgent(input: string, employeeId?: string) {
  const data = await getLeaveInfo(employeeId);
  return {
    type: "LEAVE",
    data,
  };
}
