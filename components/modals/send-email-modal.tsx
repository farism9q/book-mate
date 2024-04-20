"use client";

import { useState } from "react";
import axios from "axios";
import qs from "query-string";
import { toast } from "sonner";

import { useModal } from "@/hooks/use-modal-store";

import {
  Dialog,
  DialogContent,
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
import { Toggle } from "../toggle";

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
});

export const SendEmailModal = () => {
  const { isOpen, onClose, type, data } = useModal();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [allowViewName, setAllowViewName] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const { control, handleSubmit, reset } = form;

  const isModalOpen = isOpen && type === "sendEmail";

  if (!isModalOpen) return null;

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
        bookTitle: data.email.bookTitle,
        bookImageUrl: data.email.bookImageUrl,
        bookText: data.email.bookText,
        allowViewName,
      });

      if (response.data.error) {
        toast.error("Failed to send the email");
        return;
      }

      toast.success("Email sent successfully!");

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
      <DialogContent className={cn("p-0 overflow-hidden")}>
        <Form {...form}>
          <form onSubmit={handleSubmit(onClick)} className="space-y-8">
            <DialogHeader className="pt-8 px-6">
              <DialogTitle className="text-2xl text-center font-bold">
                Send the selected text to your friend
              </DialogTitle>
            </DialogHeader>
            <DialogFooter className="px-6 py-4">
              <div className="grid w-full gap-x-2 gap-y-4">
                <div className="space-y-2">
                  <FormField
                    disabled={isLoading}
                    control={control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Friend email</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Your friend email..."
                            {...field}
                          />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <Toggle
                  disabled={isLoading}
                  turnedOn={allowViewName}
                  onToggle={() => setAllowViewName(!allowViewName)}
                  toggleStatusInfo={
                    allowViewName
                      ? "Let your friend view your name"
                      : "Don't let your friend view your name"
                  }
                  className="pl-6 sm:pl-2 md:pl-0 text-muted-foreground"
                />
                <Button disabled={isLoading}>Send via email</Button>
              </div>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
