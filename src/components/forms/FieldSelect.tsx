import React, { forwardRef, useId, useMemo } from "react";
import Select, { SingleValue } from "react-select";
import { cn } from "@/lib/utils";

export interface SelectOption {
  label: string;
  value: string;
}

export interface FieldSelectProps {
  label?: string;
  error?: string;
  options: SelectOption[];
  placeholder?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  className?: string;
  id?: string;
  disabled?: boolean;
}

export const FieldSelect = forwardRef<any, FieldSelectProps>(
  ({ label, error, options, placeholder, value, onValueChange, className, id, disabled }, ref) => {
    const autoId = useId();
    const selectId = id || autoId;

    const selectedOption = useMemo(() => {
      return options.find((option) => String(option.value) === String(value)) || null;
    }, [options, value]);

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={selectId} className="mb-2 block text-sm font-medium text-foreground">
            {label}
          </label>
        )}

        <Select<SelectOption, false>
          inputId={selectId}
          ref={ref}
          options={options}
          value={selectedOption}
          placeholder={placeholder}
          isDisabled={disabled}
          className={cn("react-select-container", className)}
          classNamePrefix="react-select"
          onChange={(option: SingleValue<SelectOption>) => {
            onValueChange?.(option?.value ?? "");
          }}
          styles={{
            control: (base, state) => ({
              ...base,
              minHeight: 48,
              height: 48,
              borderRadius: 16,
              backgroundColor: "var(--card)",
              borderColor: error
                ? "var(--destructive)"
                : state.isFocused
                  ? "var(--primary)"
                  : "var(--border)",
              color: "var(--foreground)",
              boxShadow: state.isFocused
                ? "0 0 0 4px color-mix(in oklab, var(--primary) 15%, transparent)"
                : "none",
              transition: "all 0.2s ease",
              "&:hover": {
                borderColor: "var(--primary)",
              },
            }),

            valueContainer: (base) => ({
              ...base,
              padding: "0 12px",
            }),

            input: (base) => ({
              ...base,
              color: "var(--foreground)",
            }),

            singleValue: (base) => ({
              ...base,
              color: "var(--foreground)",
            }),

            placeholder: (base) => ({
              ...base,
              color: "var(--muted-foreground)",
            }),

            menu: (base) => ({
              ...base,
              backgroundColor: "var(--card)",
              border: "1px solid var(--border)",
              borderRadius: 16,
              overflow: "hidden",
              boxShadow: "0 10px 30px rgba(0,0,0,0.12)",
              zIndex: 9999,
            }),

            menuList: (base) => ({
              ...base,
              padding: 6,
            }),

            option: (base, state) => ({
              ...base,
              borderRadius: 12,
              marginBottom: 2,
              paddingTop: 10,
              paddingBottom: 10,
              cursor: "pointer",
              backgroundColor: state.isSelected
                ? "var(--accent)"
                : state.isFocused
                  ? "color-mix(in oklab, var(--accent) 60%, transparent)"
                  : "transparent",
              color: "var(--foreground)",
            }),

            dropdownIndicator: (base) => ({
              ...base,
              color: "var(--muted-foreground)",
            }),

            indicatorSeparator: () => ({
              display: "none",
            }),
          }}
        />

        {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
      </div>
    );
  },
);

FieldSelect.displayName = "FieldSelect";
