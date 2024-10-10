"use client";
import { useForm, useWatch, Control } from "react-hook-form";

type FormValues = {
  firstName: string;
  lastName: string;
};

function IsolateReRender({
  control,
}: {
  control: Control<FormValues>;
}) {
  const firstName = useWatch({
    control,
    name: "firstName",
    defaultValue: "default",
  });

  return <div>{firstName}</div>;
}

export default function TestForm() {
  const { register, control, handleSubmit } = useForm<FormValues>();
  const onSubmit = handleSubmit((data) => console.log(data));

  return (
    <form onSubmit={onSubmit}>
      <input {...register("firstName")} />
      <input {...register("lastName")} />
      <IsolateReRender control={control} />

      <input type="submit" />
    </form>
  );
}
