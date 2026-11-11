import type { APIRoute, GetStaticPaths } from "astro";
import type { FormMeta } from "#constants/forms";
import { allForms } from "#lib/forms/allForms";
import { createOgImageResponse } from "#lib/utils/createOgImageResponse";

export const getStaticPaths: GetStaticPaths = () =>
  Object.entries(allForms).map(([id, form]) => ({
    params: { id },
    props: { form },
  }));

export const GET: APIRoute<{ form: FormMeta }> = async ({ props, request }) =>
  createOgImageResponse({
    subhead: "Name Change Form",
    title: props.form.title,
    color: "white",
    origin: new URL(request.url).origin,
  });
