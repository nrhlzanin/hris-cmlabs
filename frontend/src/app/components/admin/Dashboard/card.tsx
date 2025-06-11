import { Users, UserPlus, UserCheck, UserX } from "lucide-react";

export default function StatCardDashboard() {
  const cards = [
    {
      icon: <Users className="w-6 h-6" />,
      label: "Total Employee",
      value: 208,
      updateText: "Updated March 16, 2025",
      updateColor: "bg-green-700",
    },
    {
      icon: <UserPlus className="w-6 h-6" />,
      label: "New Employees",
      value: 20,
      updateText: "Updated March 16, 2025",
      updateColor: "bg-yellow-500",
    },
    {
      icon: <UserCheck className="w-6 h-6" />,
      label: "Active Employees",
      value: 15,
      updateText: "Updated March 16, 2025",
      updateColor: "bg-blue-500",
    },
    {
      icon: <UserX className="w-6 h-6" />,
      label: "Resigned Employees",
      value: 10,
      updateText: "Updated March 16, 2025",
      updateColor: "bg-red-700",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
      {cards.map((card, index) => (
        <div
          key={index}
          className="rounded-xl border shadow-sm bg-white p-4 flex flex-col justify-between"
        >
          <div className="flex items-center gap-3 text-black">
            <div className="p-2 bg-gray-100 rounded-full">{card.icon}</div>
            <div>
              <p className="text-sm text-gray-500">{card.label}</p>
              <p className="text-2xl font-bold">{card.value}</p>
            </div>
          </div>
          <div
            className={`${card.updateColor} text-white text-xs text-center mt-3 py-1 rounded-md`}
          >
            {card.updateText}
          </div>
        </div>
      ))}
    </div>
  );
}
