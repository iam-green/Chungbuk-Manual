import { eq, like } from "drizzle-orm";
import { db } from "..";
import { CreatePlaceDto, FindPlaceDto, UpdatePlaceDto } from "../type";
import { place } from "../schema";

export class PlaceService {
  static async find(option: FindPlaceDto) {
    const { name, page = 1, limit = 10 } = option;
    return await db.query.place.findMany({
      ...(name && { where: like(place.name, `%${name}%`) }),
      offset: (page - 1) * limit,
      limit,
    });
  }

  static async create(data: CreatePlaceDto) {
    return (await db.insert(place).values(data).returning())[0];
  }

  static async get(name: string) {
    return await db.query.place.findFirst({ where: eq(place.name, name) });
  }

  static async update(name: string, data: UpdatePlaceDto) {
    return (
      await db.update(place).set(data).where(eq(place.name, name)).returning()
    )[0];
  }

  static async delete(name: string) {
    return await db.delete(place).where(eq(place.name, name));
  }
}
