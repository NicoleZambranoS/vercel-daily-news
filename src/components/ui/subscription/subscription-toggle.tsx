"use client";

import { subscribe, unsubscribe } from "@/actions/subscription";
import SubmitButton from "@/components/ui/subscription/submit-button";

type SubscriptionToggleProps = {
    subscribed: boolean;
}

export default function SubscriptionToggle({ subscribed }: SubscriptionToggleProps) {
    if (subscribed) {
        return (
            <div className="flex items-center gap-2">
                {/* Subscribed badge */}
                <span className="hidden sm:flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-linear-to-r from-purple-600 to-blue-600 text-white">
                    Subscribed
                </span>
                {/* Unsubscribe button */}
                <SubmitButton action={unsubscribe} className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border border-gray-200 text-gray-600 hover:border-gray-400 hover:text-black transition-colors">
                    Unsubscribe
                </SubmitButton>
            </div>
        );
    }

    return (
        <SubmitButton action={subscribe} className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-linear-to-r from-purple-600 to-blue-600 text-white hover:opacity-90 transition-opacity">
            Subscribe
        </SubmitButton>
    );
}
