import crypto from 'crypto';
import dotenv from "dotenv";
dotenv.config();

// checkr passes an event to our webhook which can signify an event related to a candidate being created or report being completed
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
  package: string;
  candidate_id: string;
  // screenings
  ssn_trace_id?: string;
  sex_offender_search_id?: string;
  national_criminal_search_id?: string;
  county_criminal_search_ids?: string[];
  state_criminal_search_ids?: string[];
  motor_vehicle_report_id?: string;
}

export interface CheckrInvitation {
  id: string;
  object: "invitation";
  uri: string;
  invitation_curl: string;
  status: "pending" | "complete" | "expired";
  created_at: string;
  expires_at: string;
  package: string;
  candidate_id: string;
  report_id: string | null // id of report created by invitation. will be null if invitation has not been completed yet
}

export const createCandidate = async (
  firstName: string,
  lastName: string,
  email: string,
  state: string,
  country: string
) => {
  const encoded = Buffer.from(`${process.env.CHECKR_KEY!}:`).toString("base64");

  const stateAbbreviation = STATE_ABBREVIATIONS[state.trim()];
  const payload = {
    first_name: firstName,
    last_name: lastName,
    email,
    work_locations: [
      { state: stateAbbreviation },
      { country: country }
    ]
  };

  const response = await fetch("https://api.checkr-staging.com/v1/candidates", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${encoded}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(JSON.stringify(data));
  }

  const data = await response.json();
  return data as CheckrCandidate;
};

export const createInvitation = async (
  candidateId: string,
  package_: string,
  state: string,
  country: string
  ) => 
  {
    try {
      const encoded = Buffer.from(`${process.env.CHECKR_KEY!}:`).toString("base64");

      const stateAbbreviation = STATE_ABBREVIATIONS[state.trim()];
      const payload = {
        candidate_id: candidateId,
        package: package_,
        work_locations: [
          { state: stateAbbreviation,
            country: country }
        ]
      };
      // console.log(payload);

      const response = await fetch("https://api.checkr-staging.com/v1/invitations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${encoded}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(JSON.stringify(data));
      }

      const data = await response.json();
      return data as CheckrInvitation;
    } catch (error) {
      console.log("error creating Checkr invitation");
      console.log(error);
    }
};

// verify the encrypted signature Checkr provides
export const verifyCheckrSignature = (secret: string, compactJsonPayload: Buffer, signature?: string) => {
  if (!signature) return false;

  const hmac = crypto.createHmac("sha256", secret)
  const computedHash = hmac.update(compactJsonPayload).digest("hex");

  return crypto.timingSafeEqual(Buffer.from(signature, "hex"), Buffer.from(computedHash, "hex"))
}

export const createMockReport = async (candidateId: string) => {
  const packageSlug = "essential";  // use the 'essential' package for now

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
    console.log("unable to create mock report for user");
    console.log(JSON.stringify(data));
  }

  const data = await response.json();
  return data as CheckrReport;
}


export const STATE_ABBREVIATIONS: Record<string, string> = {
  "Alabama": "AL",
  "Alaska": "AK",
  "Arizona": "AZ",
  "Arkansas": "AR",
  "California": "CA",
  "Colorado": "CO",
  "Connecticut": "CT",
  "Delaware": "DE",
  "Florida": "FL",
  "Georgia": "GA",
  "Hawaii": "HI",
  "Idaho": "ID",
  "Illinois": "IL",
  "Indiana": "IN",
  "Iowa": "IA",
  "Kansas": "KS",
  "Kentucky": "KY",
  "Louisiana": "LA",
  "Maine": "ME",
  "Maryland": "MD",
  "Massachusetts": "MA",
  "Michigan": "MI",
  "Minnesota": "MN",
  "Mississippi": "MS",
  "Missouri": "MO",
  "Montana": "MT",
  "Nebraska": "NE",
  "Nevada": "NV",
  "New Hampshire": "NH",
  "New Jersey": "NJ",
  "New Mexico": "NM",
  "New York": "NY",
  "North Carolina": "NC",
  "North Dakota": "ND",
  "Ohio": "OH",
  "Oklahoma": "OK",
  "Oregon": "OR",
  "Pennsylvania": "PA",
  "Rhode Island": "RI",
  "South Carolina": "SC",
  "South Dakota": "SD",
  "Tennessee": "TN",
  "Texas": "TX",
  "Utah": "UT",
  "Vermont": "VT",
  "Virginia": "VA",
  "Washington": "WA",
  "West Virginia": "WV",
  "Wisconsin": "WI",
  "Wyoming": "WY",
};
