import {
  Banner,
  Button,
  Empty,
  Form,
  ListBox,
  ListBoxItem,
} from "@/components/common";
import { api } from "@convex/_generated/api";
import {
  CORE_QUESTS,
  JURISDICTIONS,
  type Jurisdiction,
} from "@convex/constants";
import { useNavigate } from "@tanstack/react-router";
import { useMutation } from "convex/react";
import { useState } from "react";
import type { Selection } from "react-aria-components";

interface JurisdictionInterstitialProps {
  type: "court-order" | "state-id" | "birth-certificate";
}

export const JurisdictionInterstitial = ({
  type,
}: JurisdictionInterstitialProps) => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<Selection>(new Set());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string>();

  const updateResidence = useMutation(api.users.setResidence);
  const updateBirthplace = useMutation(api.users.setBirthplace);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(undefined);

    const selection =
      selected !== "all" && selected.values().next().value?.toString();

    if (!selection) {
      setError("Please select a state.");
      return;
    }

    try {
      setIsSubmitting(true);

      if (type === "birth-certificate") {
        await updateBirthplace({ birthplace: selection as Jurisdiction });
      } else {
        await updateResidence({ residence: selection as Jurisdiction });
      }

      navigate({
        to: `/${type}/$jurisdiction`,
        params: { jurisdiction: selection.toLowerCase() },
      });
    } catch (err) {
      setError("Failed to update. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const copy: Record<
    JurisdictionInterstitialProps["type"],
    {
      title: string;
      description: string;
    }
  > = {
    "birth-certificate": {
      title: "Where were you born?",
      description: "Please select your birthplace.",
    },
    "court-order": {
      title: "Where do you live?",
      description: "Please select your state.",
    },
    "state-id": {
      title: "Where do you live?",
      description: "Please select your state.",
    },
  };

  return (
    <Empty
      icon={CORE_QUESTS[type].icon}
      title={copy[type].title}
      subtitle={copy[type].description}
      className="h-[100dvh]"
    >
      <Form onSubmit={handleSubmit} className="w-64">
        {error && <Banner variant="danger">{error}</Banner>}
        <ListBox
          selectedKeys={selected}
          onSelectionChange={(key) => {
            setSelected(key);
            setError(undefined);
          }}
          selectionMode="single"
          className="flex-1 max-h-[60dvh]"
          aria-label="Select a state"
        >
          {Object.entries(JURISDICTIONS).map(([value, label]) => (
            <ListBoxItem key={value} id={value}>
              {label}
            </ListBoxItem>
          ))}
        </ListBox>
        <Button type="submit" variant="primary" isDisabled={isSubmitting}>
          Continue
        </Button>
      </Form>
    </Empty>
  );
};
