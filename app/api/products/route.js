import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";
import { getUser, validateProduct } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getUser();
    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }
    await connectDB();
    const products = await Product.find({ user: user.id }).sort({
      createdAt: -1,
    });
    return Response.json({ products });
  } catch (error) {
    return Response.json(
      { error: "Something went wrong on the server" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const user = await getUser();
    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }
    const result = validateProduct(await request.json());
    if (result.error) {
      return Response.json({ error: result.error }, { status: 400 });
    }
    await connectDB();
    const product = await Product.create({ ...result.data, user: user.id });
    return Response.json({ product }, { status: 201 });
  } catch (error) {
    return Response.json(
      { error: "Something went wrong on the server" },
      { status: 500 }
    );
  }
}