import { useState, type FormEvent } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { conditions, locations } from "./Filters";
import { mockCategories } from "@/lib/mock-data";
import type { Product } from "@/types";

export interface ProductFormValues {
  name: string;
  description: string;
  price: string;
  category: string;
  condition: string;
  image: string;
  location: string;
  contact: string;
}

type Errors = Partial<Record<keyof ProductFormValues, string>>;

export function ProductForm({ product, mode }: { product?: Product; mode: "create" | "edit" }) {
  const navigate = useNavigate();
  const [values, setValues] = useState<ProductFormValues>({
    name: product?.name ?? "",
    description: product?.description ?? "",
    price: product ? String(product.price) : "",
    category: product ? String(product.category_id) : "",
    condition: product?.condition ?? "",
    image: product?.image ?? "",
    location: product?.location ?? "",
    contact: product?.contact_information ?? "",
  });
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  const set = (patch: Partial<ProductFormValues>) => setValues((v) => ({ ...v, ...patch }));

  const validate = () => {
    const e: Errors = {};
    if (!values.name.trim()) e.name = "Product name is required.";
    if (values.description.trim().length < 10) e.description = "Add at least 10 characters of description.";
    if (!values.price || Number(values.price) <= 0) e.price = "Enter a price greater than 0.";
    if (!values.category) e.category = "Select a category.";
    if (!values.condition) e.condition = "Select a condition.";
    if (!values.location) e.location = "Select a campus location.";
    if (!values.contact.trim()) e.contact = "Contact information is required.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    setStatus("idle");
    if (!validate()) {
      setStatus("error");
      return;
    }
    setStatus("submitting");
    // Frontend phase: no API call. POST/PUT /products goes here later.
    window.setTimeout(() => setStatus("success"), 700);
  };

  const err = (key: keyof ProductFormValues) =>
    errors[key] ? (
      <p id={`${key}-error`} className="text-xs text-destructive">
        {errors[key]}
      </p>
    ) : null;

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-6">
      {status === "success" && (
        <Alert className="border-success/40 bg-success/10">
          <AlertTitle>{mode === "create" ? "Listing created" : "Changes saved"}</AlertTitle>
          <AlertDescription>
            This is a frontend demonstration — nothing has been sent to a server yet.
          </AlertDescription>
        </Alert>
      )}
      {status === "error" && (
        <Alert variant="destructive">
          <AlertTitle>Please fix the highlighted fields</AlertTitle>
          <AlertDescription>Some required information is missing or invalid.</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="name">Product name</Label>
          <Input
            id="name"
            value={values.name}
            onChange={(e) => set({ name: e.target.value })}
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? "name-error" : undefined}
          />
          {err("name")}
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            rows={5}
            value={values.description}
            onChange={(e) => set({ description: e.target.value })}
            aria-invalid={!!errors.description}
            aria-describedby={errors.description ? "description-error" : undefined}
          />
          {err("description")}
        </div>

        <div className="space-y-2">
          <Label htmlFor="price">Price (BDT)</Label>
          <Input
            id="price"
            type="number"
            min={0}
            value={values.price}
            onChange={(e) => set({ price: e.target.value })}
            aria-invalid={!!errors.price}
            aria-describedby={errors.price ? "price-error" : undefined}
          />
          {err("price")}
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select value={values.category} onValueChange={(v) => set({ category: v })}>
            <SelectTrigger id="category" aria-invalid={!!errors.category}>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {mockCategories.map((c) => (
                <SelectItem key={c.id} value={String(c.id)}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {err("category")}
        </div>

        <div className="space-y-2">
          <Label htmlFor="condition">Condition</Label>
          <Select value={values.condition} onValueChange={(v) => set({ condition: v })}>
            <SelectTrigger id="condition" aria-invalid={!!errors.condition}>
              <SelectValue placeholder="Select condition" />
            </SelectTrigger>
            <SelectContent>
              {conditions.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {err("condition")}
        </div>

        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Select value={values.location} onValueChange={(v) => set({ location: v })}>
            <SelectTrigger id="location" aria-invalid={!!errors.location}>
              <SelectValue placeholder="Select location" />
            </SelectTrigger>
            <SelectContent>
              {locations.map((l) => (
                <SelectItem key={l} value={l}>
                  {l}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {err("location")}
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="image">Product image URL</Label>
          <Input
            id="image"
            value={values.image}
            onChange={(e) => set({ image: e.target.value })}
            placeholder="https://…"
          />
          <p className="text-xs text-muted-foreground">
            File upload will be handled by the API later; a URL is used for this phase.
          </p>
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="contact">Contact information</Label>
          <Input
            id="contact"
            value={values.contact}
            onChange={(e) => set({ contact: e.target.value })}
            placeholder="Phone number or campus email"
            aria-invalid={!!errors.contact}
            aria-describedby={errors.contact ? "contact-error" : undefined}
          />
          {err("contact")}
        </div>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row">
        <Button type="submit" disabled={status === "submitting"}>
          {status === "submitting"
            ? "Saving…"
            : mode === "create"
              ? "Create listing"
              : "Save changes"}
        </Button>
        <Button type="button" variant="outline" onClick={() => navigate({ to: "/dashboard/listings" })}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
