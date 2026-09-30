"use client";

import { useState } from "react";
import Link from "next/link";
import { FiBriefcase, FiEdit2, FiTrash2, FiCheck, FiX, FiArrowRight } from "react-icons/fi";
import { Input } from "../ui/FormInput";
import Select from "../ui/form/Select";
import { Business, BusinessFormValues as BusinessDraft } from "@/types/BusinessType";
import { CATEGORY_OPTIONS } from "@/lib/data/BusinessCategory";
import { deleteBusinessById, editBusinessById } from "@/lib/data/BusinessData";
import { toast } from "sonner";
import { browserApi } from "@/lib/api/browserApi";

export default function BusinessList({ businesses }: { businesses: Business[] }) {
  const [items, setItems] = useState<Business[]>(businesses);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<BusinessDraft>({
    name: "",
    category: "",
    phoneNumber: "",
  });

  const startEdit = (business: Business) => {
    setEditingId(business.id);
    setDraft({
      name: business.name,
      category: business.category,
      phoneNumber: business.phoneNumber,
    });
  };

  const cancelEdit = () => setEditingId(null);

  const handleDraftChange =
    (field: keyof BusinessDraft) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setDraft((prev) => ({ ...prev, [field]: e.target.value }));
    };

  const handleSaveEdit = async (business: Business) => {
    try {
      const editedBusiness = await editBusinessById(browserApi, business.id, draft);
      
      setItems((prev) =>
        prev.map((item) =>
          item.id === editedBusiness.id ? editedBusiness : item
        )
      );

      toast.success(`Business ${business.slug} has been edited`);
    } catch (error) {
      toast.error(
        error instanceof Error ?
        error.message :
        "Failed to edit business"
      )
    } finally {
      setEditingId(null);
    }
  };

  const handleConfirmDelete = (business: Business) => {
    toast("Delete business?", {
      description: `"${business.name}" will be permanently deleted.`,

      action: {
        label: "Delete",
        onClick: async () => {
          try {
            await deleteBusinessById(browserApi, business.id);

            setItems((prev) =>
              prev.filter((item) => item.id !== business.id)
            );

            toast.success(`"${business.name}" deleted successfully.`);
          } catch (error) {
            console.error("Failed to delete business:", error);

            toast.error("Failed to delete business. Please try again.");
          }
        },
      },

      cancel: {
        label: "Cancel",
        onClick: () => {
          // Nothing needed here
        },
      },
    });
  };

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border-strong bg-surface px-6 py-16 text-center">
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary-tint text-primary">
          <FiBriefcase size={20} />
        </div>
        <h3 className="mt-4 text-sm font-medium text-foreground">
          No businesses yet
        </h3>
        <p className="mt-1 max-w-xs text-sm text-muted">
          Once you create a business, it will show up here.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 p-2">
      {items.map((business) => {
        const isEditing = editingId === business.id;

        return (
          <div
            key={business.id}
            className="rounded-xl border border-border bg-surface p-5"
          >
            <div className="flex items-start justify-between">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-tint text-primary">
                <FiBriefcase size={16} />
              </div>

              <div className="flex items-center gap-1">
                {isEditing ? (
                  <>
                    <button
                      type="button"
                      onClick={() => handleSaveEdit(business)}
                      aria-label="Save changes"
                      className="rounded-md p-1.5 text-muted hover:bg-primary-tint hover:text-primary"
                    >
                      <FiCheck size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={cancelEdit}
                      aria-label="Cancel editing"
                      className="rounded-md p-1.5 text-muted hover:bg-sunken hover:text-foreground"
                    >
                      <FiX size={14} />
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => startEdit(business)}
                      aria-label={`Edit ${business.name}`}
                      className="rounded-md p-1.5 text-muted hover:bg-sunken hover:text-foreground cursor-pointer"
                    >
                      <FiEdit2 size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleConfirmDelete(business)}
                      aria-label={`Delete ${business.name}`}
                      className="rounded-md p-1.5 text-muted hover:bg-danger-tint hover:text-danger cursor-pointer"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </>
                )}
              </div>
            </div>

            {isEditing ? (
              <div className="mt-3 flex flex-col gap-3">
                <Input
                  aria-label="Business name"
                  value={draft.name}
                  onChange={handleDraftChange("name")}
                />
                <Select
                  aria-label="Business category"
                  value={draft.category}
                  onChange={handleDraftChange("category")}
                  options={CATEGORY_OPTIONS}
                />
                <Input
                  aria-label="Phone number"
                  type="tel"
                  value={draft.phoneNumber}
                  onChange={handleDraftChange("phoneNumber")}
                />
              </div>
            ) : (
              <>
                <h3 className="mt-3 text-sm font-medium text-foreground">
                  {business.name}
                </h3>
                <p className="mt-0.5 text-sm text-muted">{business.category}</p>
                <p className="mt-2 text-xs text-subtle">{business.phoneNumber}</p>

                <Link
                  href={`/dashboard/${business.slug}`}
                  className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                >
                  View dashboard
                  <FiArrowRight size={12} />
                </Link>
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}