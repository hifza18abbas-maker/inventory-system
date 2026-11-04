import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";
import { getUser, validateProduct } from "@/lib/auth";

export async function PUT(request, { params }) {
  try {
    const user = await getUser();
    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { id } = await params;
    const result = validateProduct(await request.json());
    if (result.error) {
      return Response.json({ error: result.error }, { status: 400 });
    }
    await connectDB();
    const product = await Product.findOneAndUpdate(
      { _id: id, user: user.id },
      result.data,
      { new: true }
    );
    if (!product) {
      return Response.json({ error: "Product not found" }, { status: 404 });
    }
    return Response.json({ product });
  } catch (error) {
    return Response.json(
      { error: "Something went wrong on the server" },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const user = await getUser();
    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { id } = await params;
    await connectDB();
    const product = await Product.findOneAndDelete({ _id: id, user: user.id });
    if (!product) {
      return Response.json({ error: "Product not found" }, { status: 404 });
    }
    return Response.json({ message: "Product deleted" });
  } catch (error) {
    return Response.json(
      { error: "Something went wrong on the server" },
      { status: 500 }
    );
  }
}