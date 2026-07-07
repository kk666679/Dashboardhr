import { getImmigrationInfo } from "@/lib/actions/hr-actions";

export async function immigrationAgent(input: string, employeeId?: string) {
  const data = await getImmigrationInfo(employeeId);
  return {
    type: "IMMIGRATION",
    data,
  };
}
