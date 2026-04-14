import type { APIRoute } from "astro";
import { z } from "astro/zod";
import {
  FORM_FEEDBACK_SENTIMENT,
  FORM_SLUGS,
  type FormFeedbackSentiment,
} from "../../constants/forms";
import { isRateLimited } from "../../utils/rateLimitByIp";

const ALLOWED_ORIGINS = ["https://namesake.fyi"];

const FeedbackSchema = z.object({
  form_slug: z.enum(FORM_SLUGS),
  sentiment: z.enum(
    Object.keys(FORM_FEEDBACK_SENTIMENT) as [
      FormFeedbackSentiment,
      ...FormFeedbackSentiment[],
    ],
  ),
  comment: z.string().trim().max(1000).optional(),
});

export const POST: APIRoute = async ({ request, locals }) => {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const result = FeedbackSchema.safeParse(body);
  if (!result.success) {
    return Response.json(
      { error: result.error.issues[0]?.message ?? "Invalid request" },
      { status: 400 },
    );
  }

  const { form_slug, sentiment, comment } = result.data;
  const commentValue = comment || null;

  const ip =
    request.headers.get("CF-Connecting-IP") ??
    request.headers.get("X-Forwarded-For") ??
    null;
  const userAgent = request.headers.get("User-Agent") ?? null;

  const cf = (
    request as Request & {
      cf?: { country?: string; region?: string; city?: string };
    }
  ).cf;
  const country = cf?.country ?? null;
  const region = cf?.region ?? null;
  const city = cf?.city ?? null;

  const env = locals.runtime?.env;
  const db = env?.DB as D1Database | undefined;

  if (!db) {
    return Response.json({ error: "Database unavailable" }, { status: 503 });
  }

  const origin = request.headers.get("Origin") ?? "";
  if (!ALLOWED_ORIGINS.includes(origin)) {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  if (ip && (await isRateLimited({ db, ip, table: "form_feedback" }))) {
    return Response.json({ error: "Too many submissions" }, { status: 429 });
  }

  await db
    .prepare(
      "INSERT INTO form_feedback (form_slug, sentiment, comment, ip, user_agent, country, region, city) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
    )
    .bind(
      form_slug,
      sentiment,
      commentValue,
      ip,
      userAgent,
      country,
      region,
      city,
    )
    .run();

  const resendApiKey = env?.RESEND_API_KEY as string | undefined;
  if (resendApiKey) {
    const sentimentLabel = FORM_FEEDBACK_SENTIMENT[sentiment];
    const location = [city, region, country].filter(Boolean).join(", ");

    try {
      const emailRes = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "noreply@namesake.fyi",
          to: "hey@namesake.fyi",
          subject: `${sentimentLabel} feedback on ${form_slug}`,
          html: `<p>A user ${location ? `in <strong>${location}</strong>` : ""} submitted <strong>${sentimentLabel}</strong> feedback on <a href="https://namesake.fyi/forms/${form_slug}">${form_slug}</a>.</p><p>${commentValue ?? "<em>No comment</em>"}</p>`,
        }),
      });
      if (!emailRes.ok) {
        const errorBody = await emailRes.text();
        console.error(`Resend error ${emailRes.status}: ${errorBody}`);
      }
    } catch (err) {
      console.error("Resend fetch failed:", err);
    }
  }

  return Response.json({ success: true });
};
