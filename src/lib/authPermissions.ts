import { createAccessControl } from "better-auth/plugins/access";

/**
 * make sure to use `as const` so typescript can infer the type correctly
 */
const statement = {
  course: ["create", "read", "update", "delete"],
} as const;

export const customAc = createAccessControl(statement);

// export const administrator = customAc.newRole({
//   course: ["create", "read", "update", "delete"],
// });

export const ho = customAc.newRole({
  course: ["create", "read", "update", "delete"],
});

export const incharge = customAc.newRole({
  course: ["read", "update"],
});

export const teacher = customAc.newRole({
  course: ["read"],
});

export const student = customAc.newRole({
  course: ["read"],
});
