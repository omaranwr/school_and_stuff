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

function AdminForm({
  subjectsPromise,
}: {
  subjectsPromise: Promise<{ id: number; name: string }[]>;
}) {
  const subjects = use(subjectsPromise);
  const [subjectState, setSubjectState] = useState(
    String(subjects[0]?.id) || newValue,
  );
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
        <label htmlFor="subjectSelect">Select a subject: </label>
        <select
          id="subjectSelect"
          name="subjectId"
          onChange={(e) => setSubjectState(e.target.value)}
          required
        >
          {subjects.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
          <option value={newValue}>Add new subject</option>
        </select>
        {subjectState === newValue && (
          <div>
            <label htmlFor="newSubject">New Subject Name: </label>
            <input type="text" id="newSubject" name="newSubjectName" required />
          </div>
        )}
        <input type="number" name="week" placeholder="Week number" required />
        <div {...getRootProps()}>
          <input {...getInputProps()} />
          Drop files here!
        </div>
        <textarea name="content" placeholder="Content" required></textarea>
        <input
          type="password"
          name="adminPassword"
          placeholder="Admin Password"
          required
        />
        <button type="submit" disabled={isUploading}>
          {loading ? "Uploading..." : `Submit ${files.length} file(s)`}
          {isUploading && <progress value={progress} max="100" />}
        </button>
      </form>
    </>
  );
}

export default AdminForm;
