"use client";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../_components/ui/card";
import { Button } from "../_components/ui/button";
import { z } from "zod";
import { useForm } from "@tanstack/react-form";
import { Label } from "../_components/ui/label";
import { Input } from "../_components/ui/input";

const userSchema = z.object({
  name: z.string().nonempty(),
  email: z.string().email(),
  password: z.string().nonempty().min(8),
});

export default function Page() {
  const { Field, handleSubmit, ...form } = useForm({
    defaultValues: {
      email: "",
      password: "",
      name: "",
    },
    async onSubmit(values) {
      try {
      } catch (err) {}
    },
    validators: {
      onChange: userSchema,
    },
  });
  return (
    <div className="mt-10 flex justify-center">
      <Card className="w-[380px]">
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            e.stopPropagation();
            await handleSubmit();
          }}
        >
          <CardHeader>
            <CardTitle>Sign up</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <Field name="name">
              {(field) => (
                <>
                  <Label>Name</Label>
                  <Input
                    type="text"
                    autoFocus
                    value={field.state.value}
                    onChange={(e) => (e != null ? field.handleChange : null)}
                    onBlur={field.handleBlur}
                  />
                </>
              )}
            </Field>
            <Field name="email">
              {(field) => (
                <>
                  <Label>Email</Label>
                  <Input
                    type="text"
                    value={field.state.value}
                    onChange={(e) => (e != null ? field.handleChange : null)}
                    onBlur={field.handleBlur}
                  ></Input>
                </>
              )}
            </Field>

            <Field name="password">
              {(field) => (
                <>
                  <Label>Password</Label>
                  <Input
                    type="password"
                    value={field.state.value}
                    onChange={(e) => (e != null ? field.handleChange : null)}
                    onBlur={field.handleBlur}
                  ></Input>
                </>
              )}
            </Field>
          </CardContent>
          <CardFooter className="flex flex-row justify-end">
            <Button type="submit" variant="outline">
              Submit
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
