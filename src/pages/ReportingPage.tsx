import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { format } from "date-fns";

const sarSections = [
  {
    title: "Subject Information",
    questions: [
      "Who is the subject of the SAR?",
      "What is their relationship to the institution?",
      "What is the subject's account number?",
    ],
  },
  {
    title: "Suspicious Activity",
    questions: [
      "Describe the suspicious activity.",
      "When did it occur?",
      "How was it detected?",
    ],
  },
  {
    title: "Transaction Details",
    questions: [
      "What transactions are involved?",
      "What is the total amount?",
      "Are there any related parties?",
    ],
  },
  {
    title: "Supporting Evidence",
    questions: [
      "What evidence supports the suspicion?",
      "Are there documents to attach?",
      "Has law enforcement been notified?",
    ],
  },
  {
    title: "Resolution & Next Steps",
    questions: [
      "What action is recommended?",
      "Who will review the SAR?",
      "What is the expected timeline?",
    ],
  },
];

const initialSARAnswers = sarSections.map((section) =>
  section.questions.map(() => "")
);

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const years = [2025, 2024, 2023, 2022, 2021];

const initialReports = [
  {
    number: "RPT-001",
    type: "SAR",
    status: "Draft",
    owner: "Alice",
    lastEdited: new Date(),
    comments: "Initial SAR draft.",
  },
  {
    number: "RPT-002",
    type: "CTR",
    status: "Submitted",
    owner: "Bob",
    lastEdited: new Date(),
    comments: "CTR for May 2025.",
  },
];

// Add SAR options for entities, counterparties, and suspicious transactions
const sarEntities = ["John Doe", "Acme Corp", "Jane Smith", "XYZ LLC"];
const sarCounterparties = ["Bank A", "Offshore Account", "Crypto Exchange", "Cash"];
const sarTransactions = [
  { id: 1, desc: "Wire transfer $10,000 to Offshore Account" },
  { id: 2, desc: "Cash deposit $5,000" },
  { id: 3, desc: "Crypto purchase $2,500" },
];

const sarSectionSchema = [
  {
    title: "Entity",
    field: "entity",
    options: sarEntities,
  },
  {
    title: "Counterparty",
    field: "counterparty",
    options: sarCounterparties,
  },
  {
    title: "Suspicious Transaction",
    field: "transaction",
    options: sarTransactions.map((t) => t.desc),
  },
  {
    title: "Reason",
    field: "reason",
    options: [
      "Unusual transaction pattern",
      "Large cash deposit",
      "Offshore transfer",
      "Crypto activity",
    ],
  },
  {
    title: "Detection Method",
    field: "detection",
    options: [
      "Automated alert",
      "Manual review",
      "Customer tip-off",
      "Regulatory request",
    ],
  },
];

const initialSARForm = {
  entity: sarEntities[0],
  counterparty: sarCounterparties[0],
  transaction: sarTransactions[0].desc,
  reason: "Unusual transaction pattern",
  detection: "Automated alert",
};

const ReportingPage: React.FC = () => {
  const [reportType, setReportType] = useState("SAR");
  const [sarAnswers, setSarAnswers] = useState(initialSARAnswers);
  const [ctrType, setCtrType] = useState("CTR");
  const [ctrMonth, setCtrMonth] = useState(months[new Date().getMonth()]);
  const [ctrYear, setCtrYear] = useState(years[0]);
  const [ctrComments, setCtrComments] = useState("");
  const [reports, setReports] = useState(initialReports);
  const [showReview, setShowReview] = useState(false);
  const [sarForm, setSarForm] = useState(initialSARForm);
  const [sarNarrative, setSarNarrative] = useState("");

  // SAR handlers
  const handleSarAnswer = (sectionIdx: number, qIdx: number, value: string) => {
    setSarAnswers((prev) => {
      const updated = prev.map((section, i) =>
        i === sectionIdx
          ? section.map((ans, j) => (j === qIdx ? value : ans))
          : section
      );
      return updated;
    });
  };

  const handleSubmitSAR = () => {
    setReports([
      {
        number: `RPT-${(reports.length + 1).toString().padStart(3, "0")}`,
        type: "SAR",
        status: "Draft",
        owner: "Current User",
        lastEdited: new Date(),
        comments: "SAR draft created.",
      },
      ...reports,
    ]);
    setShowReview(false);
    setSarAnswers(initialSARAnswers);
  };

  // CTR handlers
  const handleSubmitCTR = () => {
    setReports([
      {
        number: `RPT-${(reports.length + 1).toString().padStart(3, "0")}`,
        type: ctrType,
        status: "Draft",
        owner: "Current User",
        lastEdited: new Date(),
        comments: ctrComments,
      },
      ...reports,
    ]);
    setCtrComments("");
  };

  // SAR narrative suggestion
  const suggestNarrative = () => {
    setSarNarrative(
      `On ${new Date().toLocaleDateString()}, ${sarForm.entity} conducted a suspicious transaction (${sarForm.transaction}) with ${sarForm.counterparty}. The reason flagged was: ${sarForm.reason}. Detection method: ${sarForm.detection}. Further review is recommended.`
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>New Report</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-4">
            <Button
              variant={reportType === "SAR" ? "default" : "outline"}
              onClick={() => setReportType("SAR")}
            >
              SAR
            </Button>
            <Button
              variant={reportType === "CTR" ? "default" : "outline"}
              onClick={() => setReportType("CTR")}
            >
              CTR
            </Button>
          </div>

          {/* SAR Form - new schema */}
          {reportType === "SAR" && !showReview && (
            <form className="space-y-6">
              {sarSectionSchema.map((section) => (
                <div key={section.title} className="border rounded p-4 mb-2">
                  <h3 className="font-semibold mb-2">{section.title}</h3>
                  <select
                    className="border px-2 py-1 rounded text-sm w-full"
                    value={sarForm[section.field]}
                    onChange={(e) => setSarForm((prev) => ({ ...prev, [section.field]: e.target.value }))}
                  >
                    {section.options.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
              ))}
              <Button type="button" onClick={suggestNarrative}>
                Suggest Narrative
              </Button>
              {sarNarrative && (
                <div className="border rounded p-4 my-2 bg-muted/30">
                  <div className="font-semibold mb-1">Suggested Narrative:</div>
                  <div className="text-sm">{sarNarrative}</div>
                </div>
              )}
              <Button type="button" onClick={() => setShowReview(true)}>
                Review SAR
              </Button>
            </form>
          )}

          {/* SAR Review - show fields and values */}
          {reportType === "SAR" && showReview && (
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">SAR Review</h3>
              <div className="border rounded p-4 mb-2">
                <ul className="list-disc ml-6">
                  {sarSectionSchema.map((section) => (
                    <li key={section.title}>
                      <span className="font-medium">{section.title}</span>: {sarForm[section.field]}
                    </li>
                  ))}
                  <li>
                    <span className="font-medium">Narrative</span>: {sarNarrative}
                  </li>
                </ul>
              </div>
              <Button type="button" onClick={handleSubmitSAR}>
                Submit SAR as Draft
              </Button>
              <Button type="button" variant="outline" onClick={() => setShowReview(false)}>
                Back to Edit
              </Button>
            </div>
          )}

          {/* CTR Form - improved month/year selection */}
          {reportType === "CTR" && (
            <form className="space-y-6">
              <div className="flex gap-4 mb-2">
                <Button
                  variant={ctrType === "CTR" ? "default" : "outline"}
                  onClick={(e) => {
                    e.preventDefault();
                    setCtrType("CTR");
                  }}
                >
                  CTR
                </Button>
                <Button
                  variant={ctrType === "CTR-UPD" ? "default" : "outline"}
                  onClick={(e) => {
                    e.preventDefault();
                    setCtrType("CTR-UPD");
                  }}
                >
                  CTR-UPD
                </Button>
              </div>
              <div className="flex gap-4 mb-2">
                <select
                  className="border px-2 py-1 rounded text-sm"
                  value={ctrMonth}
                  onChange={(e) => setCtrMonth(e.target.value)}
                >
                  {months.map((m) => (
                    <option key={m}>{m}</option>
                  ))}
                </select>
                <select
                  className="border px-2 py-1 rounded text-sm"
                  value={ctrYear}
                  onChange={(e) => setCtrYear(Number(e.target.value))}
                >
                  {years.map((y) => (
                    <option key={y}>{y}</option>
                  ))}
                </select>
              </div>
              <div className="mb-2">
                <label className="block text-sm mb-1">Comments</label>
                <Input
                  value={ctrComments}
                  onChange={(e) => setCtrComments(e.target.value)}
                  placeholder="Add comments for this CTR..."
                />
              </div>
              <Button type="button" onClick={handleSubmitCTR}>
                Submit CTR as Draft
              </Button>
            </form>
          )}
        </CardContent>
      </Card>

      {/* Reporting Log Table with status dropdown */}
      <Card>
        <CardHeader>
          <CardTitle>Reporting Log</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm border">
              <thead>
                <tr className="bg-muted">
                  <th className="p-2 border">Report #</th>
                  <th className="p-2 border">Type</th>
                  <th className="p-2 border">Status</th>
                  <th className="p-2 border">Owner</th>
                  <th className="p-2 border">Last Edited</th>
                  <th className="p-2 border">Comments</th>
                  <th className="p-2 border">Preview</th>
                  <th className="p-2 border">Download</th>
                </tr>
              </thead>
              <tbody>
                {reports.map((r, idx) => (
                  <tr key={r.number} className={idx % 2 ? "bg-muted/30" : ""}>
                    <td className="p-2 border">{r.number}</td>
                    <td className="p-2 border">{r.type}</td>
                    <td className="p-2 border">
                      <select
                        className="border px-2 py-1 rounded text-sm"
                        value={r.status}
                        onChange={e => {
                          const newStatus = e.target.value;
                          setReports(reports =>
                            reports.map(rep =>
                              rep.number === r.number ? { ...rep, status: newStatus } : rep
                            )
                          );
                        }}
                      >
                        <option value="Draft">Draft</option>
                        <option value="In Review">In Review</option>
                        <option value="Submitted">Submitted</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                    </td>
                    <td className="p-2 border">{r.owner}</td>
                    <td className="p-2 border">{format(r.lastEdited, "yyyy-MM-dd HH:mm")}</td>
                    <td className="p-2 border">{r.comments}</td>
                    <td className="p-2 border">
                      <Button size="sm" variant="outline">Preview</Button>
                    </td>
                    <td className="p-2 border">
                      <Button size="sm" variant="outline">Download</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportingPage;
