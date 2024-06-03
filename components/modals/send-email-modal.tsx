"use client";

import { useState } from "react";
import axios from "axios";
import qs from "query-string";
import { toast } from "sonner";

import { useModal } from "@/hooks/use-modal-store";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Input } from "../ui/input";

import { Checkbox } from "../ui/checkbox";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";

enum EmailDomains {
  GMAIL = "gmail.com",
  HOTMAIL = "hotmail.com",
  OUTLOOK = "outlook.com",
  ICLOUD = "icloud.com",
  YAHOO = "yahoo.com",
}

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
});

export const SendEmailModal = () => {
  const { isOpen, onClose, type, data } = useModal();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [allowViewName, setAllowViewName] = useState(false);
  const [includeQuestion, setIncludeQuestion] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const emailInput = form.watch("email");
  const selectedDomain = emailInput.split("@")[1];

  const { control, handleSubmit, reset } = form;

  const isModalOpen = isOpen && type === "sendEmail";

  if (!isModalOpen) return null;

  const handleSelectChange = (domain: EmailDomains) => {
    const email = form.getValues("email")?.split("@")[0];
    if (!email) return;
    form.setValue("email", `${email}@${domain}`.replaceAll(" ", ""));
  };

  const onClick = async (values: z.infer<typeof formSchema>) => {
    if (!data.email) {
      return;
    }

    try {
      setIsLoading(true);

      const url = qs.stringifyUrl({
        url: `/api/send-email`,
      });

      const response = await axios.post(url, {
        friendEmail: values.email,
        allowViewName,
        bookTitle: data.email.bookTitle,
        bookImageUrl: data.email.bookImageUrl,
        bookText: data.email.bookText,
        question: includeQuestion && data.email.question,
      });

      if (response.data.error) {
        toast.error("Failed to send the email");
        return;
      }

      toast.success("Email sent successfully!");

      setAllowViewName(false);
      setIncludeQuestion(false);

      onClose();
      reset();
      router.refresh();
    } catch (error) {
      toast.error("Failed to send the email");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-full">
        <DialogHeader>
          <DialogTitle className="text-2xl text-center font-bold">
            Share Your Highlights!
          </DialogTitle>

          <DialogDescription className="text-center text-muted-foreground">
            Share your highlights with your friend via email.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={handleSubmit(onClick)} className="space-y-8">
            <div className="grid gap-x-2 gap-y-4">
              <FormField
                disabled={isLoading}
                control={control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Friend email</FormLabel>
                    <FormControl>
                      <div className="flex flex-col gap-y-2">
                        <Input
                          className="text-base"
                          placeholder="Your friend email..."
                          {...field}
                        />
                      </div>
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="w-full overflow-hidden">
                <ScrollArea className="w-full overflow-hidden whitespace-nowrap rounded-md border">
                  <div className="flex">
                    {Object.values(EmailDomains).map(domain => (
                      <button
                        key={domain}
                        className={cn(
                          "lowercase text-sm p-3 hover:bg-accent hover:text-accent-foreground",
                          selectedDomain === domain &&
                            "bg-accent text-accent-foreground"
                        )}
                        type="button"
                        onClick={() => handleSelectChange(domain)}
                      >
                        @{domain}
                      </button>
                    ))}
                  </div>
                  <ScrollBar className="hidden" orientation="horizontal" />
                </ScrollArea>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="allow-name-view"
                  onCheckedChange={_check =>
                    setAllowViewName((prev: boolean) => !prev)
                  }
                />
                <label
                  htmlFor="allow-name-view"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Let my friend view my name
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="allow-question-view"
                  onCheckedChange={_check =>
                    setIncludeQuestion((prev: boolean) => !prev)
                  }
                />
                <label
                  htmlFor="allow-question-view"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Include the question I asked
                </label>
              </div>
              <DialogFooter className="pt-4">
                <Button disabled={isLoading}>Send via email</Button>
              </DialogFooter>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
