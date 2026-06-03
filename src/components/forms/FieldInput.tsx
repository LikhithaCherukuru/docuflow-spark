import { forwardRef, type InputHTMLAttributes, useId, useState } from "react";
import { cn } from "@/lib/utils";
import { Eye, EyeOff, type LucideIcon } from "lucide-react";

export interface FieldInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  icon?: LucideIcon;
  passwordToggle?: boolean;
}

export const FieldInput = forwardRef<HTMLInputElement, FieldInputProps>(
  function FieldInput(
    { label, error, hint, icon: Icon, className, type = "text", passwordToggle, id, ...props },
    ref,
  ) {
    const autoId = useId();
    const inputId = id || autoId;
    const [show, setShow] = useState(false);

    const isPwd = passwordToggle && type === "password";
    const actualType = isPwd ? (show ? "text" : "password") : type;

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="mb-1.5 block text-sm font-medium text-foreground"
          >
            {label}
          </label>
        )}

        <div
          className={cn(
            "group relative flex items-center rounded-xl border bg-background transition-all",
            "focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/15",
            error ? "border-destructive/60" : "border-border",
          )}
        >
          {Icon && (
            <Icon
              className="ml-3 size-4 text-muted-foreground"
              aria-hidden
            />
          )}

          <input
            ref={ref}
            id={inputId}
            type={actualType}
            aria-invalid={!!error}
            aria-describedby={
              error ? `${inputId}-err` : hint ? `${inputId}-hint` : undefined
            }
            className={cn(
              "w-full bg-transparent px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/70 focus:outline-none",
              Icon && "pl-2",
              isPwd && "pr-10",
              className,
            )}
            {...props}
          />

          {isPwd && (
            <button
              type="button"
              onClick={() => setShow((s) => !s)}
              aria-label={show ? "Hide password" : "Show password"}
              className="absolute right-2 inline-flex size-8 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              {show ? (
                <EyeOff className="size-4" />
              ) : (
                <Eye className="size-4" />
              )}
            </button>
          )}
        </div>

        {error ? (
          <p
            id={`${inputId}-err`}
            className="mt-1 text-xs text-destructive"
          >
            {error}
          </p>
        ) : hint ? (
          <p
            id={`${inputId}-hint`}
            className="mt-1 text-xs text-muted-foreground"
          >
            {hint}
          </p>
        ) : null}
      </div>
    );
  },
);

FieldInput.displayName = "FieldInput";