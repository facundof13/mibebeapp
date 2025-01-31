"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../_components/ui/card";
import { Button } from "../_components/ui/button";
import { z } from "zod";
import { useForm } from "@tanstack/react-form";
import { Label } from "../_components/ui/label";
import { Input } from "../_components/ui/input";
import { LoadingSpinner } from "../_components/ui/spinner";
import { authClient } from "../../lib/auth-client";
import { useToast } from "../hooks/use-toast";
import { useRouter } from "next/navigation";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../_components/ui/tabs";
import { useState } from "react";

const registerSchema = z.object({
  name: z.string().nonempty("Name is required"),
  email: z.string().email("Email must be in a valid format"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});

const loginSchema = z.object({
  email: z.string().nonempty("Email is required"),
  password: z.string().nonempty("Password is required"),
});

export default function Page() {
  return (
    <div className="mt-10 flex flex-col items-center justify-center">
      <div className="flex w-[380px] flex-col gap-2">
        <Tabs defaultValue="login" className="w-full">
          <TabsList className="w-full">
            <TabsTrigger className="w-full" value="login">
              Login
            </TabsTrigger>
            <TabsTrigger className="w-full" value="register">
              Register
            </TabsTrigger>
          </TabsList>
          <TabsContent value="register">
            <RegisterCard />
          </TabsContent>
          <TabsContent value="login">
            <LoginCard />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

const RegisterCard = () => {
  const { toast } = useToast();
  const router = useRouter();
  const { Field, Subscribe, handleSubmit } = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
    onSubmit: async ({ value }) => {
      await authClient.signUp.email(
        { ...value },
        {
          onError: (ctx) => {
            toast({
              title: "Error",
              description: `Error signing up: ${ctx.error.message}`,
            });
          },
          onSuccess: () => {
            router.push("/baby");
          },
        },
      );
    },
  });

  return (
    <Card className="">
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          e.stopPropagation();
          void handleSubmit();
        }}
      >
        <CardHeader>
          <CardTitle>Register</CardTitle>
          <CardDescription>
            Enter the required information to create an account
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <Field
            name="name"
            validators={{
              onChange: registerSchema.shape.name,
              onBlur: registerSchema.shape.name,
            }}
          >
            {(field) => (
              <div className="flex flex-col gap-1">
                <Label>Name</Label>
                <Input
                  type="text"
                  value={field.state.value}
                  onChange={(e) =>
                    e != null ? field.handleChange(e.target.value) : null
                  }
                  onBlur={field.handleBlur}
                />
                <div className="font-weight-bold text-sm text-destructive">
                  {field.state.meta.errors.length
                    ? field.state.meta.errors.at(0)
                    : null}
                </div>
              </div>
            )}
          </Field>
          <Field
            name="email"
            validators={{
              onChange: registerSchema.shape.email,
              onBlur: registerSchema.shape.email,
            }}
          >
            {(field) => (
              <div className="flex flex-col gap-1">
                <Label>Email</Label>
                <Input
                  type="text"
                  value={field.state.value}
                  onChange={(e) =>
                    e != null ? field.handleChange(e.target.value) : null
                  }
                  onBlur={field.handleBlur}
                ></Input>
                <div className="font-weight-bold text-sm text-destructive">
                  {field.state.meta.errors.length
                    ? field.state.meta.errors.at(0)
                    : null}
                </div>
              </div>
            )}
          </Field>

          <Field
            name="password"
            validators={{
              onChange: registerSchema.shape.password,
              onBlur: registerSchema.shape.password,
            }}
          >
            {(field) => (
              <div className="flex flex-col gap-1">
                <Label>Password</Label>
                <Input
                  type="password"
                  value={field.state.value}
                  onChange={(e) =>
                    e != null ? field.handleChange(e.target.value) : null
                  }
                  onBlur={field.handleBlur}
                ></Input>
                <div className="font-weight-bold text-sm text-destructive">
                  {field.state.meta.errors.length
                    ? field.state.meta.errors.at(0)
                    : null}
                </div>
              </div>
            )}
          </Field>
        </CardContent>
        <CardFooter className="flex flex-row justify-end">
          <Subscribe
            selector={(state) => [
              state.canSubmit,
              state.isSubmitting,
              state.errors,
            ]}
          >
            {([canSubmit, isSubmitting]) => (
              <Button disabled={!canSubmit} type="submit" variant="outline">
                {isSubmitting && <LoadingSpinner />}
                Submit
              </Button>
            )}
          </Subscribe>
        </CardFooter>
      </form>
    </Card>
  );
};

const LoginCard = () => {
  const [signInError, setSignInError] = useState("");
  const router = useRouter();
  const { Field, Subscribe, handleSubmit } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    onSubmit: async ({ value }) => {
      const signinData = await authClient.signIn.email(
        { ...value },
        {
          onError: () => {
            setSignInError("Invalid username or password");
          },
          onSuccess: () => {
            router.push("/baby");
          },
        },
      );
    },
  });

  return (
    <Card>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          e.stopPropagation();
          void handleSubmit();
        }}
      >
        <CardHeader>
          <CardTitle>Welcome Back!</CardTitle>
          <CardDescription>Enter your login information</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <Field
            name="email"
            validators={{
              onChange: loginSchema.shape.email,
              onBlur: loginSchema.shape.email,
            }}
          >
            {(field) => (
              <div className="flex flex-col gap-1">
                <Label>Email</Label>
                <Input
                  type="text"
                  value={field.state.value}
                  onChange={(e) =>
                    e != null ? field.handleChange(e.target.value) : null
                  }
                  onBlur={field.handleBlur}
                ></Input>
                <div className="font-weight-bold text-sm text-destructive">
                  {field.state.meta.errors.length
                    ? field.state.meta.errors.at(0)
                    : null}
                </div>
              </div>
            )}
          </Field>

          <Field
            name="password"
            validators={{
              onChange: loginSchema.shape.password,
              onBlur: loginSchema.shape.password,
            }}
          >
            {(field) => (
              <div className="flex flex-col gap-1">
                <Label>Password</Label>
                <Input
                  type="password"
                  value={field.state.value}
                  onChange={(e) =>
                    e != null ? field.handleChange(e.target.value) : null
                  }
                  onBlur={field.handleBlur}
                ></Input>
                <div className="font-weight-bold text-sm text-destructive">
                  {field.state.meta.errors.length
                    ? field.state.meta.errors.at(0)
                    : null}
                </div>
              </div>
            )}
          </Field>
          {signInError !== "" ? (
            <div className="text-small flex items-center justify-center text-destructive">
              Invalid username or password
            </div>
          ) : null}
        </CardContent>
        <CardFooter className="flex flex-row justify-end">
          <Subscribe
            selector={(state) => [
              state.canSubmit,
              state.isSubmitting,
              state.errors,
            ]}
          >
            {([canSubmit, isSubmitting]) => (
              <Button disabled={!canSubmit} type="submit" variant="outline">
                {isSubmitting && <LoadingSpinner />}
                Submit
              </Button>
            )}
          </Subscribe>
        </CardFooter>
      </form>
    </Card>
  );
};
