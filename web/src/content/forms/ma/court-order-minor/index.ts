import { defineForm } from "#lib/forms/defineForm";

export default defineForm({
  title: "Court Order: Massachusetts (Under 18)",
  description:
    "If you live in Massachusetts, are under 18, and want to legally update your name, this is the place to start.",
  category: "court-order",
  unlisted: true,
  costs: [
    { title: "Filing fee", amount: 150, required: true },
    { title: "Surcharge fee", amount: 15, required: true },
  ],
});
