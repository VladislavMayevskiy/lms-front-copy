import { useMutation, useQueryClient } from "@tanstack/react-query";
import { saveSettings } from "./index";
import type { CurrentUserResponse } from "api/global/types";

export const useSaveSettings = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['save-settings'],
    mutationFn: saveSettings,
    onSuccess: ({ data: user }) => {
      queryClient.setQueryData(['current-user'], (data: CurrentUserResponse) => {
        if (user) return { data: user };
        else return data;
      });
    },
  });
};
