import { Webhook } from "svix";
import { headers } from "next/headers";
import { clerkClient, WebhookEvent } from "@clerk/nextjs/server";
import connectDB from "@/lib/db";
import { User } from "@/models/User";

export async function POST(req: Request) {
  const payload = await req.text();
  const headerList = await headers();

  const svix_id = headerList.get("svix-id");
  const svix_timestamp = headerList.get("svix-timestamp");
  const svix_signature = headerList.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Missing svix headers", { status: 400 });
  }

  const secret = process.env.CLERK_WEBHOOK_SECRET!;
  const wh = new Webhook(secret);

  let evt: WebhookEvent;

  try {
    evt = wh.verify(payload, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Webhook verification failed:", err);
    return new Response("Invalid signature", { status: 400 });
  }

  // Runs only when user is created
  if (evt.type === "user.created") {
    const { id, email_addresses, first_name, last_name, public_metadata } =
      evt.data;

    const role = public_metadata?.role ?? "moderator";

    await connectDB();

    // Checks if user already exists
    const existingUser = await User.findOne({ clerkId: id });

    if (!existingUser) {
      await User.create({
        clerkId: id,
        name: `${first_name ?? ""} ${last_name ?? ""}`,
        email: email_addresses[0]?.email_address,
        role,
      });

      console.log("User created in MongoDB:", id);
    } else {
      console.log("User already exists in MongoDB:", id);
    }

    // Set role in Clerk metadata
    const client = await clerkClient();
    await client.users.updateUser(id, {
      publicMetadata: {
        role: "moderator",
      },
    });
  }

  // User Updated (Name, Email, Role)
  if (evt.type === "user.updated") {
    const { id, email_addresses, first_name, last_name, public_metadata } =
      evt.data;

    const role = public_metadata?.role ?? "student";

    await User.findOneAndUpdate(
      { clerkId: id },
      {
        name: `${first_name ?? ""} ${last_name ?? ""}`,
        email: email_addresses[0]?.email_address,
        role,
      },
      { new: true },
    );

    console.log("User updated in MongoDB:", id);
  }

  // User Delete
  if (evt.type === "user.deleted") {
    const { id } = evt.data;

    await User.findOneAndDelete({ clerkId: id });

    console.log("User deleted from MongoDB:", id);
  }

  return new Response("OK", { status: 200 });
}
