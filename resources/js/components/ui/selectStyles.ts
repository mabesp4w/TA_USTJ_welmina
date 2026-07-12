import type { StylesConfig } from "react-select";

export const reactSelectStyles: StylesConfig<any, false> = {
    control: (base) => ({
        ...base,
        border: "none",
        boxShadow: "none",
        minHeight: "unset",
        background: "transparent",
    }),
    valueContainer: (base) => ({
        ...base,
        padding: 0,
    }),
    input: (base) => ({
        ...base,
        margin: 0,
        padding: 0,
    }),
    indicatorSeparator: () => ({ display: "none" }),
    dropdownIndicator: (base) => ({
        ...base,
        padding: 0,
        color: "var(--color-base-content/50)",
    }),
    menu: (base) => ({
        ...base,
        zIndex: 50,
    }),
    menuPortal: (base) => ({
        ...base,
        zIndex: 9999,
    }),
    placeholder: (base) => ({
        ...base,
        fontSize: "0.875rem",
    }),
};
