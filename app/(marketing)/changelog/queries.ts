import { db } from "@/lib/db";
import { cache } from "react";

export const getChangelogs = cache(async () => {
  const changelogPromise = db.changelog.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      images: true,
    },
  });
  const reactionsPromise = db.changelogReaction.findMany();

  const [changelogs, reactions] = await Promise.all([
    changelogPromise,
    reactionsPromise,
  ]);

  const changelogWithReactions = changelogs.map(changelog => {
    return {
      ...changelog,
      reactions: reactions.filter(
        reaction => reaction.changelogId === changelog.id
      ),
      nbLikes: reactions.filter(
        reaction => reaction.changelogId === changelog.id && reaction.reaction
      ).length,
    };
  });

  return changelogWithReactions;
});
