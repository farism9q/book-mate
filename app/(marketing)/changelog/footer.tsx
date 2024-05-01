"use client";

import { upsertChangelogReaction } from "@/actions/changelog";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ErrorType } from "@/constants";
import { cn } from "@/lib/utils";
import { SignInButton } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { ThumbsDown, ThumbsUp, X } from "lucide-react";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z.object({
  feedback: z.string().max(1000),
});

type Props = {
  changelogId: string;
  reaction?: boolean | null;
  feedback?: string | null;
};

export const Footer = ({ changelogId, reaction, feedback }: Props) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      feedback: feedback || "",
    },
  });
  const [userReview, setUserReview] = useState<boolean | null>(reaction!);
  const [pending, startTransition] = useTransition();
  const [allowEditFeedback, setAllowEditFeedback] = useState(false);

  const onReactionClick = (reaction: boolean) => {
    if (reaction === userReview) return;

    setUserReview(reaction);

    startTransition(() => {
      upsertChangelogReaction({ changelogId, reaction, feedback: "" })
        .then(res => {
          if (res?.error === ErrorType.SIGN_IN_REQUIRED) {
            setUserReview(null);
            toast.info(
              <div className="flex items-center justify-between w-full">
                {/*  */}
                <span className="text-transparent bg-clip-text bg-gradient-to-br from-zinc-200 to-zinc-400 font-semibold text-lg">
                  You need to sign in
                </span>
                <SignInButton
                  mode="modal"
                  afterSignInUrl="/changelog"
                  afterSignUpUrl="/changelog"
                >
                  <Button variant={"secondary"}>Sign in</Button>
                </SignInButton>
              </div>,

              {
                duration: 10000,
              }
            );
            return;
          }

          toast.success("Thank you for your feedback");
        })
        .catch(err => {
          toast.error("Failed to upsert changelog reaction");
          setUserReview(null);
        });
    });
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (values.feedback.length === 0) {
      return;
    }

    startTransition(() => {
      upsertChangelogReaction({
        changelogId,
        reaction: false, // User is submitting feedback after thumbs down (negative reaction)
        feedback: values.feedback,
      })
        .then(() => {
          toast.success("Thanks again for your feedback");
          setAllowEditFeedback(false);
        })
        .catch(err => {
          toast.error("Failed to upsert changelog reaction");
        });
    });
  };

  return (
    <div className="flex flex-col pt-6 pb-2 gap-y-2 max-w-sm">
      <p className="text-lg font-bold text-white">What do you think ?</p>
      <div className="flex items-center gap-x-4">
        <div
          onClick={() => onReactionClick(true)}
          className={cn(
            "cursor-pointer",
            userReview &&
              "border border-emerald-500 rounded-md p-1 bg-emerald-100",
            pending && "opacity-50 cursor-not-allowed"
          )}
        >
          <ThumbsUp className="w-6 h-6 stroke-[1px] text-emerald-500" />
        </div>
        <div
          onClick={() => onReactionClick(false)}
          className={cn(
            "cursor-pointer",
            userReview === false &&
              "border border-rose-500 rounded-md p-1 bg-rose-100",
            pending && "opacity-50 cursor-not-allowed"
          )}
        >
          <ThumbsDown className="w-6 h-6 stroke-[1px] text-rose-500" />
        </div>
      </div>
      {userReview === false && (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="pb-4">
            <FormField
              control={form.control}
              name="feedback"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="relative space-y-2">
                      <Label
                        htmlFor="feedback"
                        className="text-sm text-muted-foreground"
                      >
                        What can be improved ? Your feedback means a lot to us
                      </Label>
                      {!allowEditFeedback && feedback && (
                        <div
                          onClick={() => setAllowEditFeedback(true)}
                          className="cursor-pointer border-2 rounded-md border-rose-400 bg-rose-100 p-2"
                        >
                          <p className="text-sm text-rose-950">{feedback}</p>
                        </div>
                      )}
                      {(allowEditFeedback || !feedback) && (
                        <div className="relative">
                          <div
                            onClick={() => setAllowEditFeedback(false)}
                            className="cursor-pointer absolute -top-2 -right-2 bg-rose-100 rounded-full p-1"
                          >
                            <X className="w-4 h-4 text-rose-500" />
                          </div>

                          <Textarea
                            disabled={pending}
                            className="px-2 bg-zinc-200/90 dark:bg-[#212121] border-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-zinc-600 dark:text-zinc-200"
                            placeholder={"Help us improve"}
                            {...field}
                          />
                        </div>
                      )}
                      <Button
                        type="submit"
                        disabled={
                          pending || feedback === form.getValues("feedback")
                        }
                      >
                        Submit
                      </Button>
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />
          </form>
        </Form>
      )}
    </div>
  );
};
