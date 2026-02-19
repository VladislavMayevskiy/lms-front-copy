import { Spinner } from "components/ui/spinner";
import { Card, LabledIcon } from "../ui";
import SubscriptionsIcon from "assets/imgs/admin/dashboard/subscriptions.svg?react";
import { useActiveSubscriptions } from "api/admin/dashboard/hooks";

export const ActiveSubscriptions = () => {
  const { data, isLoading } = useActiveSubscriptions();

  if (isLoading) {
    return (
      <Spinner
        isLoading
      />
    );
  }

  return (
    <Card>
      <div className="flex items-center justify-between">
        <LabledIcon>
          <SubscriptionsIcon />
          Active Subscriptions
        </LabledIcon>
        <span className="font-[Lato] font-bold text-[24px] text-dark-text">{data?.data}</span>
      </div>
    </Card>
  );
};