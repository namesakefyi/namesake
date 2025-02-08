import { Card } from "@/components/common";
import { Step, Steps } from "@/components/quests";
import { Heading } from "react-aria-components";

const UpdateSteps = () => {
  return (
    <Steps>
      <Step title="Decide on a name">
        <p>Decide on a name</p>
      </Step>
      <Step title="File a court order">
        <p>File a court order</p>
      </Step>
      <Step title="Update your other official documents">
        <p>Update your other official documents</p>
      </Step>
      <Step title="Update your state ID">
        <p>Update your state ID</p>
      </Step>
    </Steps>
  );
};

export const HowToUpdateYourName = () => {
  return (
    <Card className="flex flex-col gap-4">
      <header>
        <Heading className="text-xl font-medium">
          How to legally change your name and gender marker
        </Heading>
        <p>
          Congratulations on beginning your journey to legally change your name!
        </p>
      </header>
      <UpdateSteps />
    </Card>
  );
};
