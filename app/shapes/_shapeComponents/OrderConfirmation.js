import { Alert, message, Modal } from "antd";
import React from "react";

function OrderConfirmation({
  showValidationModal,
  setShowValidationModal,
  totalArea,
  totalPerimeter,
  drillingHoles,
  selectedMaterial,
  selectedThickness,
  selectedColor,
}) {
  return (
    <div>
      <Modal
        title="✅ Order Confirmation 3"
        open={showValidationModal}
        onOk={() => {
          message.success("Order submitted successfully!");
          setShowValidationModal(false);
        }}
        onCancel={() => setShowValidationModal(false)}
        okText="Confirm Order"
        cancelText="Go Back"
        width={600}
      >
        <div className="space-y-4">
          <Alert
            type="success"
            title="All validations passed!"
            description="Your order is ready to be submitted."
            showIcon
          />

          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-bold mb-2">Order Summary:</h4>
            <ul className="space-y-1 text-sm">
              <li>📐 Shape Area: {totalArea.toFixed(2)} sq ft</li>
              <li>📏 Perimeter: {totalPerimeter.toFixed(2)} ft</li>
              <li>🕳️ Drilling Holes: {drillingHoles.length}</li>
              <li>🎨 Material: {selectedMaterial || "Not selected"}</li>
              <li>📊 Thickness: {selectedThickness || "Not selected"}</li>
              <li>🌈 Color: {selectedColor || "Not selected"}</li>
            </ul>
          </div>

          <Alert
            type="info"
            title="Production Time: 3-4 weeks"
            description="Final pricing may change after review."
            showIcon
          />
        </div>
      </Modal>
    </div>
  );
}

export default OrderConfirmation;
