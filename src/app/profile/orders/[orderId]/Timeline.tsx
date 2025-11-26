import { OrderStatus } from "./types";
import { Check } from "lucide-react";

const steps: OrderStatus[] = ["PENDING", "DELIVERED"];

export const Timeline = ({
  status,
  createdAt,
}: {
  status: OrderStatus;
  createdAt: string;
}) => {
  return (
    <div className="bg-[#111] p-5 rounded-xl border border-gray-800 mb-6">
      <p className="text-gray-400 text-sm mb-4">
        📅 {new Date(createdAt).toLocaleString()}
      </p>

      <div className="flex flex-col gap-3">
        {steps.map((step) => {
          const done = steps.indexOf(step) <= steps.indexOf(status);
          return (
            <div
              key={step}
              className={`flex items-center gap-3 ${
                done ? "text-[#facc15]" : "text-gray-600"
              }`}
            >
              <Check
                className={`w-5 h-5 ${
                  done ? "text-[#facc15]" : "text-gray-600"
                }`}
              />
              <span>
                {step === "PENDING" && "Захиалга хүлээгдэж байна"}
                {step === "DELIVERED" && "Хүргэгдсэн"}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
