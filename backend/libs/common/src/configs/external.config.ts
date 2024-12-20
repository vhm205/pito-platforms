import { registerAs } from '@nestjs/config';
import { IsString } from 'class-validator';

import { validateConfig } from './validate-config';

export type ExternalConfig = {
  sendgrid: {
    apiKey: string;
    orderCreateTemplateId: string;
    partnerApprovedTemplateId: string;
    partnerCancelTemplateId: string;
    orderInvoiceTemplateId: string;
    customerCancelTemplateId: string;
    orderCompletedTemplateId: string;
    paymentFailedTemplateId: string;
    payNotCompletedTemplateId: string;
    refundCompletedTemplateId: string;
    vnpayRefundCompletedTemplateId: string;
    orderDeliveryFailedTemplateId: string;
    orderDeliveringTemplateId: string;
  };
  sentry: {
    dsn: string;
  };
  supabase: {
    url: string;
    anonKey: string;
    serviceRoleKey: string;
    jwtSecret: string;
  };
  ahamove: {
    apiKey: string;
    serviceId: string;
    systemToken: string;
    orderEventsApiKey: string;
  };
};

class ExternalVariablesValidator {
  @IsString()
  SENDGRID_API_KEY: string;

  @IsString()
  SENDGRID_ORDER_CREATE_TEMPLATE_ID: string;

  @IsString()
  SENDGRID_PARTNER_APPROVED_TEMPLATE_ID: string;

  @IsString()
  SENDGRID_PARTNER_CANCEL_TEMPLATE_ID: string;

  @IsString()
  SENDGRID_MAIL_INVOICE_TEMPLATE_ID: string;

  @IsString()
  SENDGRID_CUSTOMER_CANCEL_TEMPLATE_ID: string;

  @IsString()
  SENDGRID_ORDER_COMPLETED_TEMPLATE_ID: string;

  @IsString()
  SENDGRID_PAYMENT_FAILED_TEMPLATE_ID: string;

  @IsString()
  SENDGRID_PAY_NOT_COMPLETED_TEMPLATE_ID: string;

  @IsString()
  SENDGRID_REFUND_COMPLETED_TEMPLATE_ID: string;

  @IsString()
  SENDGRID_VNPAY_REFUND_COMPLETED_TEMPLATE_ID: string;

  @IsString()
  SENDGRID_ORDER_DELIVERY_FAILED_TEMPLATE_ID: string;

  @IsString()
  SENDGRID_ORDER_DELIVERING_TEMPLATE_ID: string;

  @IsString()
  SENTRY_DSN: string;

  @IsString()
  SUPABASE_URL: string;

  @IsString()
  SUPABASE_ANON_KEY: string;

  @IsString()
  SUPABASE_SERVICE_ROLE_KEY: string;

  @IsString()
  SUPABASE_JWT_SECRET: string;

  @IsString()
  AHAMOVE_API_KEY: string;

  @IsString()
  AHAMOVE_SERVICE_ID: string;

  @IsString()
  AHAMOVE_SYSTEM_TOKEN: string;

  @IsString()
  AHAMOVE_ORDER_EVENTS_API_KEY: string;

  @IsString()
  KEYCLOAK_BASE_URL: string;

  @IsString()
  KEYCLOAK_REALM: string;

  @IsString()
  KEYCLOAK_ADMIN_CLIENT_ID: string;

  @IsString()
  KEYCLOAK_ADMIN_CLIENT_SECRET: string;

  @IsString()
  KEYCLOAK_ADMIN_USERNAME: string;

  @IsString()
  KEYCLOAK_ADMIN_PASSWORD: string;

  @IsString()
  KEYCLOAK_APPLICATION_CLIENT_ID: string;

  @IsString()
  KEYCLOAK_DB_HOST: string;

  @IsString()
  KEYCLOAK_DB_PORT: string;

  @IsString()
  KEYCLOAK_DB_USER: string;

  @IsString()
  KEYCLOAK_DB_PASSWORD: string;

  @IsString()
  KEYCLOAK_DB_NAME: string;

  @IsString()
  KEYCLOAK_DEFAULT_REALM_ROLE_ID: string;

  @IsString()
  KEYCLOAK_CUSTOMER_ROLE_ID: string;

  @IsString()
  KEYCLOAK_PARTNER_ROLE_ID: string;

  @IsString()
  KEYCLOAK_REALM_ID: string;

  @IsString()
  SLACK_WEBHOOK_URL: string;
}

// eslint-disable-next-line import/no-default-export
export default registerAs<ExternalConfig>('external', () => {
  validateConfig(process.env, ExternalVariablesValidator);

  return {
    sendgrid: {
      apiKey: process.env.SENDGRID_API_KEY!,
      orderCreateTemplateId: process.env.SENDGRID_ORDER_CREATE_TEMPLATE_ID!,
      partnerApprovedTemplateId: process.env.SENDGRID_PARTNER_APPROVED_TEMPLATE_ID!,
      partnerCancelTemplateId: process.env.SENDGRID_PARTNER_CANCEL_TEMPLATE_ID!,
      orderInvoiceTemplateId: process.env.SENDGRID_MAIL_INVOICE_TEMPLATE_ID!,
      customerCancelTemplateId: process.env.SENDGRID_CUSTOMER_CANCEL_TEMPLATE_ID!,
      orderCompletedTemplateId: process.env.SENDGRID_ORDER_COMPLETED_TEMPLATE_ID!,
      paymentFailedTemplateId: process.env.SENDGRID_PAYMENT_FAILED_TEMPLATE_ID!,
      payNotCompletedTemplateId: process.env.SENDGRID_PAY_NOT_COMPLETED_TEMPLATE_ID!,
      refundCompletedTemplateId: process.env.SENDGRID_REFUND_COMPLETED_TEMPLATE_ID!,
      vnpayRefundCompletedTemplateId: process.env.SENDGRID_VNPAY_REFUND_COMPLETED_TEMPLATE_ID!,
      orderDeliveryFailedTemplateId: process.env.SENDGRID_ORDER_DELIVERY_FAILED_TEMPLATE_ID!,
      orderDeliveringTemplateId: process.env.SENDGRID_ORDER_DELIVERING_TEMPLATE_ID!,
    },
    sentry: {
      dsn: process.env.SENTRY_DSN!,
    },
    supabase: {
      url: process.env.SUPABASE_URL!,
      anonKey: process.env.SUPABASE_ANON_KEY!,
      serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY!,
      jwtSecret: process.env.SUPABASE_JWT_SECRET!,
    },
    ahamove: {
      apiKey: process.env.AHAMOVE_API_KEY!,
      serviceId: process.env.AHAMOVE_SERVICE_ID!,
      systemToken: process.env.AHAMOVE_SYSTEM_TOKEN!,
      orderEventsApiKey: process.env.AHAMOVE_ORDER_EVENTS_API_KEY!,
    },
    slack: {
      webhookUrl: process.env.SLACK_WEBHOOK_URL!,
    },
  };
});
