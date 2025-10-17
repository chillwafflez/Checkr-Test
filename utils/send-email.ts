import Mailgun from "mailgun.js";

const sendEmail = async (
  to: string | string[],
  subject: string,
  html: string
) => {
  const mailgun = new Mailgun(FormData);
  const mg = mailgun.client({
    username: "api",
    key: process.env.MAILGUN_KEY!,
  });

  const from = `Scroll.care <${process.env.EMAIL_NOREPLY!}>`;

  await mg.messages.create(process.env.MAILGUN_DOMAIN!, {
    from,
    "h:sender": from,
    to,
    subject: `${process.env.EMAIL_PREFIX!}${subject}`,
    html: `
      <html>
        <head>
          <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <meta http-equiv="X-UA-Compatible" content="IE=edge">
          <meta name="format-detection" content="telephone=no">
          <style>
            body {
              background-color: #dfe9f4;
              margin: 0;
              padding: 10px;
            }

            .header,
            .title,
            .subtitle,
            .footer-text {
              font-family: Helvetica, Arial, sans-serif;
            }

            .container-padding {
              padding-left: 24px;
              padding-right: 24px;
            }

            .header {
              font-size: 21px;
              font-weight: normal;
              font-style: normal;
              text-transform: uppercase;
              color: #595959;
              background: #ffffff;
              font-family: Trebuchet, sans-serif;
              text-align: center !important;
              padding: 50px 0px 31px 0px;
              line-height: 1.2;
              text-decoration: none;
            }

            .header a {
              font-size: 21px;
              font-weight: normal;
              font-style: normal;
              text-transform: uppercase;
              color: #595959;
              font-family: Trebuchet, sans-serif;
              text-decoration: none;
            }

            .header-image {
              height: auto;
              vertical-align: top;
              border: none;
            }

            .full-width-header-image {
              width: 100%;
              display: block;
            }

            .footer-text,
            .footer-text th,
            .footer-text td,
            .footer-text li {
              font-size: 12px;
              line-height: 16px;
              color: #aaaaaa;
              background: #ffffff;
            }

            .footer-text a,
            .footer-text th a,
            .footer-text td a,
            .footer-text li a {
              color: #aaaaaa;
            }

            .container {
              width: 600px;
              max-width: 600px;
            }

            .content {
              padding-top: 12px;
              padding-bottom: 12px;
              background-color: #f8fbff;
            }

            code {
              background-color: #eee;
              padding: 0 4px;
              font-family: Courier, monospace;
              font-size: 12px;
            }

            hr {
              border: 0;
              border-bottom: 1px solid #cccccc;
            }

            .hr {
              height: 1px;
              border-bottom: 1px solid #cccccc;
            }

            h1 {
              font-size: 25px;
              font-weight: bold;
              font-style: normal;
              text-transform: none;
              color: #1c3954;
              font-family: Georgia, Times New Roman, serif;
              text-align: center;
            }

            h2,
            h3,
            h4 {
              font-size: 20px;
              font-weight: normal;
              font-style: normal;
              text-transform: none;
              color: #1c3954;
              font-family: Georgia, Times New Roman, serif;
              text-align: left;
            }

            .subtitle {
              font-size: 16px;
              font-weight: 600;
              color: #2469A0;
            }

            .subtitle span {
              font-weight: 400;
              color: #999999;
            }

            .body-text,
            .body-text td,
            .body-text th,
            .body-text li {
              font-family: Verdana, sans-serif;
              font-size: 15px;
              color: #1c3954;
              font-weight: normal;
              font-style: normal;
              line-height: 1.5;
            }

            .body-text,
            .body-text td,
            .body-text th {
              text-align: left;
            }

            a {
              color: #f77c54;
              font-weight: normal;
              font-style: normal;
              text-transform: none;
              text-decoration: underline;
            }

            .body-text .content-twocol td,
            .body-text .content-twocol h1,
            .body-text .content-twocol h2,
            .body-text .content-twocol h3,
            .body-text .content-twocol h4 {
              text-align: left;
              vertical-align: top;
            }

            body {
              margin: 0;
              padding: 0;
              -ms-text-size-adjust: 100%;
              -webkit-text-size-adjust: 100%;
            }

            table {
              border-spacing: 0;
            }

            table td {
              border-collapse: collapse;
            }

            .ExternalClass {
              width: 100%;
            }

            .ExternalClass,
            .ExternalClass p,
            .ExternalClass span,
            .ExternalClass font,
            .ExternalClass td,
            .ExternalClass div {
              line-height: 100%;
            }

            .ReadMsgBody {
              width: 100%;
              background-color: #dfe9f4;
            }

            table {
              mso-table-lspace: 0pt;
              mso-table-rspace: 0pt;
            }

            img {
              -ms-interpolation-mode: bicubic;
            }

            .yshortcuts a {
              border-bottom: none !important;
            }

            /**** ADD CSS HERE ****/
            @media screen and (max-width: 599px) {

              table[class="force-row"],
              table[class="container"] {
                width: 100% !important;
                max-width: 100% !important;
              }
            }

            @media screen and (max-width: 400px) {
              td[class*="container-padding"] {
                padding-left: 12px !important;
                padding-right: 12px !important;
              }

              .header-image {
                max-width: 100% !important;
                height: auto !important;
              }

              table[class*="content-twocol"] {
                float: none;
                width: 100%;
              }

              table[class*="content-twocol"],
              table[class*="content-twocol"] p,
              table[class*="content-twocol"] h1,
              table[class*="content-twocol"] h2,
              table[class*="content-twocol"] h3,
              table[class*="content-twocol"] h4 {
                text-align: left !important;
              }
            }

            @media screen and (max-width: 400px) {}

            /**** ADD MOBILE CSS HERE ****/
            .ios-footer a {
              color: #aaaaaa !important;
              text-decoration: underline;
            }
          </style>
        </head>
        <body style="background-color:#dfe9f4;margin:0;padding:0">

          <div>
            <table border="0" width="100%" height="100%" cellpadding="0" cellspacing="0" class="plugin-gravityforms" style="border-spacing:0">
              <tbody>
                <tr>
                  <td align="center" valign="top" style="border-collapse:collapse">
                    <br>
                    <table id="holder" class="container" border="0" cellspacing="0" cellpadding="0" style="border-spacing:0;width:100%;max-width:600px!important" align="center">
                      <tbody>
                        <tr>
                          <td align="center" style="border-collapse:collapse">
                            <table width="100%" border="0" cellspacing="0" cellpadding="0" style="border-spacing:0">
                              <tbody>
                                <tr>
                                  <td style="border-collapse:collapse">
                                    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="border-spacing:0">
                                      <tbody>
                                        <tr>
                                          <td class="container-padding header" align="center" style="border-collapse:collapse;padding-left:24px;padding-right:24px;background:#ffffff;color:#595959;font-family:Trebuchet,sans-serif;font-size:21px;font-style:normal;font-weight:normal;line-height:1.2;padding:50px 0px 31px 0px;text-align:center!important;text-decoration:none;text-transform:uppercase">
                                            <table width="100%" cellpadding="0" cellspacing="0" style="border-spacing:0">
                                              <tbody>
                                                <tr>
                                                  <td class="header-image" align="center" style="border-collapse:collapse;border:none;height:auto;vertical-align:top;text-align:center">
                                                    <a href="https://scroll.care" style="color:#595959;font-family:Trebuchet,sans-serif;font-size:21px;font-style:normal;font-weight:normal;text-decoration:none;text-transform:uppercase">
                                                      <img class="header-image" src="https://scroll.care/wp-content/uploads/2024/04/Email-Header.png" style="-ms-interpolation-mode: bicubic; border: none; vertical-align: top; width: 350px; height: 63px;" width="350" height="63" alt="Scroll.care">
                                                    </a>
                                                  </td>
                                                </tr>
                                              </tbody>
                                            </table>
                                          </td>
                                        </tr>
                                      </tbody>
                                    </table>
                                    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="border-spacing:0">
                                      <tbody>
                                        <tr>
                                          <td class="content" align="" style="border-collapse:collapse;background-color:#f8fbff;padding-bottom:12px;padding-top:12px">
                                            <div class="body-text" style="color:#1c3954;font-family:Verdana,sans-serif;font-size:15px;font-style:normal;font-weight:normal;line-height:1.5;text-align:left">
                                              <table width="100%" border="0" cellpadding="0" cellspacing="0" id="" style="border-spacing:0">
                                                <tbody>
                                                  <tr>
                                                    <td class="container-padding" style="border-collapse:collapse;padding-left:24px;padding-right:24px;color:#1c3954;font-family:Verdana,sans-serif;font-size:15px;font-style:normal;font-weight:normal;line-height:1.5;text-align:left">
                                                      ${html}
                                                    </td>
                                                  </tr>
                                                </tbody>
                                              </table>
                                            </div>
                                          </td>
                                        </tr>
                                      </tbody>
                                    </table>
                                    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="border-spacing:0">
                                      <tbody>
                                        <tr>
                                          <td class="container-padding footer-text" align="left" style="border-collapse:collapse;font-family:Helvetica,Arial,sans-serif;padding-left:24px;padding-right:24px;background:#ffffff;color:#aaaaaa;font-size:12px;line-height:16px"> &nbsp; <p style="text-align:center">
                                              <span style="color:#1c3954;font-family:Verdana,Geneva">
                                                <strong>© 2025 Scroll.care</strong>
                                              </span>
                                            </p>
                                            <br>
                                          </td>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </body>
      </html>
    `,
  });
};

export default sendEmail;
