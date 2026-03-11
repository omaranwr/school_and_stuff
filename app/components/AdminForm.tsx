"use client";

import { use, useState } from "react";
import { addAnswer } from "@/app/actions/addAnswer";
import { newValue } from "@/app/lib/constants";

function AdminForm({
  subjectsPromise,
}: {
  subjectsPromise: Promise<{ id: number; name: string }[]>;
}) {
  const subjects = use(subjectsPromise);
  const [subjectState, setSubjectState] = useState(
    String(subjects[0]?.id) || newValue,
  );

  return (
    <>
      <form
        action={addAnswer}
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
        <textarea name="content" placeholder="Content" required></textarea>
        <input
          type="password"
          name="adminPassword"
          placeholder="Admin Password"
          required
        />
        <button type="submit">Submit</button>
      </form>
    </>
  );
}

export default AdminForm;
