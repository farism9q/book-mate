import { auth } from "@clerk/nextjs";
import { ChangelogItem } from "./changelog-item";
import { getChangelogs } from "./queries";

const ChangelogPage = async () => {
  const { userId } = auth();
  const changelogs = await getChangelogs();

  return (
    <div className="md:w-[760px] lg:w-[870px] mx-auto duration-300 animate-in animate fade-in-5 slide-in-from-bottom-2.5">
      <span
        className={
          "absolute left-10 top-16 h-64 w-72 rounded-full z-50 blur-2xl animate-blob animation-delay-300 bg-primary/15 opacity-100"
        }
      />

      <div className="flex justify-center py-32 overflow-y-auto no-scrollbar w-full h-full">
        <div className="flex flex-col items-center gap-y-20">
          <div className="max-w-xl flex flex-col items-center gap-y-2 text-center">
            <h1 className="text-5xl md:text-7xl font-bold text-gradient">
              What&apos;s new ?
            </h1>
            <p className="text-zinc-600">
              Stay up to date with the latest changes and updates.
            </p>
          </div>

          {changelogs.map(changelog => {
            const userReaction = changelog.reactions.filter(
              reaction => reaction.userId === userId
            )[0];

            const changelogImages = changelog.images.map(
              changelog => changelog.imageUrl
            );

            return (
              <ChangelogItem
                key={changelog.id}
                userId={userId}
                changelogId={changelog.id}
                categories={changelog.categories}
                reaction={userReaction?.reaction}
                feedback={userReaction?.feedback}
                date={new Date(changelog.createdAt)}
                description={changelog.description}
                images={changelogImages}
                title={changelog.title}
                nbLikes={changelog.nbLikes}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ChangelogPage;
