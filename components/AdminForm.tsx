"use client";

import { use, useCallback, useRef, useState } from "react";
import { newValue } from "@/lib/constants";
import { useUploadThing } from "@/lib/utils";
import { addAnswer } from "@/app/actions/addAnswer";
import { useDropzone } from "@uploadthing/react";
import {
  generateClientDropzoneAccept,
  generatePermittedFileTypes,
} from "uploadthing/client";
import { Field, FieldGroup, FieldLabel, FieldSeparator } from "./ui/field";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectSeparator,
} from "./ui/select";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Progress } from "./ui/progress";
import { toast } from "sonner";

function AdminForm({
  subjectsPromise,
  types,
}: {
  subjectsPromise: Promise<{ id: number; name: string }[]>;
  types: string[];
}) {
  const subjects = use(subjectsPromise);
  const [subjectIsNew, setSubjectIsNew] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const formRef = useRef<HTMLFormElement>(null);
  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles((f) => {
      const temp = f.slice();
      temp.push(...acceptedFiles);
      return temp;
    });
  }, []);
  const { startUpload, isUploading, routeConfig } = useUploadThing(
    "imageUploader",
    {
      onClientUploadComplete: () => {
        toast.success("Answer added successfully!");
        formRef.current?.reset();
        setFiles([]);
      },
      onUploadProgress: (progress) => {
        setProgress(progress);
      },
      onUploadError: (e) => console.log(e),
    },
  );
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: generateClientDropzoneAccept(
      generatePermittedFileTypes(routeConfig).fileTypes,
    ),
  });

  return (
    <>
      <form
        ref={formRef}
        onSubmit={async (e) => {
          e.preventDefault();
          setLoading(true);
          const formData = new FormData(e.currentTarget);
          const { postId, status, message } = await addAnswer(formData);
          if (status === "error") {
            setLoading(false);
            toast.error(message);
            return;
          }
          const input = {
            adminPassword: (formData.get("adminPassword") as string) || "",
            postId,
          };
          await startUpload(files, input);
          setLoading(false);
        }}
        className="wrapper flex flex-col items-center gap-4 p-4"
      >
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="subjectId">Select a subject: </FieldLabel>
            <Select
              name="subjectId"
              id="subjectId"
              onValueChange={(value) =>
                value === newValue
                  ? setSubjectIsNew(true)
                  : setSubjectIsNew(false)
              }
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a subject">
                  {(value) =>
                    value && value !== newValue
                      ? subjects.find((s) => s.id === value)?.name
                      : value === newValue
                        ? "Add new subject"
                        : "Select a subject"
                  }
                </SelectValue>
              </SelectTrigger>
              <SelectContent alignItemWithTrigger={false}>
                <SelectGroup>
                  {subjects.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
                <SelectSeparator />
                <SelectGroup>
                  <SelectItem value={newValue}>Add new subject</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </Field>
          {subjectIsNew && (
            <Field>
              <FieldLabel htmlFor="newSubjectName">
                New Subject Name:
              </FieldLabel>
              <Input name="newSubjectName" id="newSubjectName" required />
            </Field>
          )}
          <Field>
            <FieldLabel htmlFor="week">Week Number:</FieldLabel>
            <Input
              type="number"
              name="week"
              id="week"
              placeholder="Week number"
              required
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="type">Type: </FieldLabel>
            <Select id="type" name="type">
              <SelectTrigger>
                <SelectValue placeholder="Select a type" />
              </SelectTrigger>
              <SelectContent alignItemWithTrigger={false}>
                {types.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
        </FieldGroup>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="uploadFiles">Upload files:</FieldLabel>
            <div {...getRootProps()} className="w-full">
              <Button className="w-full" type="button">
                <input {...getInputProps()} id="uploadFiles" />
                Drop files here!
              </Button>
            </div>
            <Button variant={"destructive"} onClick={() => setFiles([])}>
              Remove files
            </Button>
          </Field>
          <Field>
            <Textarea name="content" placeholder="Content"></Textarea>
          </Field>
        </FieldGroup>
        <FieldSeparator />
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="adminPassword">Admin Password:</FieldLabel>
            <Input
              id="adminPassword"
              type="password"
              name="adminPassword"
              placeholder="Admin Password"
              required
            />
          </Field>
          <Button type="submit" disabled={isUploading}>
            {loading ? "Uploading..." : `Submit ${files.length} image(s)`}
          </Button>
          {isUploading && <Progress value={progress} />}
        </FieldGroup>
      </form>
    </>
  );
}

export default AdminForm;
