import { trpc } from './trpc';

export function useMSStandards() {
  return trpc.ms.list.useQuery();
}

export function useMSStandard(code: string) {
  return trpc.ms.get.useQuery({ code });
}

export function useSearchMSStandards(query: string) {
  return trpc.ms.search.useQuery({ query }, { enabled: query.length > 0 });
}

export function useMSRequirements(code: string) {
  return trpc.ms.getRequirements.useQuery({ code });
}

export function useMSClauses(code: string) {
  return trpc.ms.getClauses.useQuery({ code });
}

export function useCheckMSCompliance() {
  return trpc.ms.checkCompliance.useMutation();
}