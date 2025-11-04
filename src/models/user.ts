import type Model from "./-model";

export default interface UserModel extends Model {
  created_at: string;

  first_name: string | null;
  last_name: string | null;
  email: string;
  phone: string | null;

  modes: ("seeker" | "provider" | "broker")[];

  // billing
  is_seeker: boolean;
  is_provider: boolean;

  is_admin: boolean;
  is_super_admin: boolean;
  is_disabled: boolean;

  user_id: string | null;
  is_paid: boolean | null;

  stripe_customer: string | null;
  stripe_account: string | null;

  checkr_candidate: string | null;
  checkr_status: "pending" | "success" | "error" | null;

  // background
  company_name: string | null;
  company_type: string | null;
  company_size: "1" | "2-9" | "10-24" | "25+" | null;
  company_inc_state: string | null;
  company_ein: string | null;
  company_government: string | null;
  company_address_1: string | null;
  company_address_2: string | null;
  company_city: string | null;
  company_state: string | null;
  company_zip: string | null;
  company_url: string | null;
  company_info: string | null;
  company_billing_period: "annually" | "quarterly" | null;

  // organization
  parent_user_id: string | null;
  org_role: "owner" | "staff" | "support" | "employee" | null;
  has_pending_org_invite: boolean;

  pfp: string | null;
}
