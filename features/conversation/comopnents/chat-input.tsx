import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { cn } from "@/lib/utils";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { CornerDownRight } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const formSchema = z.object({
  question: z.string().min(1),
});

type Props = {
  onSubmitMessage: (message: string) => void;
  isStreaming: boolean;
  isSubscribed: boolean;
  bookChatLimit: number;
};

const ChatInput = ({
  onSubmitMessage,
  isStreaming,
  isSubscribed,
  bookChatLimit,
}: Props) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      question: "",
    },
  });

  const onSubmit = () => {
    const question = form.getValues("question");

    if (!question.trim()) return;

    onSubmitMessage(question);
    form.reset();
  };

  const onKeyPress = (e: React.KeyboardEvent) => {
    // shift + enter to add new line
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSubmit();
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={e => {
          e.preventDefault();

          onSubmit();
        }}
        onKeyDown={onKeyPress}
        className="pb-4"
      >
        <FormField
          control={form.control}
          name="question"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className={"pl-2 px-1 flex items-end gap-x-2"}>
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
