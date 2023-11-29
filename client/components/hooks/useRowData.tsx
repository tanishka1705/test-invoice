import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { AppState } from "../store/store";
import {
  clientStateType,
  invoiceHistoryType,
  invoiceStateType,
  projectStateType,
} from "@/types/types";
import getFromatDate, { getStandardDate } from "@/utils/getFormatDate";
import getCurrentDate from "@/utils/getCurrentDate";
import getTotalDays from "@/utils/getDays";

const useRowData = () => {
  const { clients } = useSelector<AppState>(
    (state) => state.client
  ) as clientStateType;

  const [clientRow, setClientRow] = useState<any>();

  useEffect(() => {
    setClientRow(
      clients
        ?.filter((client) => client.active === true)
        .map((client, indx) => {
          return {
            _id: client?._id,
            sno: indx + 1,
            client: client?.name,
            gstin: client?.gstin,
            tds: (client?.tds || 0) + "%",
            address: `${client?.address?.street}, ${client?.address?.city} ${client?.address?.pin}, ${client?.address?.state}, ${client?.address?.country}`,
            projects: client?.projects?.length,
          };
        })
    );
  }, [clients]);

  return { clientRow };
};

export const useProjectRowData = () => {
  const { projects } = useSelector<AppState>(
    (state) => state.project
  ) as projectStateType;

  const { invoiceType } = useSelector<AppState>(
    (state) => state.invoice
  ) as invoiceStateType;

  const [projectRow, setProjectRow] = useState<any>();

  useEffect(() => {
    setProjectRow(
      projects
        ?.filter((project) => project.active === true && project.projectType === invoiceType)
        ?.map((project, indx) => ({
          _id: project?._id,
          sno: indx + 1,
          description: project.description,
          client: project?.projectBelongsTo?.name,
          projectCycle: +project?.projectCycle,
          projectType: project?.projectType,
          projectAmount: project?.projectAmount
            ? +project?.projectAmount
            : "N/A",
          rate: `${
            project?.rate?.rate
              ? `${project?.rate?.rate} ${project?.rate?.currency}`
              : "N/A"
          }`,
          conversionRate: project?.conversionRate
            ? +project?.conversionRate
            : "N/A",
        }))
    );
  }, [invoiceType, projects]);
  return { projectRow };
};

export const useInvoiceRowData = () => {
  const { invoice } = useSelector<AppState>(
    (state) => state.history
  ) as invoiceHistoryType;
  const [historyRow, setHistoryRow] = useState<any>();

  useEffect(() => {
    setHistoryRow(
      invoice
        ?.filter((invoice) => invoice.active === true)
        ?.map((invoice, indx) => {
          return {
            _id: invoice?._id,
            sno: indx + 1,
            invoiceNumber: invoice?.invoiceNumber,
            client: invoice?.createdFor?.name,
            projects: invoice?.projects?.map(
              (project: any) =>
                project?.description || project?.projectDetails?.description
            ),
            createdOn: getStandardDate(invoice?.createdOn),
            dueDate: getStandardDate(invoice?.dueDate),
            daysLeft:
              getTotalDays(
                +getFromatDate(invoice?.createdOn),
                +getCurrentDate()
              ) <= 0
                ? getTotalDays(
                    +getFromatDate(invoice?.dueDate),
                    +getCurrentDate()
                  )
                : getTotalDays(
                    +getFromatDate(invoice?.dueDate),
                    +getFromatDate(invoice?.createdOn)
                  ) + "",
            subtotal: invoice?.subtotal,
            gst:
              typeof invoice?.GST === "object"
                ? `CGST: ${invoice?.GST?.CGST}, SGST: ${invoice?.GST?.CGST}`
                : invoice?.GST,
            total: invoice?.GrandTotal,
            amountReceived: invoice?.receivedStatus && invoice?.receivedStatus,
            totalAmountReceived:
              invoice?.receivedStatus &&
              invoice?.receivedStatus.reduce(
                (acc: number, amount: any) => (acc += amount?.amountReceived),
                0
              ),
            pendingAmount: invoice?.receivedStatus
              ? (
                  invoice?.GrandTotal -
                  invoice?.receivedStatus.reduce(
                    (acc: number, amount: any) =>
                      (acc += amount?.amountReceived),
                    0
                  )
                ).toFixed(2)
              : invoice?.GrandTotal,
            status: invoice?.status,
          };
        })
    );
  }, [invoice]);
  return { historyRow };
};

export const useCheckedProjectRowData = () => {
  const { detailedProject, invoiceType } = useSelector<AppState>(
    (state) => state.invoice
  ) as invoiceStateType;
  const { projects, clients } = useSelector<AppState>(
    (state) => state.client
  ) as clientStateType;

  const [projectRow, setProjectRow] = useState<any[]>([]);

  useEffect(() => {
    setProjectRow(
      detailedProject
        ?.filter((project) => project.projectType === invoiceType)
        ?.map((project, indx) => ({
          _id: project?._id,
          sno: indx + 1,
          description: project.description,
          period: project?.period || "Miscellaneous",
          workingDays: project?.workingDays,
          totalWorkingDays: project?.totalWorkingDays,
          hours: project?.hours,
          rate: `${
            project?.rate?.rate
              ? `${project?.rate?.rate} ${project?.rate?.currency}`
              : "N/A"
          }`,
          conversionRate: project?.conversionRate
            ? +project?.conversionRate
            : "N/A",
          projectAmount: project?.projectAmount
            ? +project?.projectAmount
            : "N/A",
          amount: project?.amount,
          projectBelongsTo: project?.projectBelongsTo,
        }))
    );
  }, [detailedProject, invoiceType]);
  return { projectRow };
};

export const useDetailedInvoice = () => {
  const { invoiceById } = useSelector<AppState>(
    (state) => state.history
  ) as invoiceHistoryType;

  const [projectRow, setProjectRow] = useState<any>();

  useEffect(() => {
    setProjectRow(
      invoiceById?.projects?.map((project: any, indx: number) => ({
        _id: project?._id,
        sno: indx + 1,
        description:
          project.description || project?.projectDetails?.description,
        client: project?.projectBelongsTo?.name,
        projectCycle: +project?.projectCycle,
        projectType: project?.projectType,
        projectAmount: project?.projectAmount ? +project?.projectAmount : "N/A",
        period: project?.period || "Miscellaneous",
        workingDays: project?.workingDays,
        totalWorkingDays: project?.totalWorkingDays,
        hours: project?.hours + ' hr',
        rate: `${project?.rate?.rate || project?.projectDetails?.rate?.rate} ${
          project?.rate?.currency || project?.projectDetails?.rate?.currency
        }`,
        conversionRate: `${project?.conversionRate || project?.projectDetails?.conversionRate} INR`,
        amount: project?.amount,
      }))
    );
  }, [invoiceById]);
  return { projectRow };
};

export default useRowData;
