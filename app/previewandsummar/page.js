'use client'
import React, { useState, useEffect } from "react";

export default function page() {
    const [svgCode, setSvgCode] = useState(null);
    const [dimensions, setDimensions] = useState(null);

    useEffect(() => {
        // 1. Retrieve the data from Local Storage
        const storedSvg = localStorage.getItem('customShapeSvg');
        const storedDimensions = localStorage.getItem('customShapeDimensions');

        if (storedSvg) {
            setSvgCode(storedSvg);
        }
        if (storedDimensions) {
            setDimensions(JSON.parse(storedDimensions));
        }
    }, []);

    return (
        <div className="p-8">
            <h2>🛒 Checkout Page - Review Your Custom Shape</h2>

            {svgCode ? (
                <div className="mt-6 p-4 border rounded-lg bg-white shadow-md">
                    <h3 className="text-xl font-semibold mb-3">Custom Item Preview:</h3>
                    <div className="flex">
                        {/* =====svg code preview==== */}
                        <div
                            dangerouslySetInnerHTML={{ __html: svgCode }}
                            className="w-full h-auto flex justify-center"
                        ></div>
                        {/* ====details==== */}
                        <div>

                            {dimensions && (
                                <div className="mt-4 text-sm text-gray-700">
                                    <p>Dimensions: {dimensions.width.toFixed(0)} x {dimensions.height.toFixed(0)} px</p>
                                    <p>Top Radius: {dimensions.radius.toFixed(0)} px</p>
                                </div>
                            )}

                            <h3 className="text-lg font-semibold mt-6">Order Submission:</h3>
                            <p className="text-sm text-gray-500">
                                The SVG code is ready to be sent to your server when you submit the order.
                            </p>


                            <form /* action="/api/submit-order" */ method="POST" className="mt-4">
                                {/* The SVG code is too long for a GET request, use a POST request */}
                                <input
                                    type="hidden"
                                    name="custom_svg_data"
                                    value={svgCode || ''} // Pass the SVG string
                                />
                                {/* Include other checkout fields (address, payment, etc.) */}
                                <button
                                    type="submit"
                                    className="mt-4 p-3 bg-green-600 text-white rounded w-full hover:bg-green-700"
                                >
                                    Confirm Order
                                </button>
                            </form>
                        </div>
                    </div>


                </div>
            ) : (
                <p className="mt-6 text-red-500">No custom shape data found. Please go back and save your shape.</p>
            )}
        </div>
    );
}