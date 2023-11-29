import { StyleSheet } from "@react-pdf/renderer";

//portrait mode Styling

export const portraitStyles = StyleSheet.create({
    page: {
        flexDirection: "row",
        backgroundColor: "white",
    },
    section: {
        margin: 10,
        padding: 10,
        flexGrow: 1,
    },
    heading: {
        fontSize: 20,
        marginBottom: 10,
        marginTop: 40,
        textAlign: "center",
        textDecoration: "underline",
    },
    table: {
        // display: 'table',
        width: "100%",
        marginTop: 30,
        marginBottom: 10,
    },
    tableRow: {
        flexDirection: "row",
    },
    tableHead: {
        padding: 4,
        fontSize: 8,
        fontWeight: "bold",
        textAlign: "center",
        width: "100%",
        backgroundColor: "#5A51BE",
        color: "white",
    },
    rightColumn: {
        // flex: 1,
        display: "flex",
        flexDirection: "column",
        // textAlign: 'right',
        fontSize: 10,
        marginTop: 10,
        marginRight: "35%",
    },
    tableCell: {
        border: "1 solid #B0B0B0",
        padding: 4,
        fontSize: 8,
        textAlign: "center",
        width: "100%",
    },
    txt: {
        fontSize: 10,
        marginTop: 3,
        backgroundColor: "#5A51BE",
        color: "white",
        padding: 2,
        // width: "38%",
    },
    txt1: {
        fontSize: 10,
        marginTop: 1,
        backgroundColor: "#5A51BE",
        color: "white",
        padding: 3,
        // width: "38%",
    },
    account: {
        marginTop: 35,
        fontSize: 12,
        flex: 1,
    },
    subtotal: {
        fontSize: 8.5,
        marginTop: 12,
    },
    discount: {
        marginTop: 25,
    },
    cgst: {
        marginTop: 12,
    },
    total: {
        marginTop: 12,
        backgroundColor: "#5A51BE",
        color: "white",
        padding: 5,
    },
    digit: {
        marginLeft: 50,
    },
    logo: {
        width: "150%",
        height: "100%",
        marginRight: "38%",
        marginTop: 20,
    },
    email: {
        fontSize: 8,
        color: "blue",
        textDecoration: "underline",
    },
    contact: {
        fontSize: 8,
        marginTop: 3,
    },
    top: {
        marginBottom: 10,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-around",
    },
    title: {
        fontSize: 10,
        marginBottom: 2,
        marginTop: 2,
    },
    txt2: {
        fontSize: 8.5,
    },
    billTo: {
        display: "flex",
        flexDirection: "column",
        fontSize: 12,
        marginTop: 2,
        marginRight: '9.5%',
        marginLeft: '5%',

    },
    billToCubexo: {
        display: "flex",
        flexDirection: "column",
        fontSize: 12,
        marginTop: 1,
        marginRight: '19%',
        marginLeft: '5%',
        
    },
    address: {
        fontSize: 8.5,
        width: "60%",
    },
    gst: {
        fontSize: 8.5,
        marginTop: 5,
    },
    footer: {
        fontSize: 9,
        padding: 2,
        marginTop: 40,
        textAlign: "center",
        fontStyle: "italic",
    },
});

//landscape mode Styling

export const landscapeStyles = StyleSheet.create({
    page: {
        flexDirection: "row",
        backgroundColor: "white",
    },
    section: {
        margin: 10,
        padding: 10,
        flexGrow: 1,
    },
    heading: {
        fontSize: 20,
        marginBottom: 10,
        marginTop: 40,
        textAlign: "center",
        textDecoration: "underline",
    },
    table: {
        // display: 'table',     
        width: "100%",
        marginTop: 50,
        marginBottom: 10,
    },
    tableRow: {
        flexDirection: "row",
    },
    tableHead: {
        padding: 10,
        fontSize: 13,
        fontWeight: "bold",
        textAlign: "center",
        width: "100%",
        backgroundColor: "#5A51BE",
        color: "white",
    },
    rightColumn: {
       // flex: 1,
       display: "flex",
       flexDirection: "column",
       // textAlign: 'right',
       fontSize: 12,
       marginTop: 40,
      //marginRight: "20%",
       marginLeft: "50%",
    },
    tableCell: {
        border: "1 solid #B0B0B0",
        padding: 10,
        fontSize: 10,
        textAlign: "center",
        width: "100%",
    },
    txt: {
        fontSize: 13,
        marginTop: 10,
        backgroundColor: "#5A51BE",
        color: "white",
        padding: 5,
        // width: "37%",
    },
    txt1: {
        fontSize: 13,
        marginTop: 30,
        backgroundColor: "#5A51BE",
        color: "white",
        padding: 5,
        // width: "37%",
    },
    account: {
        marginTop: 60,
        fontSize: 12,
        flex: 1,
    },
    subtotal: {
        fontSize: 12,
        marginTop: 15,
    },
    discount: {
        marginTop: 45,
    },
    cgst: {
        marginTop: 15,
    },
    total: {
        marginTop: 15,
        backgroundColor: "#5A51BE",
        color: "white",
        padding: 5,
    },
    digit: {
        marginLeft: 50,
    },
    logo: {
        // width: "80%",
        // marginRight: "38%",
        position: "absolute",
        width: "30%",
        top: 60,
        // left: "5%",
    },
    email: {
        marginTop: 7,
        fontSize: 13,
        color: "blue",
        textDecoration: "underline",
    },
    contact:{
        marginTop: "2.3%",
        fontSize: 13,
    },
    top: {
        marginBottom: 10,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-around",
    },
    title: {
        //landscape
        fontSize: 16,
        // fontSize: 10,
        marginBottom: 2,
        marginTop: 2,
    },
    txt2: {
        //landscape
       marginTop: 7,
        fontSize: 13,
        // fontSize: 8,
    },
    billTo: {
        display: "flex",
        flexDirection: "column",
        fontSize: 12,
        marginTop: 30,
        marginRight: '15%',
        marginLeft: '2%',
    },
    billToCubexo: {
        display: "flex",
        flexDirection: "column",
        fontSize: 12,
        marginTop: 50,
        marginRight: '20%',
        marginLeft: '5%',

    },
    address: {
        marginTop: 7,
        fontSize: 13,
        width: "57%",
    },
    gst: {
        fontSize: 9,
        marginTop: 5,
    },
    footer: {
        fontSize: 13,
        padding: 2,
        marginTop: 45,
        textAlign: "center",
        fontStyle: "italic",
    }
});