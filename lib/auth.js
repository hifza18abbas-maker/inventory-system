import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function getUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) return null;
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return null;
  }
}

export function validateProduct(body) {
  const name = String(body.name || "").trim();
  const category = String(body.category || "").trim();
  const price = Number(body.price);
  const quantity = Number(body.quantity);
  const image = String(body.image || "");

  if (!name || !category) {
    return { error: "Name and category are required" };
  }
  if (Number.isNaN(price) || price < 0) {
    return { error: "Price must be a number, 0 or more" };
  }
  if (!Number.isInteger(quantity) || quantity < 0) {
    return { error: "Quantity must be a whole number, 0 or more" };
  }
  if (image && (!image.startsWith("data:image/") || image.length > 400000)) {
    return { error: "Image must be a valid picture under 300 KB" };
  }
  return { data: { name, category, price, quantity, image } };
}