import { CheckCircleOutlined } from "@ant-design/icons";
import { Card } from "antd";

function StepIndicator({ currentStep, setCurrentStep }) {
  return (
    <div>
      <Card size="small" className="shadow-lg bg-white">
        <div className="flex justify-between items-center">
          {[1, 2, 3, 4].map((step) => (
            <div
              key={step}
              className={`flex flex-col items-center cursor-pointer transition-all duration-300 ${
                currentStep === step ? "scale-110" : "opacity-80 hover:opacity-100"
              }`}
              onClick={() => setCurrentStep(step)}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shadow-md transition-all duration-300 ${
                  currentStep === step
                    ? "bg-blue-600 text-white ring-4 ring-blue-200"
                    : currentStep > step
                    ? "bg-green-500 text-white"
                    : "bg-gray-100 text-gray-700 border-2 border-gray-300"
                }`}
              >
                {currentStep > step ? <CheckCircleOutlined /> : step}
              </div>
              <span
                className={`text-xs mt-2 font-medium transition-all duration-300 ${
                  currentStep === step
                    ? "text-gray-900 font-semibold"
                    : "text-gray-600"
                }`}
              >
                {step === 1 && "Shape"}
                {step === 2 && "Holes"}
                {step === 3 && "Material"}
                {step === 4 && "Review"}
              </span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

export default StepIndicator;
