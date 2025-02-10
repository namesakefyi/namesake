import RelativeTime from "react-relative-time";

interface TimeAgoProps {
  date: Date;
  className?: string;
}

export const TimeAgo: React.FC<TimeAgoProps> = ({ date, className }) => {
  return (
    <span className={className}>
      <RelativeTime value={date} titleFormat="MM/DD/YYYY HH:mm" />
    </span>
  );
};
