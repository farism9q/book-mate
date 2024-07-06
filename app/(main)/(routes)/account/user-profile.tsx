"use client";

import { useEditProfileSheet } from "@/features/account/hooks/use-edit-profile";
import { useGetAccount } from "@/features/account/api/use-get-account";
import { Settings } from "@/features/account/components/settings";
import { FavoriteBooksStatus } from "@/features/favorite-books/components/favorite-books-status";

import { useState } from "react";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Reviews } from "@/features/review/components/reviews";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const UserProfile = () => {
  const { onOpen } = useEditProfileSheet();
  const [onReviewClick, setOnReviewClick] = useState(false);
  const { data: user, isLoading } = useGetAccount();

  const whenScrolledTop = () => {
    setOnReviewClick(false);
  };

  const [showUserBooks, setShowUserBooks] = useState(
    user?.userSettings.allowBooksVisibliity || false
  );

  return (
    <div className="flex flex-col items-center border rounded-md space-y-10 overflow-auto no-scrollbar h-full w-full">
      <div className="flex items-end justify-end w-full p-2">
        <Button
          variant={"secondary"}
          onClick={() => onOpen({ user })}
          size="sm"
          className="border-2 border-zinc-600/30 hover:bg-primary/10 transition-colors duration-300"
        >
          Edit
        </Button>
      </div>
      <div className="grid gap-2 space-y-4">
        <div className="relative mx-auto">
          <div className="absolute rounded-md h-full w-full -z-20 blur-md animate-blob animation-delay-75 bg-primary/70 dark:bg-primary/40" />
          <div className="w-[200px] h-[200px] md:w-[320px] md:h-[320px]">
            {!isLoading && user ? (
              <Image
                src={user.userProfileImage?.imageUrl || user.imageURL}
                alt={user.name}
                className="rounded-md mx-auto"
                fill
              />
            ) : (
              <Skeleton className="w-full h-full rounded-md mx-auto" />
            )}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          {!isLoading && user ? (
            <h1 className="text-2xl text-center font-semibold leading-none tracking-tight">
              {user.name}
            </h1>
          ) : (
            <Skeleton className="w-full h-6" />
          )}
          <div className="flex items-center h-fit mx-6 mt-6 justify-center border border-primary/10 rounded-md hover:border-primary/30 transition-all duration-300">
            {!isLoading && user ? (
              <p className="px-3 py-2 w-full max-h-full text-md text-sm md:text-lg font-medium tracking-wide text-muted-foreground overflow-auto no-scrollbar">
                {user?.bio}
              </p>
            ) : (
              <Skeleton className="w-full h-6" />
            )}
          </div>
        </div>
      </div>

      {/* Preventing undesired highet changes when "showUserBooksToggle" is turning on and off */}
      <div className="h-full w-full">
        {showUserBooks && user && (
          <FavoriteBooksStatus userName={user.name.split(" ")[0]} />
        )}
      </div>

      <Tabs defaultValue="reviews" className="w-full">
        <TabsList className="grid grid-cols-2 rounded-none">
          <TabsTrigger
            value="reviews"
            onClick={() => {
              setOnReviewClick(true);
            }}
          >
            Reviews
          </TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="reviews">
          <Reviews
            tabClicked={onReviewClick}
            whenScrolledTop={whenScrolledTop}
          />
        </TabsContent>
        <TabsContent value="settings">
          {user && (
            <Settings
              user={user}
              onShowUserBooksToggle={setShowUserBooks}
              showUserBooksToggle={showUserBooks}
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};
