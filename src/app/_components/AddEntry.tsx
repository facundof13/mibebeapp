import { useForm, useStore } from "@tanstack/react-form";
import { DateTimePicker } from "~/app/_components/ui/datetime-picker";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "~/app/_components/ui/sheet";
import { z } from "zod";
import { Label } from "~/app/_components/ui/label";
import { RadioGroup, RadioGroupItem } from "~/app/_components/ui/radio-group";
import { Separator } from "~/app/_components/ui/separator";
import { Checkbox } from "~/app/_components/ui/checkbox";
import { Input } from "~/app/_components/ui/input";
import { Button } from "~/app/_components/ui/button";

const createEventSchema = z.object({
  type: z
    .string()
    .optional()
    .refine((d) => d != null && ["diaper", "feeding"].includes(d), {
      message: "Event type is required",
    }),
  startTime: z.date(),
  endTime: z.date(),
  isWet: z.boolean().optional(),
  isDirty: z.boolean().optional(),
  notes: z.string().optional(),
});

export function AddEntryModal({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: (arg0: boolean) => void;
}) {
  const now = new Date();
  const { state, getFieldInfo, Field, ...form } = useForm({
    defaultValues: { endTime: now, startTime: now },
    onSubmit: async ({ value }) => {
      console.log({ inSubmit: true, value });
    },
    validators: { onChange: createEventSchema },
  });
  const type = useStore(form.store, (s) => s.values.type);
  const canSubmit = useStore(form.store, ({ canSubmit }) => canSubmit);

  return (
    <Sheet onOpenChange={setIsOpen} open={isOpen}>
      <SheetContent side="bottom">
        <SheetHeader>
          <SheetTitle>Add a new event</SheetTitle>
        </SheetHeader>

        <form
          onSubmit={async (e) => {
            e.preventDefault();
            e.stopPropagation();
            await form.handleSubmit();
          }}
        >
          <div className="flex flex-col gap-3">
            <Field
              name="startTime"
              listeners={{
                onChange: ({ value }) => {
                  form.setFieldValue("endTime", value);
                },
              }}
            >
              {(field) => {
                return (
                  <div className="flex flex-col gap-2">
                    <Label>Start Time</Label>
                    <DateTimePicker
                      onChange={(value) => {
                        if (value != null) {
                          field.handleChange(value);
                        }
                      }}
                      value={field.state.value}
                      granularity="minute"
                      hourCycle={12}
                    />
                  </div>
                );
              }}
            </Field>
            <Field name="endTime">
              {(field) => (
                <div className="flex flex-col gap-2">
                  <Label>End Time</Label>
                  <DateTimePicker
                    key={state.values.startTime.valueOf()}
                    onChange={(value) => {
                      if (value != null) {
                        field.handleChange(value);
                      }
                    }}
                    value={field.state.value}
                    granularity="minute"
                    hourCycle={12}
                  />
                </div>
              )}
            </Field>
            <Label>Event Type</Label>
            <Field name="type">
              {({ handleChange, getMeta }) => {
                const {
                  errors: [error],
                } = getMeta();
                return (
                  <div className="flex flex-col gap-2">
                    <RadioGroup
                      className="flex flex-row"
                      defaultValue={undefined}
                      value={state.values.type}
                      onValueChange={handleChange}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="feeding" id="feeding" />
                        <Label htmlFor="feeding">Feeding</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="diaper" id="diaper" />
                        <Label htmlFor="diaper">Diaper</Label>
                      </div>
                    </RadioGroup>
                    <div className="text-destructive text-sm">
                      {error?.toString()}
                    </div>
                  </div>
                );
              }}
            </Field>
            {type != null && <Separator />}
            {type === "diaper" ? (
              <div className="flex flex-row gap-4">
                <Field name="isWet">
                  {({ state: { value }, handleChange }) => (
                    <Label>
                      <div className="flex flex-row gap-2">
                        <Checkbox
                          checked={value}
                          onCheckedChange={(val) =>
                            typeof val == "boolean" ? handleChange(val) : null
                          }
                        />
                        Wet
                      </div>
                    </Label>
                  )}
                </Field>
                <Field name="isDirty">
                  {({ state: { value }, handleChange }) => (
                    <Label>
                      <div className="flex flex-row gap-2">
                        <Checkbox
                          checked={value}
                          onCheckedChange={(val) =>
                            typeof val == "boolean" ? handleChange(val) : null
                          }
                        />
                        Dirty
                      </div>
                    </Label>
                  )}
                </Field>
              </div>
            ) : type === "feeding" ? (
              <div></div>
            ) : null}
          </div>
          <div>
            <Field name="notes">
              {({ handleChange, state: { value } }) => (
                <div className="flex flex-col gap-2">
                  <Label>Notes</Label>
                  <Input
                    value={value}
                    onChange={(v) =>
                      v != null ? handleChange(v.target.value) : null
                    }
                    type=""
                  />
                </div>
              )}
            </Field>
          </div>
          <div className="flex flex-row justify-end gap-2">
            <div className="flex flex-row gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen(false)}
              >
                Cancel
              </Button>
              <Button disabled={!canSubmit} type="submit">
                Save
              </Button>
            </div>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
