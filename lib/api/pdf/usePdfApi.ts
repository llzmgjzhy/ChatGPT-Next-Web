import { useAxios } from "@/lib/hooks";
import { getPdf } from "./pdf";

export const usePdfApi = () => {
  const { axiosInstance } = useAxios();

  return {
    getPdf: async (query: string) => getPdf(query, axiosInstance),
  };
};
