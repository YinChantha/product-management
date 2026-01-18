'use client';
import PageHeader from "@/components/header/globle-header";
import { Download, Plus } from "lucide-react";

export default function Orderpage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader
        title="Order Management"
        showSearch={true}
        searchPlaceholder="Search ..."
        actions={[
          {
            label: "Export Excel",
            icon: <Download className="w-4 h-4" />,
            variant: "outline",
            onClick: () => {},
            disabled: false,
            loading: false,
          },
          {
            label: "Add Order",
            icon: <Plus className="w-4 h-4" />,
            onClick: () => {},
          },
        ]}
        notificationCount={2}
      />
      <div className="text-center mt-5">This is for Order Management</div>
    </div>
  );
}
