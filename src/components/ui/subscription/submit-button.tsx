"use client";

import clsx from "clsx";
import { useState } from "react";
import { SubscriptionModal } from "./subscription-modal";

type SubmitButtonProps = {
  subscribed?: boolean;
  className?: string;
};

export default function SubmitButton({
  subscribed = false,
  className,
}: SubmitButtonProps) {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <button
        className={clsx("cursor-pointer", className)}
        onClick={() => setShowModal(true)}
      >
        {subscribed ? "Unsubscribe" : "Subscribe"}
      </button>
      {showModal && (
        <SubscriptionModal
          onClose={() => setShowModal(false)}
          subscribed={subscribed}
        />
      )}
    </>
  );
}
