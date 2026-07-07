import { getRecruitmentInfo } from "@/lib/actions/hr-actions";

export async function recruitmentAgent(input: string) {
  const data = await getRecruitmentInfo();
  return {
    type: "RECRUITMENT",
    data,
  };
}
