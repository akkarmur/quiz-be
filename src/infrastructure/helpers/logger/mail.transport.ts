// import os from 'os' // Import the Node.js os module for system information
// import TransportStream from 'winston-transport'

// import { env } from '../../env'
// import transporter from '../mailer'

// interface MailTransportOptions {
//   level?: string
// }

// export class MailTransport extends TransportStream {
//   constructor(opts?: TransportStream.TransportStreamOptions) {
//     super(opts)
//     this.level = opts?.level || 'error'
//   }

//   public log(info: any, next: () => void) {
//     if (info.level === this.level && env.ERROR_LOG_RECEIVER_EMAIL) {
//       transporter.sendMail({
//         from: env.SMTP_EMAIL,
//         to: env.ERROR_LOG_RECEIVER_EMAIL,
//         subject: 'Quiz Server Error Log - nodejs',
//         html: this.generateHtmlContent(info),
//         priority: 'high',
//         attachments: [],
//       })
//     }
//     next()
//   }

//   private generateHtmlContent(info: any) {
//     return `
//       <!DOCTYPE html>
//       <html lang="en">
//       <head>
//         <meta charset="UTF-8">
//         <meta name="viewport" content="width=device-width, initial-scale=1.0">
//         <style>
//           body {
//             font-family: Arial, sans-serif;
//             line-height: 1.6;
//             color: #333;
//           }
//           h2 {
//             color: #d9534f;
//           }
//           p {
//             margin: 0 0 10px;
//           }
//           strong {
//             color: #5bc0de;
//           }
//           pre {
//             background: #f8f9fa;
//             padding: 10px;
//             border: 1px solid #dee2e6;
//             border-radius: 4px;
//             white-space: pre-wrap;
//             word-wrap: break-word;
//           }
//           ul {
//             list-style-type: none;
//             padding: 0;
//           }
//           li {
//             margin: 5px 0;
//           }
//         </style>
//       </head>
//       <body>
//         <h2>Error Log</h2>
//         <p><strong>Timestamp:</strong> ${info.timestamp}</p>
//         <p><strong>Level:</strong> ${info.level}</p>
//         <p><strong>Message:</strong> ${info.message}</p>
//         <p><strong>Error Details:</strong></p>
//         <pre>${JSON.stringify(info, null, 2)}</pre>
//         <h3>Additional System Information:</h3>
//         <ul>
//           <li><strong>Hostname:</strong> ${os.hostname()}</li>
//           <li><strong>OS Type:</strong> ${os.type()}</li>
//           <li><strong>OS Platform:</strong> ${os.platform()}</li>
//           <li><strong>Total Memory:</strong> ${Math.round(os.totalmem() / 1024 / 1024)} MB</li>
//           <li><strong>Free Memory:</strong> ${Math.round(os.freemem() / 1024 / 1024)} MB</li>
//         </ul>
//       </body>
//       </html>
//     `
//   }
// }
