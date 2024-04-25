import { db } from "@/lib/db";
import { ChangelogCategory } from "@prisma/client";

const main = async () => {
  try {
    console.log("Seeding database...");
    await db.changelog.deleteMany({});

    await db.changelog.createMany({
      data: [
        {
          title: "Feature Card",
          description: "Added new feature card component",
          categories: [ChangelogCategory.NEW_FEATURE],
        },

        {
          title: "Fixed Login Form",
          description: "Fixed bug with the login form not submitting correctly",
          categories: [ChangelogCategory.BUG_FIX],
        },
        {
          title: "Updated Profile Page",
          description:
            "Updated the profile page to include new user information",
          categories: [ChangelogCategory.IMPROVEMENT],
        },
        {
          title: "Removed Old Code",
          description: "Removed old code that was no longer needed",
          categories: [ChangelogCategory.OTHER],
        },
      ],
    });

    console.log("Seeding complete!");
  } catch (err) {
    console.log("Error", err);
  }
};

main();
