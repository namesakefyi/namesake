import { type RenderOptions, render } from "@testing-library/react";
import type React from "react";
import type { ReactElement } from "react";
import { FormProvider, useForm } from "react-hook-form";

const FormProviderWrapper = ({
  children,
  defaultValues,
}: {
  children: React.ReactNode;
  defaultValues?: Record<string, unknown>;
}) => {
  const form = useForm({ defaultValues });
  return <FormProvider {...form}>{children}</FormProvider>;
};

export const renderWithFormProvider = (
  ui: ReactElement,
  {
    defaultValues,
    ...options
  }: Omit<RenderOptions, "wrapper"> & {
    defaultValues?: Record<string, unknown>;
  } = {},
) =>
  render(ui, {
    wrapper: ({ children }) => (
      <FormProviderWrapper defaultValues={defaultValues}>
        {children}
      </FormProviderWrapper>
    ),
    ...options,
  });

export * from "@testing-library/react";
