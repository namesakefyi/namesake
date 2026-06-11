export const GUIDE_CATEGORY_ORDER = [
  "court-order",
  "state-id",
  "birth-certificate",
];

export const categoryRank = (id: string) => {
  const i = GUIDE_CATEGORY_ORDER.indexOf(id);
  return i === -1 ? GUIDE_CATEGORY_ORDER.length : i;
};
