import { FindOptionDto } from "./find-option";

export type PlaceDto = {
  name: string;
  image: string[];
  review: string[];
};

export type CreatePlaceDto = PlaceDto;
export type UpdatePlaceDto = Partial<Omit<PlaceDto, "name">>;
export type FindPlaceDto = FindOptionDto &
  Partial<Omit<PlaceDto, "image" | "review">>;
