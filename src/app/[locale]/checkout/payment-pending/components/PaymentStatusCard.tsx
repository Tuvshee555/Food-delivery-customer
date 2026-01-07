"use client";

import { QRCodeCanvas } from "qrcode.react";
import { motion } from "framer-motion";

export function PaymentStatusCard({
  t,
  qrText,
  paid,
  status,
}: {
  t: (k: string) => string;
  qrText?: string | null;
  paid?: boolean;
  status?: string | null;
}) {
  const Spinner = () => (
    <motion.div
      aria-hidden
      className="w-10 h-10 rounded-full border-4 border-muted border-t-primary"
      animate={{ rotate: 360 }}
      transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
    />
  );

  return (
    <section className="bg-card rounded-2xl p-6 flex flex-col items-center gap-6 shadow-sm">
      {!paid ? (
        !qrText ? (
          <>
            <Spinner />
            <p className="text-sm text-muted-foreground">
              {t("generating_qr")}
            </p>
          </>
        ) : (
          <>
            <div className="bg-white p-4 rounded-lg shadow-inner">
              <QRCodeCanvas value={qrText} size={220} />
            </div>

            <p className="text-sm font-medium text-muted-foreground">QPay</p>

            <a
              href={`https://qpay.mn/q?q=${encodeURIComponent(qrText)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-11 items-center justify-center px-6 rounded-md bg-primary text-primary-foreground text-sm font-medium shadow-md"
            >
              {t("pay_with_qpay")}
            </a>

            {status && (
              <p className="text-xs text-muted-foreground">{status}</p>
            )}
          </>
        )
      ) : (
        <motion.div
          initial={{ scale: 0.96, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="flex flex-col items-center gap-3"
        >
          <div className="rounded-full border p-4 text-lg">✓</div>
          <p className="font-semibold">{t("payment_success")}</p>
        </motion.div>
      )}
    </section>
  );
}
