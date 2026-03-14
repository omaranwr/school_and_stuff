"use client";

import { use, useCallback, useState } from "react";
import { newValue } from "@/app/lib/constants";
import { useUploadThing } from "@/app/lib/utils";
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

function AdminForm({
  subjectsPromise,
}: {
  subjectsPromise: Promise<{ id: number; name: string }[]>;
}) {
  const subjects = use(subjectsPromise);
  const [subjectIsNew, setSubjectIsNew] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles(acceptedFiles);
  }, []);
  const { startUpload, isUploading, routeConfig } = useUploadThing(
    "imageUploader",
    {
      onUploadProgress: (progress) => {
        setProgress(progress);
      },
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
        onSubmit={async (e) => {
          e.preventDefault();
          setLoading(true);
          const formData = new FormData(e.currentTarget);
          const { postId, status, message } = await addAnswer(formData);
          if (status === "error") {
            alert(message);
            return;
          }
          const input = {
            adminPassword: (formData.get("adminPassword") as string) || "",
            postId,
          };
          await startUpload(files, input);
          setLoading(false);
          alert("Answer added successfully!");
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
                <SelectValue placeholder="Select a subject" />
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
            {isUploading && <progress value={progress} max="100" />}
          </Button>
        </FieldGroup>
      </form>
    </>
  );
}

export default AdminForm;
