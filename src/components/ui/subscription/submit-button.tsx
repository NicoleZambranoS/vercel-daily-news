"use client";

import clsx from "clsx";
import { useFormStatus } from "react-dom";
import { Loader2 } from "lucide-react";

type SubmitButtonProps = {
    action: () => Promise<void>;
    children: React.ReactNode;
    className?: string;
}

type ButtonDetailsProps = {
    children: React.ReactNode;
    className?: string;
}

function ButtonDetails({ children, className }: ButtonDetailsProps) {
    const { pending } = useFormStatus();

    return (
        <button
            type="submit"
            disabled={pending}
            className={clsx("cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed", className ?? "")}
        >
            {pending && <Loader2 className="w-3.5 h-3.5 animate-spin shrink-0" />}
            {children}
        </button>
    );
}

export default function SubmitButton({ action, children, className }: SubmitButtonProps) {
    return (
        <form action={action}>
            <ButtonDetails className={className}>{children}</ButtonDetails>
        </form>
    );
}
