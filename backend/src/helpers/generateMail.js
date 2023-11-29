import { createTransport } from "nodemailer";

const transporter = createTransport({
    service: "gmail",
    port: 465,
    secure: true,
    host: 'smtp.gmail.com',
    auth: {
        user: "aakanshamahajan2000@gmail.com",
        pass: 'zuks ulki hqxa ghpt'
    }
})


const sendMail = async (options) => {
    transporter.sendMail({
        from: process.env.admin,
        to: options.user,
        subject: options.subject,
        html: `<h2>${options.message.title}</h2>
        <p>${options.message.description}</p>
        `,
    }, function (error, info) {
        if (error) {
            console.log(error)
            return false
        }
        else return true
    })
}

export default sendMail