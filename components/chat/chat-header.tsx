import { EntityAvatar } from "../entity-avatar";

interface ChatHeaderProps {
  imageUrl: string;
  title: string;
}

const ChatHeader = ({ imageUrl, title }: ChatHeaderProps) => {
  return (
    <div className="bg-zinc-200/90 dark:bg-[#212121]">
      <div className="flex items-center pl-4 py-2">
        <EntityAvatar
          src={imageUrl}
          alt={title}
          className="w-10 h-10 md:w-12 md:h-12"
        />
        <h1 className="text-2xl font-bold pl-2">{title}</h1>
      </div>
    </div>
  );
};

export default ChatHeader;
