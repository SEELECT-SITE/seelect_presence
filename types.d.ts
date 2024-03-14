declare module "*.pdf";

export type MongoDBUser = {
  id: number;
  name: string;
  email: string;
  pers_key?: string;
  events: { title: string; days: boolean[]; hours_per_day: number[] }[];
};
export type EventProps = {
  title: string;
  participants: { id: number; name: string; days: boolean[] }[];
};
