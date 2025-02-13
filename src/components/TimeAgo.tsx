interface TimeAgoProps {
  date: Date;
}

export const TimeAgo: React.FC<TimeAgoProps> = ({ date }) => {
  return (
    <time title={date.toLocaleString()} dateTime={date.toISOString()}>
      {getRelativeTimeString(date)}
    </time>
  );
};

interface TimeDivision {
  readonly seconds: number;
  readonly unit: Intl.RelativeTimeFormatUnit;
}

/**
 * Convert a date to a relative time string, such as
 * "a minute ago", "in 2 hours", "yesterday", "3 months ago", etc.
 * using Intl.RelativeTimeFormat
 * Inspired by: https://www.builder.io/blog/relative-time
 */
export function getRelativeTimeString(
  date: Date,
  lang: string = navigator.language,
): string {
  const TIME_DIVISIONS: readonly TimeDivision[] = [
    { seconds: 60, unit: "second" },
    { seconds: 3600, unit: "minute" },
    { seconds: 86400, unit: "hour" },
    { seconds: 86400 * 7, unit: "day" },
    { seconds: 86400 * 30, unit: "week" },
    { seconds: 86400 * 365, unit: "month" },
    { seconds: Number.POSITIVE_INFINITY, unit: "year" },
  ] as const;

  const miliseconds = date.getTime();
  const deltaSeconds = Math.round((miliseconds - Date.now()) / 1000);

  if (Math.abs(deltaSeconds) < 60 && lang.startsWith("en")) {
    return "just now";
  }

  const divisionIndex = TIME_DIVISIONS.findIndex(
    (division) => division.seconds > Math.abs(deltaSeconds),
  );

  const division = TIME_DIVISIONS[divisionIndex];
  const divisor = divisionIndex ? TIME_DIVISIONS[divisionIndex - 1].seconds : 1;

  const timeFormat = new Intl.RelativeTimeFormat(lang, { numeric: "auto" });
  return timeFormat.format(Math.floor(deltaSeconds / divisor), division.unit);
}
