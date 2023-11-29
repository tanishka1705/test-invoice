export interface dataProps {
  _id: string;
  id: number;
  indx?: number;
  projectType?: string;
  description: string;
  period?: string;
  workingDays?: string;
  totalWorkingDays?: string;
  hours?: string | number | any;
  amount?: string | number;
  projectAmount?: number;
  projectCycle?: string | number;
  rate?: { currency: string; rate: string };
  conversionRate?: number;
  checked?: boolean;
  projectBelongsTo?: string;
}

export interface rateType {
  currency: string;
  rate: number;
}

export interface childrenProps {
  children: JSX.Element | JSX.Element[] | string;
}

export interface loginType {
  email: string;
  password: string;
}

export interface userType {
  _id?: string;
  name: string;
  email: string;
  gstin: string;
  pan: string;
  account: {
    acc_no: number | string;
    bank: string;
    ifsc: string;
  };
  address: {
    street: string;
    city: string;
    state: string;
    pin: number | string;
    country: string;
  };
  contact: number | string;
}
export interface addressType {
  street: string;
  city: string;
  pin: string;
  state: string;
  country: string;
}

export interface clientType {
  _id?: string;
  name: string;
  gstin: string;
  address: addressType;
  projects?: string[];
  active: boolean;
  tds: number;
}

export interface projectType {
  _id?: string;
  projectType?: string;
  description: string;
  rate: {
    currency: string;
    rate?: number;
  };
  projectAmount: number;
  projectCycle: string | number;
  conversionRate?: number;
  projectBelongsTo?: string | clientType | any;
  active: boolean;
}

export interface createProjectType {
  projectType?: string;
  description: string;
  rate: {
    currency: string;
    rate?: number;
  };
  amount?: number;
  projectCycle: string | number;
  companyId: string;
  conversionRate?: number;
}

export interface userStateType {
  user: userType;
  created: boolean;
  isLoading: boolean;
  error: string | any;
}

export interface projectStateType {
  projects: projectType[];
  created: boolean;
  isLoading: boolean;
  updated: boolean;
  error: { status: number | string; message: string };
}

export interface clientStateType {
  clients: clientType[];
  created: boolean;
  updated: boolean;
  clientById: clientType;
  clientState: string;
  projects: projectType[];
  isLoading: boolean;
  isHidden: boolean;
  error?: { status: number | string; message: string };
}

export interface invoiceStateType {
  invoiceType: string;
  invoiceNumber: string;
  Date: Date;
  DueDate: Date;
  isChecked: boolean;
  detailedProject: dataProps[];
  subtotal: number;
  discount?: number;
  tds?: number;
  GST: { CGST: number; SGST: number } | number;
  GrandTotal: number;
  resetYear: number;
  active: true;
}

export interface PdfPreviewProps {
  invoice: {
    invoice: dataProps[] | undefined;
    invoiceType: string;
    invoiceNumber: string;
    Date: Date;
    DueDate: Date;
  };
  user: userType;
  client: clientType;
  total: {
    tds: number | undefined;
    discount: number | undefined;
    subtotal: number;
    GST: { CGST: number; SGST: number } | number;
    GrandTotal: number;
  };
}

export interface invoiceProjectType {
  _id?: string;
  id: number;
  projectDetails: projectType | string;
  period?: string;
  workingDays?: string;
  totalWorkingDays?: string;
  hours?: string | number;
  amount: number;
  projectCycle?: string | number;
}

export interface invoiceType {
  _id?: string;
  createdFor: string | clientType | any;
  invoiceNumber: string;
  createdOn: string | any;
  dueDate: string | any;
  projects: invoiceProjectType[] | any;
  discount?: number;
  tds?: number;
  subtotal: number;
  GST: { CGST: number; SGST: number } | number;
  GrandTotal: number;
  receivedStatus?: { amountReceived: number; receivedOn: string }[];
  invoiceStatus?: string;
  status: string;
  invoiceType: string;
  invoiceCreatedBy?: userType;
  active: true;
}

export interface invoiceHistoryType {
  invoice: invoiceType[];
  invoiceById: invoiceType;
  isLoading: boolean;
  created: boolean;
  updated: boolean;
  error: { status: string; message: string } | any;
}
