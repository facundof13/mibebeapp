"use client";

import { QuestionMarkCircledIcon } from "@radix-ui/react-icons";
import { useForm } from "@tanstack/react-form";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/app/_components/ui/alert-dialog";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "~/app/_components/ui/breadcrumb";
import { Button } from "~/app/_components/ui/button";
import Container from "~/app/_components/ui/Container";
import { DateTimePicker } from "~/app/_components/ui/datetime-picker";
import { Input } from "~/app/_components/ui/input";
import { Label } from "~/app/_components/ui/label";
import { Separator } from "~/app/_components/ui/separator";
import { Textarea } from "~/app/_components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/app/_components/ui/tooltip";
import { useToast } from "~/app/hooks/use-toast";
import { api } from "~/trpc/react";
import { upsertBabySchema } from "~/types/baby";

export default function Page() {
  const params = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();
  const upsertBaby = api.baby.upsertBaby.useMutation();
  const deleteBaby = api.baby.deleteBaby.useMutation();
  const getBabyByData = api.baby.getBabyBy.useQuery({
    id: params.get("existingBabyID"),
  });
  const existingBaby = getBabyByData?.data?.at(0);
  const { Field, handleSubmit } = useForm({
    defaultValues: {
      name: existingBaby?.name ?? "",
      date_of_birth:
        existingBaby?.date_of_birth != null
          ? existingBaby.date_of_birth
          : new Date(),
      id: existingBaby?.id,
      validated_users:
        existingBaby?.baby_user?.map((i) => i.user_email).join("\n") ?? "",
    },
    onSubmit: ({ value }) => {
      upsertBaby.mutate(value, {
        onError: (err) => {
          toast({
            variant: "destructive",
            title: "Error",
            description: `There was an error: ${err.message}`,
          });
        },
        onSuccess: (id) => {
          router.push(`/baby/${id}`);
          toast({
            title: "Success",
            description: isUpdate
              ? "Successfully updated baby"
              : "Successfully added baby",
          });
        },
      });
    },
    validators: { onSubmit: upsertBabySchema },
  });

  const isUpdate = params.get("existingBabyID") != null;

  return (
    <AlertDialog>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure you want to delete?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={async () => {
              if (existingBaby?.id == null) {
                return null;
              }

              deleteBaby.mutate(existingBaby.id, {
                onError: (err: unknown) => {
                  toast({
                    variant: "destructive",
                    title: "Error",
                    description: `There was an error: ${String(err)}`,
                  });
                },
                onSuccess: () => {
                  toast({
                    title: "Success",
                    description: "Successfully deleted baby",
                  });
                },
              });
            }}
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
      <Container className="gap-3">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="..">Babies</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            {isUpdate ? (
              <>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link
                      href={{
                        href: `.`,
                      }}
                    >
                      {existingBaby?.name}
                    </Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
              </>
            ) : null}
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              {isUpdate ? "Edit" : "Add new baby"}
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <Separator />
        <form
          className="flex flex-col gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            void handleSubmit();
          }}
        >
          <div className="text-lg font-medium">Add a new baby</div>
          <Field
            name="name"
            validators={{ onBlur: upsertBabySchema.shape.name }}
          >
            {({ state: { value, meta }, handleChange, handleBlur }) => (
              <div className="flex flex-col gap-2">
                <Label>Name</Label>
                <Input
                  autoFocus
                  value={value}
                  onBlur={handleBlur}
                  onChange={(e) => handleChange(e.target.value)}
                />
                <div className="font-weight-bold text-sm text-destructive">
                  {meta.errors.length ? meta.errors.at(0) : null}
                </div>
              </div>
            )}
          </Field>
          <Field
            name="date_of_birth"
            validators={{ onChange: upsertBabySchema.shape.date_of_birth }}
          >
            {({ state: { value, meta }, handleChange }) => (
              <div className="flex flex-col gap-2">
                <Label>Date of Birth</Label>
                <DateTimePicker
                  onChange={(d) => (d != null ? handleChange(d) : null)}
                  value={value}
                  granularity="day"
                  displayFormat={{ hour12: "P", hour24: "P" }}
                />
                <div className="font-weight-bold text-sm text-destructive">
                  {meta.errors.length ? meta.errors.at(0) : null}
                </div>
              </div>
            )}
          </Field>
          <Field
            name="validated_users"
            validators={{
              onBlur: upsertBabySchema.shape.validated_users,
              onChange: upsertBabySchema.shape.validated_users,
            }}
          >
            {({ handleChange, handleBlur, state: { value, meta } }) => (
              <div className="flex flex-col gap-2">
                <div className="flex flex-row items-center gap-2">
                  <Label>Valid User Emails</Label>
                  <Tooltip>
                    <TooltipTrigger>
                      <QuestionMarkCircledIcon />
                    </TooltipTrigger>
                    <TooltipContent>
                      Users with the following emails will also have access to
                      this baby. Separate multiple users with a new line.
                    </TooltipContent>
                  </Tooltip>
                </div>
                <Textarea
                  onChange={(e) => {
                    handleChange(e.target.value);
                  }}
                  onBlur={handleBlur}
                  value={value}
                />
                <div className="font-weight-bold text-sm text-destructive">
                  {meta.errors.length ? meta.errors.at(0) : null}
                </div>
              </div>
            )}
          </Field>
          <div className="flex flex-row justify-between">
            <div>
              {existingBaby != null && (
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" type="button">
                    Delete
                  </Button>
                </AlertDialogTrigger>
              )}
            </div>
            <div className="flex gap-2">
              {isUpdate ? (
                <Link href={`/baby/${params.get("existingBabyID")}`}>
                  <Button variant="outline">Cancel</Button>
                </Link>
              ) : (
                <Link href="/baby">
                  <Button variant="outline">Cancel</Button>
                </Link>
              )}
              <Button type="submit">Submit</Button>
            </div>
          </div>
        </form>
      </Container>
    </AlertDialog>
  );
}
