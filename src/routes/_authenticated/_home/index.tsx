import { AppContent, PageHeader } from "@/components/app";
import { Card } from "@/components/common";
import { HowToUpdateYourName } from "@/components/home";
import { api } from "@convex/_generated/api";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "convex/react";

export const Route = createFileRoute("/_authenticated/_home/")({
  component: IndexRoute,
});

const getHomeTitle = (name?: string) => {
  const isFirstVisit = true; // TODO: Implement
  const timeOfDay = new Date().getHours();
  const greetings = [
    { start: 6, end: 12, greeting: "Good morning" },
    { start: 12, end: 17, greeting: "Afternoon" },
    { start: 17, end: 24, greeting: "Good evening" },
  ];

  const prefix = isFirstVisit
    ? "Welcome to Namesake"
    : (greetings.find(({ start, end }) => timeOfDay >= start && timeOfDay < end)
        ?.greeting ?? "Hey");

  let title = "Home";
  if (name) {
    title = `${prefix}, ${name}`;
  }

  return title;
};

function IndexRoute() {
  const user = useQuery(api.users.getCurrent);

  return (
    <AppContent>
      <PageHeader title={getHomeTitle(user?.name)} />
      <Card>Namesake is</Card>
      <HowToUpdateYourName />
      <Card>Events?</Card>
      <Card>Blog posts?</Card>
      <Card>Link to Discord?</Card>
    </AppContent>
  );
}
