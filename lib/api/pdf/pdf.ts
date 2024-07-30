import { AxiosInstance } from "axios";

export const getPdf = async (
  query: string,
  axiosInstance: AxiosInstance,
): Promise<string> => {
  const response = await axiosInstance.get(`/pdf`);

  return response.data;
};
