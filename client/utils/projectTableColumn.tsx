import { faIndianRupeeSign } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function setTableColumn(invoiceType: string) {
  return [
    {
      headerName: "Description",
      field: "description",
      cellClass: "centered-cell",
      resizable: true,
      headerClass: "custom-header",
    },
    {
      headerName: "Period",
      field: "period",
      resizable: true,
      headerClass: "custom-header",
      cellClass: "centered-cell",
      hide: invoiceType === "monthly" ? false : true,
    },
    {
      headerName: "Working Days",
      field: "workingDays",
      resizable: true,
      headerClass: "custom-header",
      cellClass: "centered-cell",
      hide: invoiceType === "monthly" ? false : true,
    },
    {
      headerName: "Total Working Days",
      field: "totalWorkingDays",
      resizable: true,
      headerClass: "custom-header",
      cellClass: "centered-cell",
      hide: invoiceType === "monthly" ? false : true,
    },
    {
      headerName: "Rate",
      field: "rate",
      resizable: true,
      headerClass: "custom-header",
      cellClass: "centered-cell",
      hide: invoiceType === "hourly" ? false : true,
    },
    {
      headerName: "Hours",
      field: "hours",
      resizable: true,
      headerClass: "custom-header",
      cellClass: "centered-cell",
      hide: invoiceType === "hourly" ? false : true,
    },
    {
      headerName: "Conversion rate",
      field: "conversionRate",
      resizable: true,
      headerClass: "custom-header",
      cellClass: "centered-cell",
      hide: invoiceType === "hourly" ? false : true,
    },
    {
      headerName: "Project Amount",
      field: "projectAmount",
      resizable: true,
      headerClass: "custom-header",
      cellClass: "centered-cell",
      hide: invoiceType === "fixedbudget" ? false : true,
    },
    {
      headerName: "Amount",
      field: "amount",
      resizable: true,
      headerClass: "custom-header",
      cellClass: "centered-cell",
      cellRenderer: (params: any) => {
        return (
          <div className="flex justify-center space-x-1">
            <div className=" inline-block">
              <FontAwesomeIcon icon={faIndianRupeeSign} />
            </div>
            <p className=" inline-block">{params.data?.amount}</p>
          </div>
        );
      },
    },
  ];
}
