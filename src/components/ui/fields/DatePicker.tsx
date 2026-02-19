import ReactDatePicker from "react-datepicker";
import type { DatePickerProps } from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

export const DatePicker = (props: DatePickerProps) => {
  return (
    <div className="date-picker-container">
      <ReactDatePicker
        {...props}
      />
    </div>
  );
};