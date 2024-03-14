import { PDFDocument, StandardFonts } from "pdf-lib";
import nodemailer from "nodemailer";
import fs from "fs";
import { MongoClient } from "mongodb";

export async function GET(req: Request) {
  try {
    const client = await MongoClient.connect(
      process.env.NEXT_PUBLIC_MONGO_URI!
    );
    const db = client.db("seelect_main");
    // Get all users from the MongoDB collection
    const users = await db.collection("users").find().limit(1).toArray();
    for (const user of users) {
      try {
        // Get all users from the MongoDB collection
        const msg_lines = [
          "Participou da Semana de Engenharia Elétrica, de",
          "Computação e de Telecomunicações da Universidade",
          "Federal do Ceará no período de 6 a 10 novembro ",
        ];
        const pdfPath =
          "/Users/Meu PC/Desktop/seelect-site/seelect_presence/public/pdf/certificado.pdf";
        const pdfData = fs.readFileSync(pdfPath);
        const pdfDocument = await PDFDocument.load(pdfData);

        const helveticaFont = await pdfDocument.embedFont(
          StandardFonts.Helvetica
        );
        const pages = pdfDocument.getPages();
        const firstPage = pages[0];
        const { width, height } = firstPage.getSize();

        const fontSize = 26;
        const msg_fontSize = 18;

        const pdfDoc = pdfDocument;
        const textWidth = helveticaFont.widthOfTextAtSize(user.name, fontSize);
        const textX = width / 2 - textWidth / 2;
        var hours = 0;
        //@ts-ignore
        user.events.forEach((event) => {
          //@ts-ignore
          event.days.forEach((day, i) => {
            if (day) {
              hours += event.hours_per_day[i] / 60;
            }
          });
        });
        msg_lines.push(`de 2023 totalizando ${hours + 2} horas`);

        firstPage.drawText(user.name, {
          x: textX,
          y: height * 0.54,
          size: fontSize,
          font: helveticaFont,
        });

        for (var i = 0; i < msg_lines.length; i++) {
          const msg = msg_lines[i];
          const textWidth = helveticaFont.widthOfTextAtSize(msg, msg_fontSize);
          const textX = width / 2 - textWidth / 2;
          firstPage.drawText(msg, {
            x: textX,
            y: height * 0.45 - i * msg_fontSize * 1.3,
            size: msg_fontSize,
            font: helveticaFont,
          });
        }
        const pdfBytes = await pdfDoc.save();

        // Attach the PDF file to the email
        const attachment = {
          filename: "certificado_seelect.pdf",
          content: Buffer.from(pdfBytes),
        };

        // Add the attachment to the email options
        // Create a transporter using SMTP transport

        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_PASS,
          },
        });

        // Define the email options
        const mailOptions = {
          from: process.env.GMAIL_USER,
          to: user.email,
          subject: "certificado",
          text: `Olá ${user.name},
          
          Parabéns por participar da Semana de Engenharia Elétrica, de Computação e de Telecomunicações da Universidade Federal do Ceará!
          É com grande satisfação que reconhecemos seu empenho e participação nesse evento. Esperamos que tenha sido uma experiência enriquecedora para você.Anexamos o seu certificado de participação.
           Esperamos vê-lo novamente em eventos futuros!
          
          Atenciosamente,
          Equipe SEELECT`,
          attachments: [attachment],
        };
        try {
          // Send the email
          await transporter.sendMail(mailOptions);
        } catch (error) {
          console.error("Error sending email:", error);
        }
      } catch (error) {
        console.error("Error sending email:", error);
      }
    }
    return Response.json({ message: "Email sent" });
  } catch (error) {
    console.error("Error sending email:", error);
  }
}
