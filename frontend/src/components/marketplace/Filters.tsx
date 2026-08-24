import { Search, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { mockCategories } from "@/lib/mock-data";

export interface FilterValues {
  category: string;
  condition: string;
  location: string;
  minPrice: string;
  maxPrice: string;
}

export const emptyFilters: FilterValues = {
  category: "all",
  condition: "all",
  location: "all",
  minPrice: "",
  maxPrice: "",
};

export const conditions = ["New", "Like New", "Good", "Fair"];
export const locations = [
  "North Hall",
  "South Residence",
  "Library Block",
  "Engineering Building",
  "Science Faculty",
  "Student Center",
  "West Gate",
];

export function SearchBar({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="relative flex-1">
      <Search
        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
        aria-hidden="true"
      />
      <Label htmlFor="product-search" className="sr-only">
        Search products
      </Label>
      <Input
        id="product-search"
        type="search"
        placeholder="Search products..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-9"
      />
    </div>
  );
}

export function SortSelect({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="w-full sm:w-48">
      <Label htmlFor="sort-select" className="sr-only">
        Sort products
      </Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger id="sort-select">
          <SelectValue placeholder="Sort" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="newest">Newest</SelectItem>
          <SelectItem value="oldest">Oldest</SelectItem>
          <SelectItem value="price-asc">Lowest Price</SelectItem>
          <SelectItem value="price-desc">Highest Price</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

export function FilterPanel({
  values,
  onChange,
  onReset,
}: {
  values: FilterValues;
  onChange: (v: FilterValues) => void;
  onReset: () => void;
}) {
  const set = (patch: Partial<FilterValues>) => onChange({ ...values, ...patch });

  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="filter-category">Category</Label>
        <Select value={values.category} onValueChange={(v) => set({ category: v })}>
          <SelectTrigger id="filter-category">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            {mockCategories.map((c) => (
              <SelectItem key={c.id} value={String(c.id)}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="filter-condition">Condition</Label>
        <Select value={values.condition} onValueChange={(v) => set({ condition: v })}>
          <SelectTrigger id="filter-condition">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Any condition</SelectItem>
            {conditions.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="filter-location">Location</Label>
        <Select value={values.location} onValueChange={(v) => set({ location: v })}>
          <SelectTrigger id="filter-location">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Anywhere on campus</SelectItem>
            {locations.map((l) => (
              <SelectItem key={l} value={l}>
                {l}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <fieldset className="space-y-2">
        <legend className="text-sm font-medium text-foreground">Price range (BDT)</legend>
        <div className="flex items-center gap-2">
          <Label htmlFor="filter-min" className="sr-only">
            Minimum price
          </Label>
          <Input
            id="filter-min"
            type="number"
            min={0}
            inputMode="numeric"
            placeholder="Min"
            value={values.minPrice}
            onChange={(e) => set({ minPrice: e.target.value })}
          />
          <span className="text-muted-foreground">–</span>
          <Label htmlFor="filter-max" className="sr-only">
            Maximum price
          </Label>
          <Input
            id="filter-max"
            type="number"
            min={0}
            inputMode="numeric"
            placeholder="Max"
            value={values.maxPrice}
            onChange={(e) => set({ maxPrice: e.target.value })}
          />
        </div>
      </fieldset>

      <Button variant="outline" className="w-full" onClick={onReset}>
        Reset filters
      </Button>
    </div>
  );
}

export function MobileFilters(props: {
  values: FilterValues;
  onChange: (v: FilterValues) => void;
  onReset: () => void;
}) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" className="w-full sm:w-auto lg:hidden">
          <SlidersHorizontal className="mr-2 h-4 w-4" aria-hidden="true" />
          Filters
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-80 overflow-y-auto">
        <SheetTitle className="mb-6">Filters</SheetTitle>
        <FilterPanel {...props} />
      </SheetContent>
    </Sheet>
  );
}
