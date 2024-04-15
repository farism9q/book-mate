import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Book } from "@/types/book";

import { Form, FormControl, FormField, FormItem } from "../ui/form";
import { Input } from "../ui/input";

const formSchema = z.object({
  question: z.string().min(1),
});

type Props = {
  onSendMessage: (message: string) => void;
  isPending: boolean;
};
const ChatInput = ({ onSendMessage, isPending }: Props) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      question: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    onSendMessage(values.question);
    form.reset();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="pb-4">
        <FormField
          control={form.control}
          name="question"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="relative px-4">
                  <Input
                    disabled={isPending}
                    className="px-4 py-6 bg-zinc-200/90 dark:bg-[#212121] border-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-zinc-600 dark:text-zinc-200"
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
