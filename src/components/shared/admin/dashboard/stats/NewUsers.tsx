import { useState } from "react";
import moment from "moment";
import type { ChartData } from "chart.js";
import { Line } from "react-chartjs-2";
import { Spinner } from "components/ui/spinner";
import { Switch } from "components/ui/switch";
import { Card, LabledIcon } from "../ui";
import UsersIcon from "assets/imgs/admin/dashboard/users.svg?react";
import { useNewUsers } from "api/admin/dashboard/hooks";

export const NewUsers = () => {
  const [months, setMonths] = useState<number>(3);
  const { data: newUsersStat, isLoading } = useNewUsers(months);

  const labels = newUsersStat?.data.map(({ month }) => moment(month).format('MMMM'));
  const data: ChartData<"line"> = {
    labels,
    datasets: [
      {
        data: newUsersStat?.data.map(({ count }) => count) || [],
        pointBackgroundColor: "#F27D3B",
        pointRadius: 8,
        pointHoverRadius: 10,
        borderColor: "#FACCB2",
      }
    ],
  };

  return (
    <Card className="flex gap-5">
      <div className="w-full flex flex-col gap-5">
        <div className="w-full flex items-center justify-between">
          <LabledIcon>
            <UsersIcon />
            New users
          </LabledIcon>
          <Switch
            items={[
              {
                label: "Last 3 months",
                value: 3,
              },
              {
                label: "Last 6 months",
                value: 6,
              },
              {
                label: "Last 12 months",
                value: 12,
              },
            ]}
            selectedValue={months}
            onChange={(value) => setMonths(value as number)}
          />
        </div>
        {isLoading ? (
          <Spinner
            isLoading
          />
        ) : (
          <Line
            data={data}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  display: false,
                },
              },
            }}
            className="max-h-[300px]"
          />
        )}
      </div>
    </Card>
  );
};