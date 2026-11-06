import type { FormData } from "#constants/fields";

export const requestsNameChange = (data: Partial<FormData>) =>
  data.nyCourtOrderRequest === "Name change" ||
  data.nyCourtOrderRequest === "Both";

export const requestsSexDesignationChange = (data: Partial<FormData>) =>
  data.nyCourtOrderRequest === "Sex designation change" ||
  data.nyCourtOrderRequest === "Both";
