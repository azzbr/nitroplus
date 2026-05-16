import { z } from "zod";

export const MAX_CV_SIZE_BYTES = 5 * 1024 * 1024;
export const ACCEPTED_CV_MIME = "application/pdf";

export const applySchema = z.object({
  name: z.string().min(1, "required").max(100, "tooLong"),
  email: z.email("invalidEmail"),
  phone: z.string().min(1, "required").max(40, "tooLong"),
  yearsExperience: z.string().max(40, "tooLong"),
  jobSlug: z.string().max(120),
  jobTitle: z.string().max(200),
  coverNote: z.string().max(4000, "tooLong"),
});

export type ApplyPayload = z.infer<typeof applySchema>;

export const applyFormDefaults: ApplyPayload = {
  name: "",
  email: "",
  phone: "",
  yearsExperience: "",
  jobSlug: "",
  jobTitle: "",
  coverNote: "",
};
