import { z } from "zod";

export const quoteBasketItemSchema = z.object({
  slug: z.string().min(1).max(120),
  name: z.string().min(1).max(200),
  quantity: z.number().int().min(1).max(99),
});

// When items are present in the basket, vehicle + parts-needed are not required
// (the items already say what the customer wants). When the basket is empty,
// the customer is doing a raw inquiry and must describe vehicle + parts.
export const quoteSchema = z
  .object({
    name: z.string().min(1, "required").max(100, "tooLong"),
    email: z.email("invalidEmail"),
    phone: z.string().min(1, "required").max(40, "tooLong"),
    vehicleMake: z.string().max(60, "tooLong"),
    vehicleModel: z.string().max(60, "tooLong"),
    vehicleYear: z.string().max(10, "tooLong"),
    vehicleVin: z.string().max(50, "tooLong"),
    partsNeeded: z.string().max(2000, "tooLong"),
    notes: z.string().max(2000, "tooLong"),
    items: z.array(quoteBasketItemSchema).max(50),
  })
  .refine((data) => data.items.length > 0 || data.vehicleMake.length > 0, {
    message: "required",
    path: ["vehicleMake"],
  })
  .refine((data) => data.items.length > 0 || data.vehicleModel.length > 0, {
    message: "required",
    path: ["vehicleModel"],
  })
  .refine(
    (data) => data.items.length > 0 || /^\d{4}$/.test(data.vehicleYear),
    {
      message: "fourDigitYear",
      path: ["vehicleYear"],
    }
  )
  .refine((data) => data.items.length > 0 || data.partsNeeded.length > 0, {
    message: "required",
    path: ["partsNeeded"],
  });

export type QuoteBasketItemPayload = z.infer<typeof quoteBasketItemSchema>;

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
  items: [],
};
