import { AppDispatch, AppState } from "@/components/store/store";
import {
  PdfPreviewProps,
  clientStateType,
  dataProps,
  invoiceHistoryType,
  invoiceStateType,
  userType,
} from "@/types/types";
import { PDFViewer, pdf } from "@react-pdf/renderer";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import PdfPreview from "../PdfPreview/PdfPreview";
import invoice, {
  setDate,
  setDueDate,
  setInvoiceNumber,
  setInvoiceType,
  updatedChecked,
} from "@/components/store/invoice";
import toast from "react-hot-toast";
import { getClientById } from "@/components/store/client";
import { postInvoiceHistory } from "@/components/store/invoiceHistory";
import { useRouter } from "next/router";
import { faFilePdf } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const GeneratePDF = () => {
  const router = useRouter();
  const [pdfBlob, setPdfBlob] = useState<Blob | MediaSource>();
  const [isOpen, onClose] = useState(false);
  const [checkedInvoice, setCheckedInvoice] = useState<
    dataProps[] | undefined
  >();
  const [pdfPreviewData, setpdfPreviewData] = useState<PdfPreviewProps>();

  const {
    detailedProject,
    invoiceType,
    invoiceNumber,
    Date,
    DueDate,
    subtotal,
    GrandTotal,
    GST,
  } = useSelector<AppState>((state) => state.invoice) as invoiceStateType;
  const { name, email, address, contact, account, pan, gstin } =
    useSelector<AppState>((state) => state.user.user) as userType;
  const { clientById } = useSelector<AppState>(
    (state) => state.client
  ) as clientStateType;
  const { invoice } = useSelector<AppState>(
    (state) => state.history
  ) as invoiceHistoryType;
  const { tds, discount } = useSelector<AppState>(
    (state) => state.invoice
  ) as invoiceStateType;

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    setCheckedInvoice(
      detailedProject.filter((invoice) => invoice.checked === true)
    );
    dispatch(getClientById(detailedProject[0]?.projectBelongsTo));
  }, [detailedProject]);

  useEffect(() => {
    setpdfPreviewData({
      invoice: {
        invoice: checkedInvoice,
        invoiceType,
        invoiceNumber,
        Date,
        DueDate,
      },
      user: {
        name,
        email,
        address,
        contact,
        account,
        pan,
        gstin,
      },
      client: {
        name: clientById?.name,
        gstin: clientById?.gstin,
        tds: clientById?.tds,
        address: clientById?.address,
        active: true,
      },
      total: {
        tds,
        discount,
        subtotal,
        GST,
        GrandTotal,
      },
    });
  }, [
    Date,
    DueDate,
    GST,
    GrandTotal,
    checkedInvoice,
    clientById?.tds,
    invoiceNumber,
    subtotal,
    // tds,
    // discount,
  ]);

  const generatePDF = async () => {
    if (invoiceNumber === "" || !Date || !DueDate)
      return toast.error("All fileds are required!");

    if (!checkedInvoice || checkedInvoice.length === 0) {
      return toast.error(
        "No rows Selected. Please select records to generate an invoice."
      );
    }
    onClose(true);

    const pdfData = await pdf(<PdfPreview data={pdfPreviewData} />).toBlob();
    setPdfBlob(pdfData);
  };

  const downloadPDF = () => {
    console.log(subtotal, GrandTotal);

    if (pdfBlob) {
      const pdfUrl = URL.createObjectURL(pdfBlob);
      const a = document.createElement("a");
      a.href = pdfUrl;
      a.download = "invoice.pdf";
      a.style.display = "none";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      invoiceType === "monthly"
        ? dispatch(
            postInvoiceHistory({
              createdFor: clientById?._id || "",
              invoiceNumber,
              createdOn: Date?.toLocaleDateString("en-GB"),
              dueDate: DueDate?.toLocaleDateString("en-GB"),
              projects: detailedProject
                ?.filter((project) => project.checked === true)
                .map((project) => {
                  return {
                    id: project.id,
                    projectDetails: project._id,
                    description: project?.description,
                    period: project.period,
                    workingDays: project.workingDays,
                    totalWorkingDays: project.totalWorkingDays,
                    amount: (project.amount && +project.amount) || 0,
                  };
                }),
              discount,
              tds,
              subtotal,
              GST,
              GrandTotal,
              status: "raised",
              invoiceType,
              active: true,
            })
          )
        : dispatch(
            postInvoiceHistory({
              createdFor: clientById?._id || "",
              invoiceNumber,
              createdOn: Date?.toLocaleDateString("en-GB"),
              dueDate: DueDate?.toLocaleDateString("en-GB"),
              projects: detailedProject
                ?.filter((project) => project.checked === true)
                .map((project) => {
                  return {
                    id: project.id,
                    description: project?.description,
                    projectDetails: project._id,
                    rate: project?.rate,
                    conversionRate: project?.conversionRate,
                    hours: (project.hours && +project.hours?.toString()) || "",
                    amount: (project.amount && +project.amount) || 0,
                  };
                }),
              discount,
              tds,
              subtotal,
              GST,
              GrandTotal,
              status: "raised",
              invoiceType,
              active: true,
            })
          );

      // unset all
      checkedInvoice?.map((project, indx) =>
        dispatch(updatedChecked({ indx: project._id, checked: false }))
      );
      dispatch(setInvoiceNumber(""));
      dispatch(setDate(new window.Date()));
      dispatch(setDueDate(new window.Date()));
      dispatch(setInvoiceType(""));
      router.push("/history");
    }
    onClose(false);
  };

  return (
    <div className="w-full flex justify-end" onClick={generatePDF}>
      <button className="bg-[#5a51be] cursor-pointer text-stone-100 text-sm px-3 py-2 rounded-md tracking-wider font-bold">
        Save as PDF <FontAwesomeIcon icon={faFilePdf} />
      </button>

      {isOpen && (
        <Modal isOpen={isOpen} onClose={() => onClose(false)} size="4xl">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader></ModalHeader>
            <ModalBody>
              <PDFViewer width="100%" height="550em">
                <PdfPreview data={pdfPreviewData} />
              </PDFViewer>
            </ModalBody>
            <ModalFooter>
              <Button
                className="bg-stone-200"
                mr={3}
                onClick={() => onClose(false)}
                size={"sm"}
              >
                Close
              </Button>
              <Button
                className="bg-[#5a51be] text-stone-100 px-4  hover:bg-[#6960cc]"
                onClick={downloadPDF}
                size={"sm"}
                colorScheme="purple"
              >
                Download PDF
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </div>
  );
};

export default GeneratePDF;
