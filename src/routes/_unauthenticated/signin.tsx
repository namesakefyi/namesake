import { createFileRoute, Navigate } from "@tanstack/react-router";
import { Authenticated, Unauthenticated } from "convex/react";
import { useState } from "react";
import type { Key } from "react-aria";
import { RegistrationForm, SignInForm, SignInWrapper } from "@/components/app";
import { Tab, TabList, TabPanel, Tabs } from "@/components/common";
import { useHasVisited } from "@/hooks/useHasVisited";

export const Route = createFileRoute("/_unauthenticated/signin")({
  component: LoginRoute,
});

function LoginRoute() {
  const hasVisited = useHasVisited();
  const [tab, setTab] = useState<Key>(hasVisited ? "signIn" : "signUp");

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
