import RelativeTime from "react-relative-time";

interface TimeAgoProps {
  date: Date;
}

export const TimeAgo: React.FC<TimeAgoProps> = ({ date }) => {
  return <RelativeTime value={date} titleFormat="MM/DD/YYYY HH:mm" />;
};
