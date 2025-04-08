import { PageHeader } from "@/components/app";
import {
  Button,
  Empty,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@/components/common";
import { api } from "@convex/_generated/api";
import type { Doc } from "@convex/_generated/dataModel";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery } from "convex/react";
import { ConvexError } from "convex/values";
import { Check, Clipboard, Key, Plus } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin/early-access/")({
  component: EarlyAccessRoute,
});

const EarlyAccessCodeRow = ({
  code,
}: {
  code: Doc<"earlyAccessCodes">;
}) => {
  const [didCopy, setDidCopy] = useState(false);
  const creator = useQuery(api.users.getById, { userId: code.createdBy });

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(code._id);
    setDidCopy(true);
  }, [code._id]);

  useEffect(() => {
    if (didCopy) {
      setTimeout(() => {
        setDidCopy(false);
      }, 2000);
    }
  }, [didCopy]);

  return (
    <TableRow>
      <TableCell textValue={code._id}>
        <div className="flex items-center gap-2">
          <span className="font-mono">{code._id}</span>
          {!code.claimedAt && (
            <Button
              variant="ghost"
              icon={didCopy ? Check : Clipboard}
              size="small"
              onPress={handleCopy}
              aria-label="Copy code to clipboard"
              isDisabled={didCopy}
            >
              {didCopy ? "Copied!" : "Copy"}
            </Button>
          )}
        </div>
      </TableCell>
      <TableCell>{creator?.name || creator?._id}</TableCell>
      <TableCell>
        {code.claimedAt ? (
          <>Claimed {new Date(code.claimedAt).toLocaleString()}</>
        ) : (
          <span className="text-green-600">Available</span>
        )}
      </TableCell>
    </TableRow>
  );
};

function EarlyAccessRoute() {
  const [isGeneratingCode, setIsGeneratingCode] = useState(false);
  const codes = useQuery(api.earlyAccessCodes.getAll);
  const generateCode = useMutation(api.earlyAccessCodes.create);

  const handleGenerateCode = useCallback(async () => {
    try {
      setIsGeneratingCode(true);
      await generateCode();
    } catch (error) {
      toast.error(
        error instanceof ConvexError
          ? error.message
          : "Failed to generate code",
      );
    } finally {
      setIsGeneratingCode(false);
    }
  }, [generateCode]);

  return (
    <div>
      <PageHeader title="Early Access Codes" mobileBackLink={{ to: "/admin" }}>
        <Button
          onPress={handleGenerateCode}
          icon={Plus}
          variant="primary"
          isDisabled={isGeneratingCode}
        >
          Generate Code
        </Button>
      </PageHeader>

      <Table aria-label="Early Access Codes">
        <TableHeader>
          <TableColumn isRowHeader defaultWidth={400}>
            Code
          </TableColumn>
          <TableColumn>Created By</TableColumn>
          <TableColumn>Status</TableColumn>
        </TableHeader>
        <TableBody
          items={codes}
          renderEmptyState={() => (
            <Empty
              title="No access codes"
              icon={Key}
              button={{
                children: "Generate Code",
                onPress: handleGenerateCode,
              }}
            />
          )}
        >
          {codes?.map((code) => (
            <EarlyAccessCodeRow key={code._id} code={code} />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
