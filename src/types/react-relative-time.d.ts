declare module "react-relative-time" {
  export default function RelativeTime(props: {
    value: Date;
    titleFormat?: string;
  }): JSX.Element;
}
