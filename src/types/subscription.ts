export type Subscription = {
  token: string;
  status: "active" | "inactive";
  subscribedAt: string;
  createdAt: string;
  updatedAt: string;
};
