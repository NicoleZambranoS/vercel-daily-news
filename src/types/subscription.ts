export type Subscription = {
  token: string;
  status: string;
  subscribedAt: string;
  createdAt: string;
  updatedAt: string;
};

export type SubscriptionResult = {
  success: boolean;
  error?: string;
};
