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
import type { Product, Category } from "@/types";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/services/api";
import { Loader2 } from "lucide-react";

export interface ProductFormValues {
  name: string;
  description: string;
  price: string;
  category: string;
  condition: string;
  imageFile: File | null;
  location: string;
  contact: string;
}

type Errors = Partial<Record<keyof ProductFormValues, string>>;

export function ProductForm({ product, mode }: { product?: Product; mode: "create" | "edit" }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [values, setValues] = useState<ProductFormValues>({
    name: product?.name ?? "",
    description: product?.description ?? "",
    price: product ? String(product.price) : "",
    category: product ? String(product.category_id) : "",
    condition: product?.condition ?? "",
    imageFile: null,
    location: product?.location ?? "",
    contact: product?.contact_information ?? "",
  });
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [serverError, setServerError] = useState<string>("");

  const { data: categories = [], isLoading: categoriesLoading } = useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: api.categories.list,
  });

  const set = (patch: Partial<ProductFormValues>) => setValues((v) => ({ ...v, ...patch }));

  const validate = () => {
    const e: Errors = {};
    if (!values.name.trim()) e.name = "Product name is required.";
    if (values.description.trim().length < 10) e.description = "Add at least 10 characters of description.";
    if (!values.price || isNaN(Number(values.price)) || Number(values.price) < 0) {
      e.price = "Enter a valid positive price.";
    }
    if (!values.category) e.category = "Please choose a category.";
    if (!values.condition) e.condition = "Please choose a condition.";
    if (!values.location) e.location = "Please choose a campus location.";
    if (!values.contact.trim()) e.contact = "Provide a phone number or email.";
    return e;
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setStatus("submitting");

    try {
      const formData = new FormData();
      formData.append("name", values.name.trim());
      formData.append("description", values.description.trim());
      formData.append("price", values.price);
      formData.append("category_id", values.category);
      formData.append("condition", values.condition);
      formData.append("location", values.location);
      formData.append("contact_information", values.contact.trim());
      if (values.imageFile) {
        formData.append("image", values.imageFile);
      }

      if (mode === "create") {
        await api.products.create(formData);
        queryClient.invalidateQueries({ queryKey: ['myListings'] });
        queryClient.invalidateQueries({ queryKey: ['products'] });
        navigate({ to: "/dashboard/listings" });
      } else if (product) {
        await api.products.update(product.id, formData);
        queryClient.invalidateQueries({ queryKey: ['myListings'] });
        queryClient.invalidateQueries({ queryKey: ['products'] });
        setStatus("success");
        navigate({ to: "/dashboard/listings" });
      }
    } catch (err: any) {
      setStatus("error");
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.errors
          ? Object.values(err.response.data.errors).flat().join(" ")
          : "Something went wrong. Please try again.";
      setServerError(msg as string);
    }
  };

  const err = (key: keyof ProductFormValues) =>
    errors[key] ? (
      <p id={`${key}-error`} className="text-xs text-destructive">
        {errors[key]}
      </p>
    ) : null;

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-6" encType="multipart/form-data">
      {status === "success" && (
        <Alert className="border-success/40 bg-success/10">
          <AlertTitle>{mode === "create" ? "Listing created!" : "Changes saved!"}</AlertTitle>
          <AlertDescription>
            Your listing has been {mode === "create" ? "published" : "updated"} on the marketplace.
          </AlertDescription>
        </Alert>
      )}
      {status === "error" && (
        <Alert variant="destructive">
          <AlertTitle>Please fix the highlighted fields</AlertTitle>
          <AlertDescription>{serverError || "Some required information is missing or invalid."}</AlertDescription>
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
              <SelectValue placeholder={categoriesLoading ? "Loading…" : "Select category"} />
            </SelectTrigger>
            <SelectContent>
              {categoriesLoading ? (
                <div className="flex items-center justify-center p-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                </div>
              ) : (
                categories.map((c: Category) => (
                  <SelectItem key={c.id} value={String(c.id)}>
                    {c.name}
                  </SelectItem>
                ))
              )}
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
          <Label htmlFor="image">Product image</Label>
          <Input
            id="image"
            type="file"
            accept="image/*"
            onChange={(e) => set({ imageFile: e.target.files?.[0] ?? null })}
          />
          {product?.image && product.image !== "placeholder.png" && (
            <p className="text-xs text-muted-foreground">
              Current image: <span className="font-medium">{product.image.split("/").pop()}</span>. Upload a new one to replace it.
            </p>
          )}
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
          {status === "submitting" && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
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
