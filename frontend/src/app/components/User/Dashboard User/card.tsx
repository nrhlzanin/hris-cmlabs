import { Users, UserPlus, UserCheck, UserX } from "lucide-react";

export default function StatCardDashboard() {
  const cards = [
    {
      icon: <Users className="w-6 h-6" />, label: "Total Employee", value: 208,
      updateText: "Update March 16, 2025", updateColor: "bg-green-700"
    },
    {
      icon: <UserPlus className="w-6 h-6" />, label: "New Employees", value: 20,
      updateText: "Update March 16, 2025", updateColor: "bg-yellow-500"
    },
    {
      icon: <UserCheck className="w-6 h-6" />, label: "Active Employees", value: 15,
      updateText: "Update March 16, 2025", updateColor: "bg-blue-500"
    },
    {
      icon: <UserX className="w-6 h-6" />, label: "Resigned Employees", value: 10,
      updateText: "Update March 16, 2025", updateColor: "bg-red-700"
    },
  ];

  return (
    <div className="flex flex-wrap gap-4">
      {cards.map((card, index) => (
        <div key={index} className="rounded-lg border shadow-sm bg-white w-full max-w-[260px]">
          <div className="p-4 flex flex-col gap-1">
            <div className="flex items-center gap-2 text-black font-semibold">
              <div className="text-xl">{card.icon}</div>
              <div>{card.label}</div>
            </div>
            <div className="text-3xl font-bold text-black">{card.value}</div>
          </div>
          <div className={`${card.updateColor} text-white text-sm px-3 py-1 rounded-b-lg`}>
            {card.updateText}
          </div>
        </div>
      ))}
    </div>
  );
}
