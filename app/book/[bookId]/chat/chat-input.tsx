import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
} from "../../../../components/ui/form";
import { Input } from "../../../../components/ui/input";
import { useChatProvider } from "@/components/providers/chat-provider";

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
                <div className="relative px-4">
                  <Input
                    disabled={isStreaming}
                    className="text-base px-4 py-6 border-slate-200 bg-slate-100 dark:bg-gray-900 dark:border-gray-800 focus-visible:ring-0 focus-visible:ring-offset-0 text-zinc-600 dark:text-zinc-200"
                    placeholder={"Ask your question here..."}
                    {...field}
                  />
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
