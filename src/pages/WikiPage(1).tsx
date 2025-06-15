import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";

interface WikiFile {
  id: string;
  name: string;
  version: string;
  owner: string;
  status: "Draft" | "Review" | "Final";
  lastEdited: Date;
}

const initialData: WikiFile[] = [
  {
    id: "1",
    name: "AML Policy.pdf",
    version: "v1.0",
    owner: "Dana",
    status: "Final",
    lastEdited: new Date(),
  },
  {
    id: "2",
    name: "SAR Template.docx",
    version: "v0.9",
    owner: "Lotem",
    status: "Review",
    lastEdited: new Date(),
  },
];

const Wiki: React.FC = () => {
  const [files, setFiles] = useState<WikiFile[]>(initialData);
  const [newFile, setNewFile] = useState<File | null>(null);
  const [metadata, setMetadata] = useState({
    name: "",
    version: "v1.0",
    owner: "",
    status: "Draft" as WikiFile["status"],
  });

  const handleUpload = () => {
    if (!newFile || !metadata.name || !metadata.owner) return;

    const file: WikiFile = {
      id: String(Date.now()),
      name: metadata.name,
      version: metadata.version,
      owner: metadata.owner,
      status: metadata.status,
      lastEdited: new Date(),
    };

    setFiles([file, ...files]);
    setNewFile(null);
    setMetadata({ name: "", version: "v1.0", owner: "", status: "Draft" });
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Compliance Wiki</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Input
          placeholder="File name (e.g. AML_Policy.pdf)"
          value={metadata.name}
          onChange={(e) => setMetadata({ ...metadata, name: e.target.value })}
        />
        <Input
          placeholder="Owner"
          value={metadata.owner}
          onChange={(e) => setMetadata({ ...metadata, owner: e.target.value })}
        />
        <Input
          placeholder="Version (e.g. v1.0)"
          value={metadata.version}
          onChange={(e) => setMetadata({ ...metadata, version: e.target.value })}
        />
        <select
          className="border rounded p-2"
          value={metadata.status}
          onChange={(e) =>
            setMetadata({ ...metadata, status: e.target.value as WikiFile["status"] })
          }
        >
          <option value="Draft">Draft</option>
          <option value="Review">Review</option>
          <option value="Final">Final</option>
        </select>
      </div>

      <Input
        type="file"
        onChange={(e) => setNewFile(e.target.files?.[0] || null)}
      />
      <Button onClick={handleUpload}>Upload File</Button>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>File Name</TableHead>
            <TableHead>Version</TableHead>
            <TableHead>Owner</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Last Edited</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {files.map((file) => (
            <TableRow key={file.id}>
              <TableCell>{file.name}</TableCell>
              <TableCell>{file.version}</TableCell>
              <TableCell>{file.owner}</TableCell>
              <TableCell>{file.status}</TableCell>
              <TableCell>{format(file.lastEdited, "PPPp")}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default Wiki;
