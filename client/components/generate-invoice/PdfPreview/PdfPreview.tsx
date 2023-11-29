import { PdfPreviewProps } from "@/types/types";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import React from "react";
import { useEffect, useState } from "react";
import { portraitStyles, landscapeStyles } from "../../../styles/pdfStyles";
import { getRateWithCurrencySymbol } from "@/utils/currencySymbol";

const PdfPreview = ({ data }: { data: PdfPreviewProps | any }) => {
  const [formattedInvoiceDate, setformattedInvoiceDate] = useState("");
  const [formattedDueDate, setformattedDueDate] = useState("");

  function formatDate(date: Date) {
    return date?.toLocaleDateString("en-GB");
  }
  useEffect(() => {
    setformattedInvoiceDate(formatDate(data?.invoice?.Date));
    setformattedDueDate(formatDate(data?.invoice?.DueDate));
  }, [data?.invoice?.Date, data?.invoice?.DueDate]);

  const isLandscape = data?.invoice?.invoice?.length <= 8;

  const pageSize: any = isLandscape ? [800, 1000] : "A4";

  // Use portrait styles by default
  let styles = portraitStyles;

  // Switch to landscape style if index > 10
  if (isLandscape) {
    styles = { ...portraitStyles, ...landscapeStyles } as any;
  }

  let discount = data?.total?.discount;
  let tds = data?.client?.tds;

  return (
    <Document>

      <Page size={pageSize} style={styles.page} wrap>

        <View style={styles.section}>
          {/* top */}
          <View style={styles.top}>
            <View style={styles.logo}>
              {data?.user?.name?.toLowerCase().startsWith("gammaedge") ? (
                <Image src="/images/logo.png" />
              ) : (
                <Image src="/images/cubexoLogo.png" />
              )}
            </View>
            <View style={styles.rightColumn}>
              <Text style={styles.title}>{data?.user?.name}</Text>
              <Text style={styles.txt2}>GSTIN: {data?.user?.gstin}</Text>
              <Text style={styles.txt2}>PAN : {data?.user?.pan}</Text>
              <Text style={styles.txt2}>{data?.user?.address?.street},</Text>
              <Text style={styles.txt2}>
                {data?.user?.address?.city} {data?.user?.address?.pin},{" "}
                {data?.user?.address?.state} {data?.user?.address?.country}
              </Text>
              <Text style={styles.email}>{data?.user?.email}</Text>{" "}
              <Text style={styles.contact}>{data?.user?.contact}</Text>

            </View>
          </View>

          {/* middle */}
          <View
            style={{ display: "flex", flexDirection: "row", marginLeft: "2%" }}
          >
            <View style={{ flex: 1, marginTop: 2, width: "100%" }}>
              <View style={{ flex: 1, marginTop: 1, width: "50%" }}>
                <Text style={styles.txt1}>
                  Invoice Number : {data?.invoice?.invoiceNumber}
                </Text>
                <Text style={styles.txt}>
                  Invoice Date : {formattedInvoiceDate}
                </Text>
                <Text style={styles.txt}>Due Date: {formattedDueDate}</Text>
              </View>{" "}
            </View>
            {data?.user?.name?.toLowerCase().startsWith("gammaedge") ? (
              <View style={styles.billTo}>
                <Text style={styles.title}>Bill To:</Text>
                <Text style={styles.title}>{data?.client?.name}</Text>
                <Text style={styles.txt2}>GSTIN: {data?.client?.gstin}</Text>
                <Text style={styles.txt2}>
                  {data?.client?.address?.street}, {data?.client?.address?.city}{" "}
                  {data?.client?.address?.pin}, {data?.client?.address?.state},{" "}
                  {data?.client?.address?.country}{" "}
                </Text>
              </View>
            ) : (
              //bill cubexo styling
              <View style={styles.billToCubexo}>
                <Text style={styles.title}>Bill To:</Text>
                <Text style={styles.title}>{data?.client?.name}</Text>
                <Text style={styles.txt2}>GSTIN: {data?.client?.gstin}</Text>
                <Text style={styles.address}>
                  {data?.client?.address?.street}, {data?.client?.address?.city}{" "}
                  {data?.client?.address?.pin}, {data?.client?.address?.state},{" "}
                  {data?.client?.address?.country}{" "}
                </Text>
              </View>
            )}
          </View>
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <Text style={[styles.tableHead, { fontWeight: "bold" }]}>
                Description
              </Text>
              {data?.invoice?.invoiceType !== "hourly" && (
                <Text style={[styles.tableHead, { fontWeight: "bold" }]}>
                  Period
                </Text>
              )}
              {data?.invoice?.invoiceType !== "hourly" && (
                <Text style={[styles.tableHead, { fontWeight: "bold" }]}>
                  Working Days
                </Text>
              )}
              {data?.invoice?.invoiceType !== "hourly" && (
                <Text style={[styles.tableHead, { fontWeight: "bold" }]}>
                  Total Working Days
                </Text>
              )}
              {data?.invoice?.invoiceType === "hourly" && (
                <Text style={[styles.tableHead, { fontWeight: "bold" }]}>
                  Rate
                </Text>
              )}
              {data?.invoice?.invoiceType === "hourly" && (
                <Text style={[styles.tableHead, { fontWeight: "bold" }]}>
                  Hour
                </Text>
              )}
              {data?.invoice?.invoiceType === "hourly" && (
                <Text style={[styles.tableHead, { fontWeight: "bold" }]}>
                  Conversion Rate
                </Text>
              )}
              <Text style={[styles.tableHead, { fontWeight: "bold" }]}>
                Amount
              </Text>
            </View>

            {data?.invoice?.invoice?.map((invoice: any, index: number) => (
              <View key={invoice?.id} style={styles.tableRow}>
                <Text style={styles.tableCell}>
                  {invoice?.description || invoice?.projectDetails?.description}
                </Text>
                {data?.invoice?.invoiceType !== "hourly" && (
                  <Text style={styles.tableCell}>{invoice?.period}</Text>
                )}
                {data.invoice.invoiceType !== "hourly" && (
                  <Text style={styles.tableCell}>{invoice.workingDays}</Text>
                )}
                {data?.invoice?.invoiceType !== "hourly" && (
                  <Text style={styles.tableCell}>
                    {invoice.totalWorkingDays}
                  </Text>
                )}

                {/* {data?.invoice?.invoiceType === "hourly" && (
                  <Text style={styles.tableCell}>
                    {invoice?.rate?.rate || invoice?.projectDetails?.rate?.rate}
                    {invoice?.rate?.currency === "USD"
                      ? "$"
                      : invoice?.rate?.currency === "POUND"
                      ? "£"
                      : invoice?.rate?.currency === "INR"
                      ? "INR"
                      : ""}{" "}
                    / Hour
                  </Text>
                )} */}

                {/* Rate in test */}
                {data?.invoice?.invoiceType === "hourly" && (
                  <Text style={styles.tableCell}>
                    {getRateWithCurrencySymbol(
                      invoice?.rate?.rate || invoice?.projectDetails?.rate?.rate,
                      invoice?.rate?.currency
                    )}
                  </Text>
                )}


                {data?.invoice?.invoiceType === "hourly" && (
                  <Text style={styles.tableCell}>{invoice?.hours}</Text>
                )}

                {/* {data?.invoice?.invoiceType === "hourly" && (
                  <Text style={styles.tableCell}>
                    {invoice?.conversionRate ||
                      invoice?.projectDetails?.conversionRate ||
                      "N/A"}
                  </Text>
                )} */}
                {data?.invoice?.invoiceType === "hourly" && (
                  <Text style={styles.tableCell}>
                    {invoice?.rate?.currency === "USD"
                      ? `1$ = ${
                          invoice?.conversionRate ||
                          invoice?.projectDetails?.conversionRate
                        } INR`
                      : invoice?.rate?.currency === "POUND"
                      ? `1£ = ${
                          invoice?.conversionRate ||
                          invoice?.projectDetails?.conversionRate
                        } INR`
                      : "N/A"}
                  </Text>
                )}

                <Text style={styles.tableCell}>{invoice?.amount}</Text>
              </View>

              //logic for conditionally rendering epmty row after particular index

              // <React.Fragment key={invoice?.id}>
              //   <View style={styles.tableRow}>
              //     <Text style={styles.tableCell}>
              //       {invoice?.description || invoice?.projectDetails?.description}
              //     </Text>
              //     {data?.invoice?.invoiceType !== "hourly" && (
              //       <Text style={styles.tableCell}>{invoice?.period}</Text>
              //     )}
              //     {data.invoice.invoiceType !== "hourly" && (
              //       <Text style={styles.tableCell}>{invoice.workingDays}</Text>
              //     )}
              //     {data?.invoice?.invoiceType !== "hourly" && (
              //       <Text style={styles.tableCell}>{invoice.totalWorkingDays}</Text>
              //     )}
              //     {data?.invoice?.invoiceType === "hourly" && (
              //       <Text style={styles.tableCell}>
              //         {invoice?.rate?.rate || invoice?.projectDetails?.rate?.rate}
              //         {invoice?.rate?.currency === 'USD' ? '$' :
              //           invoice?.rate?.currency === 'POUND' ? '£' :
              //           invoice?.rate?.currency === 'INR' ? 'INR' : ''} / Hour
              //       </Text>
              //     )}
              //     {data?.invoice?.invoiceType === "hourly" && (
              //       <Text style={styles.tableCell}>{invoice?.hours}</Text>
              //     )}
              //     {data?.invoice?.invoiceType === "hourly" && (
              //       <Text style={styles.tableCell}>
              //         {invoice?.conversionRate ||
              //           invoice?.projectDetails?.conversionRate ||
              //           "N/A"}
              //       </Text>
              //     )}
              //     <Text style={styles.tableCell}>{invoice?.amount}</Text>
              //   </View>
              //   {(index === 10) && (
              //     <View>
              //       <Text>{/* Empty cell */}</Text>
              //       <Text>{/* Empty cell */}</Text>
              //       <Text>{/* Empty cell */}</Text>
              //       <Text>{/* Empty cell */}</Text>
              //       <Text>{/* Empty cell */}</Text>
              //       <Text>{/* Empty cell */}</Text>
              //       <Text>{/* Empty cell */}</Text>
              //       <Text>{/* Empty cell */}</Text>
              //     </View>
              //   )}
              // </React.Fragment>
            ))}
          </View>
          <View style={{ display: "flex", flexDirection: "row" }}>
            <View style={styles.account}>
              <Text style={styles.title}>{data?.user?.name}</Text>
              <Text style={styles.txt2}>
                A/C NO: {data?.user?.account?.acc_no}
              </Text>
              <Text style={styles.txt2}>BANK: {data?.user?.account?.bank}</Text>
              <Text style={styles.txt2}>IFSC: {data?.user?.account?.ifsc}</Text>
            </View>

            <View style={styles.subtotal}>
              {/* conditionally rendering discount and tds */}

              {discount !== undefined && discount !== null && discount !== 0 && (
                <Text style={styles.discount}>
                  DISCOUNT {"          "}
                  <Text style={styles.digit}>{discount}%</Text>
                </Text>
              )}
              <Text style={styles.subtotal}>
                SUBTOTAL {"          "}
                <Text style={styles.digit}>{data?.total?.subtotal}</Text>
              </Text>
              {tds !== undefined && tds !== null && tds !== 0 && (
                <Text style={styles.subtotal}>
                  TDS {"                       "}
                  <Text style={styles.digit}>{tds}%</Text>
                </Text>
              )}
              {typeof data?.total?.GST === "number" ? (
                <Text style={styles.cgst}>
                  CGST @18% {"          "}
                  <Text style={styles.digit}>{data?.total?.GST}</Text>
                </Text>
              ) : (
                <View>
                  <Text style={styles.cgst}>
                    CGST @9% {"          "}
                    <Text style={styles.digit}>{data?.total?.GST?.CGST}</Text>
                  </Text>
                  <Text style={styles.cgst}>
                    SGST @9% {"          "}
                    <Text style={styles.digit}>{data?.total?.GST?.SGST}</Text>
                  </Text>
                </View>
              )}
              <Text style={styles.total}>
                Total Amount {"        "}
                <Text style={styles.digit}>{data?.total?.GrandTotal}</Text>
              </Text>
            </View>
          </View>

          <Text style={styles.footer}>
            We appreciate your collaboration and look forword to a long
            relationship with you.
          </Text>
        </View>
      </Page>
    </Document>
  );
};
export default PdfPreview;

