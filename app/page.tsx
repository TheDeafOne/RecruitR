'use client'
import { Button } from "@/components/ui/button";
import app from "@/firebase.config";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export default function Home() {
  app.name;
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [file, setFile] = useState<File>();
  const [url, setUrl] = useState<string>();
  const handleChange = (event: any) => {
    setFile(event.target.files[0]);
  };
  const storage = getStorage();

  useEffect(() => {
    if (!file) return;
    const storageRef = ref(storage, `resumes/${file.name}`);
    uploadBytes(storageRef, file).then((snapshot): void => { // Added return type annotation
      getDownloadURL(snapshot.ref).then((url) => {
        setUrl(url);
      });
    });
  }, [file]);
  return (
    <>
      <Button onClick={() => fileRef.current && fileRef.current.click()}>
        <input id="upload" name="upload" type="file" ref={fileRef} hidden onChange={handleChange} />
        upload resume
      </Button>
      <div>
        download files:
        {url && <Link className="h-5 w-10" href={url} target="_blank">
          {url}
        </Link>}
      </div>
    </>
  )
}
