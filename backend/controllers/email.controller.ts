// import type { Request, Response } from 'express'
// import nodemailer from 'nodemailer'

// export const sendContactMessageToEmail = async (req: Request, res: Response) => {
//     try {
//         const { email, name, message } = req.body;

//         if (!email || !name || !message) {
//             return res.status(400).json({success: false, message: "Provide all input fields."})
//         }

//         // TODO: Integrate OAuth2.0 into logins
//         const transporter = nodemailer.createTransport({
//             service: "gmail",
//             host: "localhost",
//             port: 587,
//             secure: false,
//         }) 
//         const info = await transporter.sendMail({
//             from: `"${name}" <${email}>`,
//             to: "sirivongjonathan@gmail.com",
//             subject: "Contact",
//             text: message,
//             html: "<h2>Thank You</h2>"
//         })

//         console.log(info.messageId)
//     } catch (err){
//         console.log("Error sending contact message to email.", err);
//         res.status(500).json({success: false, message: "Error sending contact message to email"});
//     }
// }