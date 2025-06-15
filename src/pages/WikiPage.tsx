import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";

type Permission = "view" | "edit" | "admin";

interface WikiFile {
  id: string;
  name: string;
  version: string;
  owner: string;
  status: "Draft" | "Review" | "Final";
  lastEdited: Date;
  history: { status: string; changedAt: Date }[];
  permissions: { user: string; level: Permission }[];
}

const initialData: WikiFile[] = [
  {
    id: "1",
    name: "AML Policy.pdf",
    version: "v1.0",
    owner: "Dana",
    status: "Final",
    lastEdited: new Date(),
    history: [{ status: "Final", changedAt: new Date() }],
    permissions: [
      { user: "Dana", level: "admin" },
      { user: "Lotem", level: "edit" },
    ],
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
    permissions: "",
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
      history: [{ status: metadata.status, changedAt: new Date() }],
      permissions: metadata.permissions
        .split(",")
        .map((p) => {
          const [user, level] = p.split(":");
          return { user: user.trim(), level: level.trim() as Permission };
        }),
    };

    setFiles((prev) => [file, ...prev]);
    setNewFile(null);
    setMetadata({
      name: "",
      version: "v1.0",
      owner: "",
      status: "Draft",
      permissions: "",
    });
  };

  const updateStatus = (id: string, newStatus: WikiFile["status"]) => {
    setFiles((prev) =>
      prev.map((file) =>
        file.id === id
          ? {
              ...file,
              status: newStatus,
              lastEdited: new Date(),
              history: [...file.history, { status: newStatus, changedAt: new Date() }],
            }
          : file
      )
    );
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Compliance Wiki</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
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
          placeholder="Version"
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
        <Input
          placeholder="Permissions (e.g. Dana:admin, Lotem:edit)"
          value={metadata.permissions}
          onChange={(e) =>
            setMetadata({ ...metadata, permissions: e.target.value })
          }
        />
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
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {files.map((file) => (
            <TableRow key={file.id}>
              <TableCell>{file.name}</TableCell>
              <TableCell>{file.version}</TableCell>
              <TableCell>{file.owner}</TableCell>
              <TableCell>
                <select
                  className="border rounded p-1 text-sm"
                  value={file.status}
                  onChange={(e) =>
                    updateStatus(file.id, e.target.value as WikiFile["status"])
                  }
                >
                  <option value="Draft">Draft</option>
                  <option value="Review">Review</option>
                  <option value="Final">Final</option>
                </select>
              </TableCell>
              <TableCell>{format(file.lastEdited, "PPPp")}</TableCell>
              <TableCell className="space-x-2">
                <Button variant="outline" size="sm">
                  Preview
                </Button>
                <Button variant="outline" size="sm">
                  Download
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <h2 className="text-lg font-medium mt-6">Change History</h2>
      <ul className="list-disc ml-6 text-sm">
        {files.flatMap((file) =>
          file.history.map((h, i) => (
            <li key={`${file.id}-${i}`}>
              <strong>{file.name}</strong> changed to <em>{h.status}</em> on{" "}
              {format(h.changedAt, "PPPp")}
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default Wiki;
