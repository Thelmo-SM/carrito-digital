import RecentOrders from "@/features/Dashboard/components/RecentOrders";
import SalesChart from "@/features/Dashboard/components/SalesChart";
import SummaryCards from "@/features/Dashboard/components/SummaryCards";

export default function Dashboard() {
    return (
        <>
            <SummaryCards />
            <SalesChart />
            <RecentOrders />
        </>
    );
};