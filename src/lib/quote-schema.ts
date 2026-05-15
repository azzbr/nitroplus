import { z } from "zod";

export const quoteSchema = z.object({
  name: z.string().min(1, "required").max(100, "tooLong"),
  email: z.email("invalidEmail"),
  phone: z.string().min(1, "required").max(40, "tooLong"),
  vehicleMake: z.string().min(1, "required").max(60, "tooLong"),
  vehicleModel: z.string().min(1, "required").max(60, "tooLong"),
  vehicleYear: z.string().regex(/^\d{4}$/, "fourDigitYear"),
  vehicleVin: z.string().max(50, "tooLong"),
  partsNeeded: z.string().min(1, "required").max(2000, "tooLong"),
  notes: z.string().max(2000, "tooLong"),
});

export type QuotePayload = z.infer<typeof quoteSchema>;

export const quoteFormDefaults: QuotePayload = {
  name: "",
  email: "",
  phone: "",
  vehicleMake: "",
  vehicleModel: "",
  vehicleYear: "",
  vehicleVin: "",
  partsNeeded: "",
  notes: "",
};
