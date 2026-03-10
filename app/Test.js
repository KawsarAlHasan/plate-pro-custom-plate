"use client";

import { Tour, Button } from "antd";
import { useState, useRef } from "react";

export default function Guide() {
  const [open, setOpen] = useState(true);

  const ref1 = useRef(null);
  const ref2 = useRef(null);

  const steps = [
    {
      title: "Profile Section",
      description: "এখানে আপনার প্রোফাইল দেখতে পারবেন",
      target: () => ref1.current,
    },
    {
      title: "Dashboard",
      description: "এখানে আপনার ডাটা দেখতে পারবেন",
      target: () => ref2.current,
    },
  ];

  return (
    <div className="p-10">
      <Button ref={ref1}>Profile</Button>
      <Button ref={ref2} className="ml-4">
        Dashboard
      </Button>

      <Tour open={open} onClose={() => setOpen(false)} steps={steps} />
    </div>
  );
}