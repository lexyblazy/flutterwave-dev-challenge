import normalize from "normalize-email";

export const normalizeEmail = (email: string) => {
  return normalize(email);
};
