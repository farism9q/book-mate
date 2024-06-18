import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { object, z } from "zod";
import { HTTPException } from "hono/http-exception";
import { db } from "@/lib/db";
import { clerkClient, currentUser } from "@clerk/nextjs";
import { UserAccountUpdate, SettingFields } from "@/features/account/types";

const app = new Hono()
  .get("/", clerkMiddleware(), async c => {
    const clerkUser = await currentUser();

    if (!clerkUser) {
      throw new HTTPException(401, {
        res: c.json({ error: "Unauthorized" }, 401),
      });
    }

    const user = await db.user.findUnique({
      where: {
        userClerkId: clerkUser.id,
      },
      include: {
        userSettings: true,
        userProfileImage: true,
      },
    });

    if (user) {
      // If user does not have a profile image, update it with the clerk image
      if (!user.userProfileImage?.imageUrl) {
        await db.user.update({
          where: {
            userClerkId: clerkUser.id,
          },
          data: {
            imageURL: clerkUser.imageUrl,
          },
          include: {
            userSettings: true,
          },
        });
      }
      return c.json({
        ...user,
        externalAccounts: !!clerkUser.externalAccounts.length,
      });
    }

    const newUser = await db.user.create({
      data: {
        userClerkId: clerkUser.id,
        email: clerkUser.emailAddresses[0].emailAddress,
        name: clerkUser.firstName + " " + clerkUser.lastName,
        imageURL: clerkUser.imageUrl,
        bio: "Nothing...",
        userSettings: {
          create: {
            allowBooksVisibliity: false,
          },
        },
      },
      include: {
        userSettings: true,
      },
    });

    return c.json({
      ...newUser,
      externalAccounts: !!clerkUser.externalAccounts.length,
    });
  })
  .patch(
    "/",
    clerkMiddleware(),
    zValidator(
      "json",
      object({
        userAccountUpdate: z.custom<UserAccountUpdate>(value => value),
      })
    ),
    async c => {
      const auth = getAuth(c);

      if (!auth || !auth.userId) {
        throw new HTTPException(401, {
          res: c.json({ error: "Unauthorized" }, 401),
        });
      }

      const { userId } = auth;

      const { userAccountUpdate } = c.req.valid("json");

      const { clerkUpdateFields, userUpdateFields } = userAccountUpdate;

      if (!userId) {
        throw new HTTPException(400, {
          res: c.json({ error: "User ID not provided" }, 400),
        });
      }

      const clerkUserPromise = clerkClient.users.updateUser(userId, {
        firstName: clerkUpdateFields.firstName,
        lastName: clerkUpdateFields.lastName,
      });

      let verifiedPasswordPromise;
      if (clerkUpdateFields.currentPassword && clerkUpdateFields.newPassword) {
        verifiedPasswordPromise = clerkClient.users.verifyPassword({
          userId,
          password: clerkUpdateFields.currentPassword,
        });
      }

      const [clerkUser, verifiedPassword] = await Promise.allSettled([
        clerkUserPromise,
        verifiedPasswordPromise,
      ]);

      let updatedUser;
      if (clerkUser.status === "fulfilled") {
        updatedUser = await db.user.update({
          where: {
            userClerkId: userId,
          },

          data: {
            name: clerkUser.value.firstName + " " + clerkUser.value.lastName,
          },
        });
      }

      db.$transaction(async tx => {
        if (userUpdateFields.bio) {
          await tx.user.update({
            where: {
              userClerkId: userId,
            },
            data: {
              bio: userUpdateFields.bio,
            },
          });
        }

        if (userUpdateFields.avatar && userUpdateFields.avatarKey) {
          let userProfileImagePromise;
          const userProfileImage = await tx.userProfileImage.findFirst({
            where: {
              userId,
            },
          });

          if (userProfileImage) {
            userProfileImagePromise = await tx.userProfileImage.update({
              where: {
                id: userProfileImage.id,
              },
              data: {
                imageUrl: userUpdateFields.avatar,
                imageKey: userUpdateFields.avatarKey,
              },
            });
          } else {
            userProfileImagePromise = await tx.userProfileImage.create({
              data: {
                imageUrl: userUpdateFields.avatar,
                imageKey: userUpdateFields.avatarKey,
                user: {
                  connect: {
                    userClerkId: userId,
                  },
                },
              },
            });
          }

          const userPromise = tx.user.update({
            where: {
              userClerkId: userId,
            },
            data: {
              imageURL: userUpdateFields.avatar,
            },
          });
          let _x;
          [_x, updatedUser] = await Promise.all([
            userProfileImagePromise,
            userPromise,
          ]);
        }
      });

      if (verifiedPassword.status === "fulfilled") {
        await clerkClient.users.updateUser(userId, {
          password: clerkUpdateFields.newPassword,
        });
      }

      if (verifiedPassword.status === "rejected") {
        return c.json(
          {
            errors: verifiedPassword.reason.errors,
            clerkError: true,
          },
          400
        );
      }

      if (clerkUser.status === "rejected") {
        return c.json(
          {
            errors: clerkUser.reason.errors,
            clerkError: true,
          },
          400
        );
      }

      return c.json({ updatedUser }, 200);
    }
  )
  .patch(
    "/settings",
    clerkMiddleware(),
    zValidator(
      "json",
      object({
        settingsToUpdate: z.custom<SettingFields>(value => {
          return value;
        }),
      })
    ),
    async c => {
      const auth = getAuth(c);

      if (!auth || !auth.userId) {
        throw new HTTPException(401, {
          res: c.json({ error: "Unauthorized" }, 401),
        });
      }

      const { settingsToUpdate } = c.req.valid("json");

      const setting = await db.userSettings.update({
        where: {
          userId: auth.userId,
        },
        data: {
          ...settingsToUpdate,
        },
      });

      return c.json({ setting });
    }
  );

export default app;
