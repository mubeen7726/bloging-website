"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useAppSelector } from "@/lib/hooks";

const formSchema = z.object({
  email: z.string().email("Please enter a valid email."),
  message: z.string().min(10, "Message must be at least 10 characters."),
});

export default function ContactPage() {
  const data = useAppSelector((state) => state.user.profile);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: data?.email || "",
      message: "",
    },
  });

  const onSubmit = async (formData: z.infer<typeof formSchema>) => {
    try {
      const res = await fetch("/api/dashboard/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error();

      toast.success("Message sent successfully!");
      form.reset();
    } catch {
      toast.error("Something went wrong.");
    }
  };

  return (
    <div className="max-w-xl my-20 relative mx-auto bg-white dark:bg-zinc-800 p-8 rounded-2xl shadow-xl">
      <h1 className="text-3xl font-bold mb-6 text-center text-zinc-800 dark:text-white">
        Contact Us
      </h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    disabled
                    className="cursor-not-allowed"
                    placeholder="you@example.com"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Message</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Type your message here..."
                    rows={5}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full">
            Send Message
          </Button>
        </form>
      </Form>
    </div>
  );
}
