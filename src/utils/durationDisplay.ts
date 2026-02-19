export function minutesToHoursAndMinutes(totalMinutes: number) {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  const formattedMinutes = String(minutes).padStart(2, '0');

  return `${hours}:${formattedMinutes}`;
};

export function minutesToDecimalHours(totalMinutes: number) {
  return `${(totalMinutes / 60).toFixed(2)} hour(s)`; 
}