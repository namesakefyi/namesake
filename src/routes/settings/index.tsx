import { useAuthActions } from "@convex-dev/auth/react";
import { RiCheckLine, RiLoader4Line } from "@remixicon/react";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { useMutation, useQuery } from "convex/react";
import { useEffect, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { api } from "../../../convex/_generated/api";
import {
  Button,
  Container,
  Link,
  Modal,
  PageHeader,
  Switch,
  TextField,
} from "../../components/shared";

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
  const user = useQuery(api.users.getCurrentUser);
  const version = "APP_VERSION";

  // Name change field
  // TODO: Extract all this debounce logic + field as a component for reuse
  const updateName = useMutation(api.users.setCurrentUserName);
  const [name, setName] = useState(user?.name);
  const [isUpdatingName, setIsUpdatingName] = useState(false);
  const [didUpdateName, setDidUpdateName] = useState(false);

  useEffect(() => {
    setName(user?.name);
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
      <a
        href={`https://github.com/namesakefyi/namesake/releases/tag/v${APP_VERSION}`}
        target="_blank"
        rel="noreferrer"
        className="inline-block mt-4"
      >{`Namesake v${APP_VERSION}`}</a>
    </Container>
  );
}
