import { useAuthActions } from "@convex-dev/auth/react";
import { RiCheckLine, RiLoader4Line } from "@remixicon/react";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { useMutation, useQuery } from "convex/react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { api } from "../../../convex/_generated/api";
import type { Theme } from "../../../convex/constants";
import {
  Button,
  Container,
  Link,
  Modal,
  PageHeader,
  Radio,
  RadioGroup,
  Switch,
  TextField,
} from "../../components";

export const Route = createFileRoute("/settings/")({
  beforeLoad: ({ context }) => {
    if (!context.auth.isAuthenticated) {
      throw redirect({
        to: "/signin",
      });
    }
  },
  component: SettingsRoute,
});

function SettingsRoute() {
  const { signOut } = useAuthActions();
  const { setTheme } = useTheme();
  const user = useQuery(api.users.getCurrentUser);

  // Name change field
  // TODO: Extract all this debounce logic + field as a component for reuse
  const updateName = useMutation(api.users.setCurrentUserName);
  const [name, setName] = useState<string>(user?.name ?? "");
  const [isUpdatingName, setIsUpdatingName] = useState(false);
  const [didUpdateName, setDidUpdateName] = useState(false);

  useEffect(() => {
    if (!user?.name) return;
    setName(user.name);
  }, [user]);

  let timeout: NodeJS.Timeout | null = null;

  useEffect(() => {
    if (timeout) clearTimeout(timeout);
    if (didUpdateName)
      timeout = setTimeout(() => setDidUpdateName(false), 2000);
  }, [didUpdateName, timeout]);

  const debouncedNameSave = useDebouncedCallback((name) => {
    updateName({ name })
      .then(() => {
        setIsUpdatingName(false);
        setDidUpdateName(true);
      })
      .catch((error) => {
        console.error(error);
        setIsUpdatingName(false);
      });
  }, 1000);

  const handleUpdateName = (value: string) => {
    setIsUpdatingName(true);
    setName(value);
    debouncedNameSave(value);
  };

  const textFieldIcon = isUpdatingName ? (
    <RiLoader4Line size={20} className="animate animate-spin mr-2" />
  ) : didUpdateName ? (
    <RiCheckLine
      size={20}
      className="text-green-9 dark:text-greendark-9 mr-2"
    />
  ) : undefined;

  // Is minor switch
  const updateIsMinor = useMutation(api.users.setCurrentUserIsMinor);

  // Theme change
  const updateTheme = useMutation(api.users.setUserTheme);

  const handleUpdateTheme = (value: string) => {
    updateTheme({ theme: value as Theme });
    setTheme(value);
  };

  // Account deletion
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const deleteAccount = useMutation(api.users.deleteCurrentUser);

  return (
    <Container className="max-w-md">
      <PageHeader title="Settings" />
      {user === undefined ? (
        "Loading..."
      ) : user === null ? (
        "User not found, please reload"
      ) : (
        <div className="flex flex-col gap-4">
          <TextField
            label="Name"
            name="name"
            value={name}
            onChange={handleUpdateName}
            description="How do you want to be addressed?"
            rightIcon={textFieldIcon}
          />
          <Switch
            name="isMinor"
            isSelected={user.isMinor}
            onChange={() => updateIsMinor({ isMinor: !user.isMinor })}
          >
            Is minor
          </Switch>
          <RadioGroup
            label="Theme"
            value={user.theme}
            onChange={handleUpdateTheme}
          >
            <Radio value="system">System</Radio>
            <Radio value="light">Light</Radio>
            <Radio value="dark">Dark</Radio>
          </RadioGroup>
          <Button onPress={signOut}>Sign out</Button>
          <Button onPress={() => setIsDeleteModalOpen(true)}>
            Delete account
          </Button>
          <Modal
            isOpen={isDeleteModalOpen}
            onOpenChange={(isOpen) => setIsDeleteModalOpen(isOpen)}
          >
            Delete account?
            <div className="flex justify-between w-full gap-4">
              <Button onPress={() => setIsDeleteModalOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                onPress={() => {
                  deleteAccount();
                  signOut();
                }}
              >
                Delete
              </Button>
            </div>
          </Modal>
        </div>
      )}
      <div className="flex gap-2 items-center mt-4">
        <Link
          href="https://github.com/namesakefyi/namesake/releases"
          target="_blank"
          rel="noreferrer"
        >{`Namesake v${APP_VERSION}`}</Link>
        <Link
          href="https://status.namesake.fyi"
          target="_blank"
          rel="noreferrer"
        >
          System Status
        </Link>
      </div>
    </Container>
  );
}
