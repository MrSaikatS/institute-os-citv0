import { adminClient, inferAdditionalFields } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import { customAc, ho, incharge, student, teacher } from "./authPermissions";

type AuthInstance = typeof import("./auth").auth;

export const authClient = createAuthClient({
  /** The base URL of the server (optional if you're using the same domain) */
  //   baseURL: "http://localhost:3000"
  plugins: [
    inferAdditionalFields<AuthInstance>(),
    adminClient({
      ac: customAc,
      defaultRole: "STUDENT",
      adminRoles: ["HO"],
      roles: { HO: ho, INCHARGE: incharge, TEACHER: teacher, STUDENT: student },
    }),
  ],
});
