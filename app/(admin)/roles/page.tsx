import { clerkClient } from "@clerk/nextjs/server";
import { removeRole, setRole } from "../action";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default async function Roles() {
  const client = await clerkClient();
  const users = (await client.users.getUserList()).data;

  return (
    <div className="pt-26 px-10 h-screen w-full">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Firstname</TableHead>
            <TableHead>Lastname</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Make Admin</TableHead>
            <TableHead>Make Moderator</TableHead>
            <TableHead>Remove Role</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              {/* Firstname */}
              <TableCell>{user.firstName}</TableCell>

              {/* Lastname */}
              <TableCell>{user.lastName}</TableCell>

              {/* Email */}
              <TableCell>
                {
                  user.emailAddresses.find(
                    (email) => email.id === user.primaryEmailAddressId,
                  )?.emailAddress
                }
              </TableCell>

              {/* Role */}
              <TableCell>{user.publicMetadata.role as string}</TableCell>

              {/* Make Admin */}
              <TableCell>
                <form action={setRole}>
                  <input type="hidden" name="id" value={user.id} />
                  <input type="hidden" name="role" value="admin" />
                  <button
                    type="submit"
                    className="border px-3 py-1 rounded-md text-sm hover:bg-muted"
                  >
                    Make Admin
                  </button>
                </form>
              </TableCell>

              {/* Make Moderator */}
              <TableCell>
                <form action={setRole}>
                  <input type="hidden" name="id" value={user.id} />
                  <input type="hidden" name="role" value="moderator" />
                  <button
                    type="submit"
                    className="border px-3 py-1 rounded-md text-sm hover:bg-muted"
                  >
                    Make Moderator
                  </button>
                </form>
              </TableCell>

              {/* Remove Role */}
              <TableCell>
                <form action={removeRole}>
                  <input type="hidden" name="id" value={user.id} />
                  <button
                    type="submit"
                    className="border px-3 py-1 rounded-md text-sm hover:bg-destructive hover:text-white"
                  >
                    Remove Role
                  </button>
                </form>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
