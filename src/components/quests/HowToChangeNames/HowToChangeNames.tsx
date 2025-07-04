import { Heading } from "react-aria-components";
import { Link, TintedImage } from "@/components/common";
import { smartquotes } from "@/utils/smartquotes";
import step1 from "./images/01.png";
import step2 from "./images/02.png";
import step3 from "./images/03.png";
import step4 from "./images/04.png";

interface HowToChangeNamesStepProps {
  step: number;
  image: {
    src: string;
    alt: string;
  };
  title: string;
  description: string;
  children?: React.ReactNode;
}

const HowToChangeNamesStep = ({
  step,
  image,
  title,
  description,
  children,
}: HowToChangeNamesStepProps) => {
  return (
    <li className="w-full shrink-0 flex flex-col gap-2 snap-start">
      <TintedImage
        src={image.src}
        alt={image.alt}
        className="rounded-2xl overflow-hidden aspect-[0.8/1]"
      />
      <div className="flex flex-col items-start gap-2 relative">
        <div
          aria-hidden
          className="absolute size-8 bg-theme-3 text-theme-12 rounded-full -top-10 left-0 text-lg flex items-center justify-center font-bold select-none ring-2 ring-theme-1"
        >
          {step}
        </div>
        <h2 className="text-xl font-semibold mt-2">{smartquotes(title)}</h2>
        <p className="text-pretty">{smartquotes(description)}</p>
        {children}
      </div>
    </li>
  );
};

export const HowToChangeNames = () => {
  return (
    <>
      <header className="border-b border-dim pb-2">
        <Heading className="text-2xl leading-tight font-medium text-pretty">
          How to change your legal name
        </Heading>
      </header>
      <section className="@container full-bleed overflow-x-auto snap-x scroll-p-8 no-scrollbar">
        <ol className="grid grid-cols-4 gap-8 py-4 px-6 w-[clamp(900px,300vw,1140px)] mx-auto">
          <HowToChangeNamesStep
            step={1}
            title="Choose a name"
            description="What name suits you? Maybe you already know, or maybe you need time to experiment. Find your own pace."
            image={{
              src: step1,
              alt: "A hand holding a pen draws various names on a piece of paper, searching for the one that fits.",
            }}
          />
          <HowToChangeNamesStep
            step={2}
            title="File a court petition"
            description="Once you've decided on a name, you'll submit a court petition in your state. We'll help you fill out required forms."
            image={{
              src: step2,
              alt: "The disembodied arm of the law reaches out from a court building, holding a stack of papers labeled 'Court Order'. In the background, there is a large paper that says 'Name Change Petition'.",
            }}
          />
          <HowToChangeNamesStep
            step={3}
            title="Update other documents"
            description="We recommend starting with Social Security, followed by your State ID, Driver's License, and Passport."
            image={{
              src: step3,
              alt: "In the foreground, a hand holds a phone with a label reading 'email and socials'. Behind it is a main street scene with various buildings labeled 'Social Security', 'Bank', and 'School'. A car drives down the road and has the label 'State ID/Driver's License'. In the background, a plane flies through the clouds, with the label 'Passport'.",
            }}
          />
          <HowToChangeNamesStep
            step={4}
            title="Live your life"
            description="You've always been you, but now it's official. Take a moment to celebrate. :)"
            image={{
              src: step4,
              alt: "Two hands reach out to each other, and speech bubbles read, 'Hey, I'm [a collection of shapes representing the new name].' A response bubble reads, 'Nice to meet you'. On the bottom hand, there is a small snail.",
            }}
          >
            <span className="text-sm text-dim italic">
              &mdash; Illustrations by{" "}
              <Link href="https://mitkills.com/" target="_blank">
                Kit Mills
              </Link>
            </span>
          </HowToChangeNamesStep>
        </ol>
      </section>
    </>
  );
};
