'use client';
import { useState, type FormEvent } from "react";
import { FiPlus } from "react-icons/fi";
import { Label, Input } from "../ui/FormInput";
import Select from "../ui/form/Select";
import { BusinessFormValues } from "@/types/BusinessType";
import { supabaseBrowserClient } from "@/lib/supabase/supabaseClient";
import { toast } from 'sonner';
 
const CATEGORY_OPTIONS = [
  { label: "Retail", value: "retail" },
  { label: "Restaurant & food", value: "restaurant" },
  { label: "Fashion & apparel", value: "fashion" },
  { label: "Grocery & supermarket", value: "grocery" },
  { label: "Electronics", value: "electronics" },
  { label: "Health & beauty", value: "health-beauty" },
  { label: "Services", value: "services" },
  { label: "Other", value: "other" },
];

type BusinessFormErrors = Partial<Record<keyof BusinessFormValues, string>>;

interface CreateBusinessFormProps {
  compact?: boolean;
}

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export default function CreateBusinessForm({ compact = false }: CreateBusinessFormProps) {
  const [expanded, setExpanded] = useState(!compact);
  const [values, setValues] = useState<BusinessFormValues>({
    name: "",
    category: "",
    phone: "",
  });
  const [errors, setErrors] = useState<BusinessFormErrors>({});
  const [submitting, setSubmitting] = useState(false);

  const handleChange =
    (field: keyof BusinessFormValues) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setValues((prev) => ({ ...prev, [field]: e.target.value }));
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    };

  const validate = (): BusinessFormErrors => {
    const next: BusinessFormErrors = {};
    if (!values.name.trim()) next.name = "Enter a business name";
    if (!values.category) next.category = "Choose a category";
    if (!values.phone.trim()) {
      next.phone = "Enter a phone number";
    } else if (!/^[0-9+\-()\s]{7,}$/.test(values.phone.trim())) {
      next.phone = "Enter a valid phone number";
    }
    return next;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!apiUrl) {
      throw new Error("APi URL is not define");
      return;
    }

    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setSubmitting(true);

    try {
      const supabase = await supabaseBrowserClient();

      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError || !session) {
        throw new Error('Authentication required');
      }

      const res = await fetch(`${apiUrl}/api/business`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify(values),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);

        throw new Error(
          data?.message ?? 'Failed to create business'
        );
      }

      const data = await res.json();

      return data;
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : 'Failed to create business'
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (compact && !expanded) {
    return (
      <button
        type="button"
        onClick={() => setExpanded(true)}
        className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-border-strong bg-surface py-4 text-sm font-medium text-muted hover:border-primary hover:text-primary"
      >
        <FiPlus size={16} />
        Add another business
      </button>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-surface p-6">
      <h2 className="text-base font-semibold text-foreground">
        {compact ? "Add another business" : "Create your business"}
      </h2>

      <form onSubmit={handleSubmit} noValidate className="mt-5 flex flex-col gap-4">
        <div>
          <Label htmlFor="business-name" required>
            Business name
          </Label>
          <Input
            id="business-name"
            value={values.name}
            onChange={handleChange("name")}
            placeholder="Jane's Boutique"
            error={errors.name}
          />
        </div>

        <div>
          <Label htmlFor="business-category" required>
            Business category
          </Label>
          <Select
            id="business-category"
            value={values.category}
            onChange={handleChange("category")}
            placeholder="Select a category"
            options={CATEGORY_OPTIONS}
            error={errors.category}
          />
        </div>

        <div>
          <Label htmlFor="business-phone" required>
            Phone number
          </Label>
          <Input
            id="business-phone"
            type="tel"
            value={values.phone}
            onChange={handleChange("phone")}
            placeholder="+234 800 000 0000"
            error={errors.phone}
          />
        </div>

        <div className="mt-2 flex items-center gap-3">
          <button
            type="submit"
            disabled={submitting}
            className="rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white hover:bg-primary-hover disabled:opacity-70"
          >
            {submitting ? "Creating…" : "Create business"}
          </button>
          {compact && (
            <button
              type="button"
              onClick={() => setExpanded(false)}
              className="text-sm text-muted hover:text-foreground"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}