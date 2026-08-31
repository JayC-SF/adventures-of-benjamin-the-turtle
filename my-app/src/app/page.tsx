import { NightSky } from "@/components/NightSky";
import QuestDashboard from "@/components/QuestDashboard";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center">
      <NightSky />
      <QuestDashboard />
    </main>
  );
}