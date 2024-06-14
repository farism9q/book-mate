import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
} from "../../../../components/ui/form";
import { useChatProvider } from "@/components/providers/chat-provider";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { CornerDownRight } from "lucide-react";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  question: z.string().min(1),
});

const ChatInput = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      question: "",
    },
  });

  const { onSubmitMessage, isStreaming } = useChatProvider();

  const onSubmit = () => {
    const question = form.getValues("question");

    if (!question) return;

    onSubmitMessage(question);
    form.reset();
  };

  return (
    <Form {...form}>
      <form
        onSubmit={e => {
          e.preventDefault();
          onSubmit();
        }}
        className="pb-4"
      >
        <FormField
          control={form.control}
          name="question"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className={"px-1 flex items-end gap-x-2"}>
                  <Textarea
                    disabled={isStreaming}
                    placeholder="Ask your question here..."
                    className="text-base px-4 py-6 border-slate-200 bg-slate-100 dark:bg-gray-900 dark:border-gray-800 focus-visible:ring-0 focus-visible:ring-offset-0 text-zinc-600 dark:text-zinc-200
                    min-h-12 resize-none border-0 p-3 shadow-none overflow-y-auto no-scrollbar"
                    {...field}
                  />
                  {
                    <Button
                      disabled={isStreaming}
                      type="submit"
                      size="icon"
                      className={cn(
                        "ml-auto gap-1.5 rounded-full transition-all duration-500 transform",
                        field.value.trim()
                          ? "scale-100 opacity-100"
                          : "w-0 scale-0"
                      )}
                    >
                      <CornerDownRight className="size-3.5" />
                    </Button>
                  }
                </div>
              </FormControl>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};

export default ChatInput;
