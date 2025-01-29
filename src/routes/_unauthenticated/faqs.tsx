import { AppContent, PageHeader } from "@/components/app";
import { Disclosure } from "@/components/common/Disclosure/Disclosure";
import { RichText } from "@/components/common/RichText/RichText";
import { api } from "@convex/_generated/api";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "convex/react";

export const Route = createFileRoute("/_unauthenticated/faqs")({
  component: RouteComponent,
});

function RouteComponent() {
  const faqs = useQuery(api.faqs.getAll);

  return (
    <AppContent>
      <PageHeader title="FAQs" />
      <div className="flex flex-col">
        {faqs?.map((faq) => (
          <Disclosure key={faq._id} id={faq._id} title={faq.question}>
            <RichText
              initialContent={faq.answer}
              editable={false}
              className="text-gray-dim"
            />
          </Disclosure>
        ))}
      </div>
    </AppContent>
  );
}
