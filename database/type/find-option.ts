export type FindOptionDto = Partial<{
  sort: "asc" | "desc";
  page: number;
  limit: number;
  from: Date;
  to: Date;
}>;
