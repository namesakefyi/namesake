"use node";

import { v } from "convex/values";
import PDFParser from "pdf2json";
import { api } from "./_generated/api";
import { action } from "./_generated/server";

export const parse = action({
  args: { formId: v.id("forms") },
  handler: async (ctx, args) => {
    console.log("Parsing form", args.formId);
    const form = await ctx.runQuery(api.forms.getById, { formId: args.formId });
    if (!form || !form.file) throw Error("Form not found");

    const url = await ctx.storage.getUrl(form.file);
    if (!url) throw Error("Form URL not found");
    console.log("URL", url);

    const pdfParser = new PDFParser(this, true);

    pdfParser.loadPDF(url);

    pdfParser.on("pdfParser_dataError", (errData) =>
      console.error(errData.parserError),
    );

    pdfParser.on("pdfParser_dataReady", (pdfData) => {
      console.log("Form parsed", pdfData);
      ctx.runMutation(api.forms.setJSON, {
        formId: args.formId,
        json: JSON.stringify(pdfData),
      });
    });
  },
});
