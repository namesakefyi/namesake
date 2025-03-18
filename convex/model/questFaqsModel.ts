import type { Id } from "../_generated/dataModel";
import type { MutationCtx, QueryCtx } from "../_generated/server";
import * as Quests from "./questsModel";

async function updateParentQuest(
  ctx: MutationCtx,
  questId: Id<"quests">,
  userId: Id<"users">,
) {
  await ctx.db.patch(questId, {
    updatedAt: Date.now(),
    updatedBy: userId,
  });
}

export async function getByIds(
  ctx: QueryCtx,
  { questFaqIds }: { questFaqIds: Id<"questFaqs">[] },
) {
  if (!questFaqIds) return [];

  const questFaqs = await Promise.all(
    questFaqIds.map(async (questFaqId) => {
      const questFaq = await ctx.db.get(questFaqId);
      return questFaq;
    }),
  );
  return questFaqs.filter((faq) => faq !== null);
}

export async function create(
  ctx: MutationCtx,
  {
    userId,
    question,
    answer,
  }: {
    userId: Id<"users">;
    question: string;
    answer: string;
  },
) {
  return await ctx.db.insert("questFaqs", {
    question,
    answer,
    author: userId,
    updatedAt: Date.now(),
  });
}

export async function update(
  ctx: MutationCtx,
  {
    questFaqId,
    question,
    answer,
    userId,
  }: {
    questFaqId: Id<"questFaqs">;
    question: string;
    answer: string;
    userId: Id<"users">;
  },
) {
  const questFaq = await ctx.db.get(questFaqId);
  if (!questFaq) throw new Error("Quest FAQ not found");

  const quest = await Quests.getByFaqId(ctx, { questFaqId });
  if (quest) {
    await updateParentQuest(ctx, quest._id, userId);
  }

  return await ctx.db.patch(questFaqId, {
    question,
    answer,
    updatedAt: Date.now(),
  });
}

export async function deleteForever(
  ctx: MutationCtx,
  { questFaqId, userId }: { questFaqId: Id<"questFaqs">; userId: Id<"users"> },
) {
  const questFaq = await ctx.db.get(questFaqId);
  if (!questFaq) throw new Error("Quest FAQ not found");

  const quest = await Quests.getByFaqId(ctx, { questFaqId });
  if (quest) {
    await updateParentQuest(ctx, quest._id, userId);
    await Quests.deleteFaq(ctx, { questId: quest._id, userId, questFaqId });
  }

  return await ctx.db.delete(questFaqId);
}
