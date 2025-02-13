interface FormattedDateProps {
  date: Date;
}

export const FormattedDate = ({ date }: FormattedDateProps) => (
  <time dateTime={date.toISOString()}>
    {date.toLocaleDateString(navigator.language, {
      month: "short",
      day: "numeric",
      year: "numeric",
    })}
  </time>
);
