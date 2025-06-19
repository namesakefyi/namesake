import { RegistrationForm, SignInForm, SignInWrapper } from "@/components/app";
import { Tab, TabList, TabPanel, Tabs } from "@/components/common";
import { Navigate, createFileRoute } from "@tanstack/react-router";
import { Authenticated, Unauthenticated } from "convex/react";
import { useState } from "react";
import type { Key } from "react-aria";

export const getInitialFlow = (): Key => {
  // Check if this is the first visit
  if (typeof window !== "undefined") {
    const hasVisitedBefore = localStorage.getItem("hasVisitedBefore");
    if (!hasVisitedBefore) {
      localStorage.setItem("hasVisitedBefore", "true");
      return "signUp";
    }
  }
  return "signIn";
};

export const Route = createFileRoute("/_unauthenticated/signin")({
  component: LoginRoute,
});

function LoginRoute() {
  const [tab, setTab] = useState<Key>(getInitialFlow());

  return (
    <>
      <Unauthenticated>
        <SignInWrapper>
          <Tabs selectedKey={tab} onSelectionChange={setTab}>
            <TabList>
              <Tab id="signIn">Sign in</Tab>
              <Tab id="signUp">Register</Tab>
            </TabList>
            <TabPanel id="signIn">
              <SignInForm />
            </TabPanel>
            <TabPanel id="signUp">
              <RegistrationForm />
            </TabPanel>
          </Tabs>
        </SignInWrapper>
      </Unauthenticated>
      <Authenticated>
        <Navigate to="/" />
      </Authenticated>
    </>
  );
}
