"use client";
import { Modal, Button, Divider, Tag, Alert, Space } from "antd";
import {
  CheckCircleOutlined,
  WarningOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";

function OrderConfirmation({
  showValidationModal,
  setShowValidationModal,
  totalArea,
  totalPerimeter,
  drillingHoles,
  selectedMaterial,
  selectedThickness,
  selectedColor,
  selectedFinish,
  materialList,
  handleSubmitOrder,
  validationErrors,
}) {
  // Get material and thickness data
  const materialData = materialList?.find((m) => m.id === selectedMaterial);
  const thicknessData = materialData?.variants?.find(
    (v) => v.id === selectedThickness,
  );

  // Calculate estimated price
  const basePrice = parseFloat(thicknessData?.price || 0);
  const estimatedPrice = Math.max(basePrice * totalArea, 100);

  const hasErrors = validationErrors && validationErrors.length > 0;

  return (
    <Modal
      title={
        <div className="flex items-center gap-2">
          {hasErrors ? (
            <>
              <WarningOutlined className="text-red-500" />
              <span>Order Validation Failed</span>
            </>
          ) : (
            <>
              <CheckCircleOutlined className="text-green-500" />
              <span>Review Your Order</span>
            </>
          )}
        </div>
      }
      open={showValidationModal}
      onCancel={() => setShowValidationModal(false)}
      width={600}
      footer={[
        <Button key="cancel" onClick={() => setShowValidationModal(false)}>
          Cancel
        </Button>,
        <Button
          key="submit"
          type="primary"
          onClick={handleSubmitOrder}
          disabled={hasErrors}
        >
          {hasErrors ? "Fix Errors First" : "Confirm Order"}
        </Button>,
      ]}
    >
      <Space orientation="vertical" className="w-full" size="middle">
        {/* Validation Errors */}
        {hasErrors && (
          <Alert
            type="error"
            message="Please fix the following errors:"
            description={
              <ul className="list-disc ml-4 mt-2">
                {validationErrors.map((error, idx) => (
                  <li key={idx}>{error}</li>
                ))}
              </ul>
            }
            showIcon
            icon={<CloseCircleOutlined />}
          />
        )}

        {!hasErrors && (
          <>
            {/* Order Summary */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-sm font-medium text-blue-700 mb-3">
                Order Summary
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Area:</span>
                  <span className="font-medium">
                    {totalArea.toFixed(2)} sq m
                  </span>
                </div>
                {/* <div className="flex justify-between">
                  <span className="text-gray-600">Total Perimeter:</span>
                  <span className="font-medium">
                    {totalPerimeter.toFixed(2)} ft
                  </span>
                </div> */}
                <div className="flex justify-between">
                  <span className="text-gray-600">Drilling Holes:</span>
                  <span className="font-medium">{drillingHoles.length}</span>
                </div>
              </div>
            </div>

            <Divider style={{ margin: "12px 0" }} />

            {/* Material Selection */}
            <div>
              <div className="text-sm font-medium mb-2">Material Selection</div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-gray-600">Material:</span>
                  <Tag color="blue">{materialData?.name || "Not selected"}</Tag>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-600">Thickness:</span>
                  <Tag color="green">
                    {thicknessData?.name || "Not selected"}
                  </Tag>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-600">Color:</span>
                  <Tag color="purple">{selectedColor || "Not selected"}</Tag>
                </div>
                {selectedFinish && (
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600">Finish:</span>
                    <Tag color="orange">{selectedFinish}</Tag>
                  </div>
                )}
              </div>
            </div>

            <Divider style={{ margin: "12px 0" }} />

            {/* Estimated Price */}
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-4 rounded-lg text-white">
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-sm opacity-90">Estimated Total</div>
                  <div className="text-xs opacity-75">(VAT not included)</div>
                </div>
                <div className="text-3xl font-bold">
                  €{estimatedPrice.toFixed(2)}
                </div>
              </div>
            </div>

            {/* Important Notes */}
            <Alert
              type="info"
              message="Important Notes"
              description={
                <ul className="list-disc ml-4 text-xs">
                  <li>This is an estimated price</li>
                  <li>Final price will be confirmed after review</li>
                  <li>Production time: 3-4 weeks</li>
                  <li>All measurements are in feet unless specified</li>
                </ul>
              }
              showIcon
            />
          </>
        )}
      </Space>
    </Modal>
  );
}

export default OrderConfirmation;
