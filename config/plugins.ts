export default ({ env }) => ({
    email: {
    config: {
      provider: 'nodemailer',
      providerOptions: {
        host: env('SMTP_HOST', 'smtp.gmail.com'),
        port: env.int('SMTP_PORT', 587),
        secure: false, // true si usas 465
        auth: {
          user: env('SMTP_USER'),
          pass: env('SMTP_PASS'),
        },
      },
      settings: {
        defaultFrom: '482200606@alumnos.utzac.edu.mx',
        defaultReplyTo: '482200606@alumnos.utzac.edu.mx',
      },
    },
  },

});
