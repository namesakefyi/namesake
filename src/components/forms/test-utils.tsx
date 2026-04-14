import { type RenderOptions, render } from "@testing-library/react";
import type React from "react";
import type { ReactElement } from "react";
import { FormProvider, useForm } from "react-hook-form";

const FormProviderWrapper = ({ children }: { children: React.ReactNode }) => {
  const form = useForm();

  return <FormProvider {...form}>{children}</FormProvider>;
};

export const renderWithFormProvider = (
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">,
) => render(ui, { wrapper: FormProviderWrapper, ...options });

export * from "@testing-library/react";
