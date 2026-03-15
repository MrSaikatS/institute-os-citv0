"use client";

import { VisitorFormType, visitorSchema } from "@/lib/zodSchema";
import { createVisitor } from "@/server/visitor";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2Icon, SaveIcon } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { Button } from "../../shadcnui/button";
import { Field, FieldError, FieldLabel } from "../../shadcnui/field";
import { Input } from "../../shadcnui/input";

interface VisitorFormProps {
  onSuccess?: () => void;
}

const VisitorForm = ({ onSuccess }: VisitorFormProps) => {
  const {
    handleSubmit,
    control,
    formState: { isSubmitting },
    reset,
  } = useForm<VisitorFormType>({
    resolver: zodResolver(visitorSchema),
    defaultValues: {
      candidateName: "",
      candidatePhone: "",
      candidateWhatsApp: "",
      candidateEmail: "",
      source: "",
    },
    mode: "all",
  });

  const onSubmit = async (data: VisitorFormType) => {
    try {
      const response = await createVisitor(data);

      if (response.success) {
        toast.success(response.message || "Visitor recorded successfully!");
        reset();
        onSuccess?.();
      } else {
        toast.error(response.message || "Failed to record visitor.");
      }
    } catch (err) {
      toast.error(
        err instanceof Error ?
          err.message
        : "Something went wrong. Please try again.",
      );
      console.error(err);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid gap-4 py-4"
      noValidate>
      <Controller
        name="candidateName"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>Candidate Name</FieldLabel>
            <Input
              {...field}
              id={field.name}
              placeholder="Full name of the visitor"
              aria-invalid={fieldState.invalid}
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <Controller
        name="candidatePhone"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>Phone Number</FieldLabel>
            <Input
              {...field}
              id={field.name}
              placeholder="e.g. 9876543210"
              aria-invalid={fieldState.invalid}
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <Controller
        name="candidateWhatsApp"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>
              WhatsApp Number (Optional)
            </FieldLabel>
            <Input
              {...field}
              id={field.name}
              placeholder="e.g. 9876543210"
              aria-invalid={fieldState.invalid}
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <Controller
        name="candidateEmail"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>
              Email Address (Optional)
            </FieldLabel>
            <Input
              {...field}
              id={field.name}
              type="email"
              placeholder="visitor@example.com"
              aria-invalid={fieldState.invalid}
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <Controller
        name="source"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>
              Source (How they heard about us)
            </FieldLabel>
            <Input
              {...field}
              id={field.name}
              placeholder="e.g. Facebook, Newspaper, Referral"
              aria-invalid={fieldState.invalid}
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <Button
        className="mt-2 w-full"
        type="submit"
        disabled={isSubmitting}>
        {isSubmitting ?
          <>
            <Loader2Icon className="mr-2 animate-spin" /> Saving...
          </>
        : <>
            <SaveIcon className="mr-2" /> Record Visitor
          </>
        }
      </Button>
    </form>
  );
};

export default VisitorForm;
