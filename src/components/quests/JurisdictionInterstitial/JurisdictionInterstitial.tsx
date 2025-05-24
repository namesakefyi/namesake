import {
  Banner,
  Button,
  Empty,
  Form,
  ListBox,
  ListBoxItem,
} from "@/components/common";
import {
  ALL,
  BIRTHPLACES,
  CATEGORIES,
  JURISDICTIONS,
  type Jurisdiction,
} from "@/constants";
import { useIsMobile } from "@/hooks/useIsMobile";
import { api } from "@convex/_generated/api";
import { useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery } from "convex/react";
import { useState } from "react";
import type { Selection } from "react-aria-components";
import { toast } from "sonner";
import { tv } from "tailwind-variants";

interface JurisdictionInterstitialProps {
  type: "courtOrder" | "stateId" | "birthCertificate";
}

export const JurisdictionInterstitial = ({
  type,
}: JurisdictionInterstitialProps) => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [selected, setSelected] = useState<Selection>(new Set());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string>();

  const selection =
    selected !== ALL ? selected.values().next().value?.toString() : undefined;

  const updateResidence = useMutation(api.users.setResidence);
  const updateBirthplace = useMutation(api.users.setBirthplace);
  const addQuest = useMutation(api.userQuests.create);
  const findQuest = useQuery(api.quests.getByCategoryAndJurisdiction, {
    category: type,
    jurisdiction: selection,
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(undefined);

    if (!selection) {
      setError("Please select a state.");
      return;
    }

    try {
      setIsSubmitting(true);

      if (type === "birthCertificate") {
        await updateBirthplace({ birthplace: selection as Jurisdiction });
      } else {
        await updateResidence({ residence: selection as Jurisdiction });
      }

      if (findQuest?._id) {
        await addQuest({ questId: findQuest._id });
        navigate({
          to: "/quests/$questSlug",
          params: { questSlug: findQuest.slug },
        });
      } else {
        navigate({ to: "/" });

        if (type === "birthCertificate" && selection === "other") {
          toast.info(
            "Namesake can only assist with birth certificates for US states.",
          );
        } else {
          toast.info(
            "Namesake doesn't support that state yet. Please check back soon.",
          );
        }
      }
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
    birthCertificate: {
      title: "Where were you born?",
      description: "Please select your birthplace.",
    },
    courtOrder: {
      title: "Where do you live?",
      description: "Please select your state.",
    },
    stateId: {
      title: "Where do you live?",
      description: "Please select your state.",
    },
  };

  const emptyStyles = tv({
    variants: {
      isMobile: {
        true: "h-full-minus-mobile-nav",
        false: "h-[100dvh]",
      },
    },
  });

  const listBoxStyles = tv({
    base: "flex-1",
    variants: {
      isMobile: {
        true: "max-h-[45dvh]",
        false: "max-h-[50dvh]",
      },
    },
  });
  return (
    <Empty
      icon={CATEGORIES[type].icon}
      title={copy[type].title}
      subtitle={copy[type].description}
      className={emptyStyles({ isMobile })}
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
          className={listBoxStyles({ isMobile })}
          aria-label="Select a state"
        >
          {Object.entries(
            type === "birthCertificate" ? BIRTHPLACES : JURISDICTIONS,
          ).map(([value, label]) => (
            <ListBoxItem key={value} id={value}>
              {label}
            </ListBoxItem>
          ))}
        </ListBox>
        <Button type="submit" variant="primary" isSubmitting={isSubmitting}>
          Continue
        </Button>
      </Form>
    </Empty>
  );
};
