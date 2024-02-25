"use client";
import axios from "axios";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/format";

interface CourseEnrollButtonProps {
  coursesId: string;
  price: number;
}

const CourseEnrollButton: React.FC<CourseEnrollButtonProps> = ({
  coursesId,
  price,
}) => {
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    try {
      setLoading(true);
      const res = await axios.post(`/api/courses/${coursesId}/checkout`);
      window.location.assign(res.data.url);
    } catch (error) {
      toast.error("something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button size="sm" className="w-full md:w-auto" onClick={handleCheckout}>
      Enroll for {formatPrice(price)}
    </Button>
  );
};
export default CourseEnrollButton;
