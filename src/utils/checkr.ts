// checkr passes an event to our webhook which can signify an event related
// to a candidate being created or report being completed
export interface CheckrEvent<T> {
  id: string;
  object: "event";
  type: string;
  created_at: string;
  data: {
    object: T;
  };
  account_id: string;
}

export interface CheckrCandidate {
  id: string;
  created_at: string;
  first_name: string;
  last_name: string;
  email: string;
}

export interface CheckrReport {
  id: string;
  object: "report";
  uri: string;
  created_at: string;
  received_at: string;
  status: "pending" | "complete" | "suspended" | "dispute" | "canceled";
  result: "clear" | "consider" | null;
  // package: "driver_pro";
  package: string;
  source: "api";
  candidate_id: string;
  ssn_trace_id: string;
  sex_offender_search_id: string;
  national_criminal_search_id: string;
  county_criminal_search_ids: string[];
  state_criminal_search_ids: string[];
  motor_vehicle_report_id: string;
}

export const createCandidate = async (
  firstName: string,
  lastName: string,
  email: string
) => {
  console.log("(createCandidate checkr.ts) created Candidate for " + firstName);
  const encoded = Buffer.from(`${process.env.CHECKR_KEY!}:`).toString("base64");

  const body = new URLSearchParams();

  body.append("first_name", firstName);
  body.append("last_name", lastName);
  body.append("email", email);

  // TODO: use production
  const response = await fetch("https://api.checkr-staging.com/v1/candidates", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${encoded}`,
    },
    body: body.toString(),
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(JSON.stringify(data));
  }

  const data = await response.json();
  return data as CheckrCandidate;
};

// create an mock report for a candidate 
export const createMockReport = async (candidateId: string) => {
  const packageSlug = "essential";  // use the essential one for now

  // api key
  const encoded = Buffer.from(`${process.env.CHECKR_KEY!}:`).toString("base64");

  const body = new URLSearchParams();
  body.append("candidate_id", candidateId);
  body.append("package", packageSlug);

  const response = await fetch("https://api.checkr.com/v1/reports", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${encoded}`,
    },
    body: body.toString(),
  });

  if (!response.ok) {
    const data = await response.json();
    console.log("UH OH COULDNT CREATE MOCK REPORT FOR USER");
    console.log(JSON.stringify(data));
  }

  const data = await response.json();
  return data as CheckrReport;
}
