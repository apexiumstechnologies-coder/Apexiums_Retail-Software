import React, { useState, useMemo, useEffect } from "react";
import {
  Store,
  Key,
  TrendingUp,
  Activity,
  Calendar,
  ShoppingCart,
  ShieldCheck,
  HandCoins,
  Package,
  Building,
} from "lucide-react";
import axiosInstance from "../lib/axios";
import { toast } from "react-toastify";

const Dashboard = () => {
  const [dbStats, setDbStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // ==========================================
  // 1. DYNAMIC MONTH GENERATOR
  // ==========================================
  const months = useMemo(() => {
    const list = [];

    const systemLaunchDate = new Date(2026, 7, 1);
    const today = new Date();

    let rollingDate = new Date(systemLaunchDate);

    while (rollingDate <= today) {
      const monthName = rollingDate.toLocaleString("default", {
        month: "long",
      });

      const year = rollingDate.getFullYear();

      list.unshift(`${monthName} ${year}`);

      rollingDate.setMonth(rollingDate.getMonth() + 1);
    }

    if (list.length === 0) {
      list.push("August 2026");
    }

    return list;
  }, []);

  const [selectedMonth, setSelectedMonth] = useState(months[0]);

  // ==========================================
  // 2. GET ACTIVE USERS
  // ==========================================
  const getLocalStorageUser = (key) => {
    try {
      const user = localStorage.getItem(key);
      return user ? JSON.parse(user) : null;
    } catch (error) {
      console.error(`Error reading ${key}:`, error);
      return null;
    }
  };

  const storeUser = getLocalStorageUser("activeStore");
  const wholesalerUser = getLocalStorageUser("activeWholesaler");
  const adminUser = getLocalStorageUser("activeAdmin");

  // ==========================================
  // 3. DETERMINE CURRENT ROLE
  // ==========================================
  let role = "admin";

  if (wholesalerUser) {
    role = "wholesaler";
  } else if (storeUser) {
    role = "store";
  } else if (adminUser) {
    role = "admin";
  }

  const currentUser =
    wholesalerUser || storeUser || adminUser || null;

  // ==========================================
  // 4. FETCH DASHBOARD STATS
  // ==========================================
  useEffect(() => {
    const fetchStats = async () => {
      setIsLoading(true);

      try {
        const params = {
          month: selectedMonth,
          role: role,
        };

        // Store ID
        if (role === "store" && storeUser) {
          params.storeId = storeUser._id || storeUser.id;
        }

        // Wholesaler ID
        if (role === "wholesaler" && wholesalerUser) {
          params.wholesalerId =
            wholesalerUser._id || wholesalerUser.id;
        }

        console.log("Dashboard Request:", {
          role,
          params,
          currentUser,
        });

        const res = await axiosInstance.get("/dashboard/stats", {
          params,
        });

        let stats = res.data?.stats || {};

        // ==========================================
        // STORE LOCAL ORDERS
        // ==========================================
        if (role === "store") {
          const localOrders = JSON.parse(
            localStorage.getItem("apex_orders_list") || "[]"
          );

          const completedOrders = localOrders.filter(
            (order) =>
              order.status === "Completed" ||
              order.status === "Delivered"
          );

          let localRevenue = 0;

          completedOrders.forEach((order) => {
            localRevenue += Number(order.amount || 0);
          });

          stats.totalOrders = completedOrders.length;
          stats.totalRevenue = localRevenue;
        }

        setDbStats(stats);
      } catch (err) {
        console.error("Dashboard Stats Error:", err);

        toast.error(
          err?.response?.data?.message ||
            "Dashboard sync failed"
        );

        setDbStats({});
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, [selectedMonth, role]);

  // ==========================================
  // 5. ADMIN STATS
  // ==========================================
  const adminStats = [
    {
      label: "Total Stores",
      count: dbStats?.totalStores || "0",
      icon: <Store size={22} />,
      color: "#13786E",
      bg: "bg-teal-50",
      desc: "Live Outlets",
    },
    {
      label: "Monthly Rent",
      count: `Rs. ${(
        dbStats?.monthlyRent || 0
      ).toLocaleString()}`,
      icon: <Key size={22} />,
      color: "#3B82F6",
      bg: "bg-blue-50",
      desc: "Expected",
    },
    {
      label: "Total Revenue",
      count: `Rs. ${(
        dbStats?.totalRevenue || 0
      ).toLocaleString()}`,
      icon: <TrendingUp size={22} />,
      color: "#10B981",
      bg: "bg-emerald-50",
      desc: "Collected Rent",
    },
    {
      label: "Defaulters",
      count: dbStats?.defaulters || "0",
      icon: <Activity size={22} />,
      color: "#EF4444",
      bg: "bg-red-50",
      desc: "Action Required",
    },
  ];

  // ==========================================
  // 6. STORE STATS
  // ==========================================
  const storeStats = [
    {
      label: "Total Revenue",
      count: `Rs. ${(
        dbStats?.totalRevenue || 0
      ).toLocaleString()}`,
      icon: <TrendingUp size={22} />,
      color: "#10B981",
      bg: "bg-emerald-50",
      desc: "Gross Value",
    },
    {
      label: "Net Profit",
      count: `Rs. ${(
        dbStats?.netProfit || 0
      ).toLocaleString()}`,
      icon: <TrendingUp size={22} />,
      color: "#13786E",
      bg: "bg-teal-50",
      desc: "Est. Margin",
    },
    {
      label: "Total Debt",
      count: `Rs. ${(
        dbStats?.totalDebt || 0
      ).toLocaleString()}`,
      icon: <HandCoins size={22} />,
      color: "#EF4444",
      bg: "bg-red-50",
      desc: "Customer Udhaar",
    },
    {
      label: "Stock Items",
      count: (
        dbStats?.totalProducts || 0
      ).toLocaleString(),
      icon: <Package size={22} />,
      color: "#8B5CF6",
      bg: "bg-purple-50",
      desc: "Total SKU",
    },
    {
      label: "Agencies",
      count: dbStats?.totalAgencies || "0",
      icon: <Building size={22} />,
      color: "#64748B",
      bg: "bg-slate-50",
      desc: "Suppliers",
    },
    {
      label: "Active Portal Login",
      count: "Secure",
      icon: <ShieldCheck size={22} />,
      color: "#3B82F6",
      bg: "bg-blue-50",
      desc: "Current Session",
    },
    {
      label: "Total Orders",
      count: dbStats?.totalOrders || "0",
      icon: <ShoppingCart size={22} />,
      color: "#F59E0B",
      bg: "bg-yellow-50",
      desc: "Processed",
    },
    {
      label: "Total Wholesalers",
      count: dbStats?.totalWholesalers || "0",
      icon: <Building size={22} />,
      color: "#EC4899",
      bg: "bg-pink-50",
      desc: "Registered",
    },
  ];

  // ==========================================
  // 7. WHOLESALER STATS
  // ==========================================
  const wholesalerStats = [
    {
      label: "Total Orders",
      count: dbStats?.totalOrders || "0",
      icon: <ShoppingCart size={22} />,
      color: "#F59E0B",
      bg: "bg-yellow-50",
      desc: "Your Orders",
    },
    {
      label: "Total Revenue",
      count: `Rs. ${(
        dbStats?.totalRevenue || 0
      ).toLocaleString()}`,
      icon: <TrendingUp size={22} />,
      color: "#10B981",
      bg: "bg-emerald-50",
      desc: "Order Value",
    },
    {
      label: "Total Debt",
      count: `Rs. ${(
        dbStats?.totalDebt || 0
      ).toLocaleString()}`,
      icon: <HandCoins size={22} />,
      color: "#EF4444",
      bg: "bg-red-50",
      desc: "Outstanding",
    },
    {
      label: "Products",
      count: (
        dbStats?.totalProducts || 0
      ).toLocaleString(),
      icon: <Package size={22} />,
      color: "#8B5CF6",
      bg: "bg-purple-50",
      desc: "Available Products",
    },
    {
      label: "Active Portal Login",
      count: "Secure",
      icon: <ShieldCheck size={22} />,
      color: "#3B82F6",
      bg: "bg-blue-50",
      desc: "Current Session",
    },
    {
      label: "Account Status",
      count: "Active",
      icon: <Activity size={22} />,
      color: "#13786E",
      bg: "bg-teal-50",
      desc: "Wholesaler Account",
    },
  ];

  // ==========================================
  // 8. CURRENT STATS
  // ==========================================
  const currentStats =
    role === "admin"
      ? adminStats
      : role === "wholesaler"
      ? wholesalerStats
      : storeStats;

  // ==========================================
  // 9. CURRENT USER NAME
  // ==========================================
  const getHeaderTitle = () => {
    if (role === "admin") {
      return "Admin Control";
    }

    if (role === "wholesaler") {
      return `${wholesalerUser?.name || "Wholesaler"} Terminal`;
    }

    return `${storeUser?.name || "Store"} Terminal`;
  };

  // ==========================================
  // 10. RENDER
  // ==========================================
  return (
    <div className="flex-1 lg:ml-64 ml-0 min-h-screen bg-[#F8FAFC] p-4 md:p-8 mt-14 text-left font-sans transition-all duration-300">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 border-b border-gray-100 pb-6">

        <div className="text-center md:text-left">
          <h1 className="text-2xl md:text-3xl font-black text-gray-800 tracking-tighter uppercase italic flex items-center justify-center md:justify-start gap-3">
            {getHeaderTitle()}
          </h1>

          <p className="text-gray-400 text-[10px] font-bold tracking-[3px] uppercase mt-1">
            {isLoading
              ? "Fetching real-time data..."
              : `Reporting for ${selectedMonth}`}
          </p>

          {/* ROLE INDICATOR */}
          <p className="text-[9px] text-[#13786E] font-black uppercase tracking-widest mt-2">
            {role} portal
          </p>
        </div>

        {/* MONTH SELECTOR */}
        <div className="bg-white p-1 rounded-2xl border border-gray-200 flex shadow-sm items-center px-4 w-full md:w-auto hover:border-[#13786E] transition-all">
          <Calendar size={16} className="text-[#13786E]" />

          <select
            value={selectedMonth}
            onChange={(e) =>
              setSelectedMonth(e.target.value)
            }
            className="bg-transparent outline-none text-[10px] font-black uppercase tracking-widest cursor-pointer py-3 md:py-2.5 pl-2 flex-1 md:w-48"
          >
            {months.map((month) => (
              <option key={month} value={month}>
                {month}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* STATS GRID */}
      <div
        className={`grid grid-cols-1 sm:grid-cols-2 ${
          role === "admin"
            ? "lg:grid-cols-4"
            : "lg:grid-cols-3"
        } gap-4 md:gap-6`}
      >
        {isLoading
          ? [...Array(role === "admin" ? 4 : 6)].map(
              (_, index) => (
                <div
                  key={index}
                  className="bg-white p-6 rounded-[2rem] h-32 animate-pulse border border-gray-100 shadow-sm"
                />
              )
            )
          : currentStats.map((item, index) => (
              <div
                key={index}
                className="group bg-white p-5 md:p-6 rounded-[2rem] md:rounded-[2.2rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col relative overflow-hidden active:scale-95"
              >
                <div className="flex items-center gap-4 md:gap-5 relative z-10">

                  <div
                    className={`${item.bg} p-3 md:p-3.5 rounded-2xl transition-all group-hover:rotate-6 shadow-inner`}
                    style={{ color: item.color }}
                  >
                    {item.icon}
                  </div>

                  <div className="overflow-hidden">
                    <h3 className="text-gray-400 font-black text-[9px] uppercase tracking-widest truncate">
                      {item.label}
                    </h3>

                    <p className="text-lg md:text-xl font-black text-gray-800 truncate tracking-tighter mt-0.5">
                      {item.count}
                    </p>
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-gray-50 flex items-center justify-between">

                  <span className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter italic">
                    {item.desc}
                  </span>

                  <div
                    className="w-1.5 h-1.5 rounded-full animate-pulse"
                    style={{
                      backgroundColor: item.color,
                    }}
                  />
                </div>
              </div>
            ))}
      </div>

      {/* SYNC STATUS */}
      {!isLoading && (
        <div className="mt-10 flex justify-center opacity-50">
          <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-gray-100 text-[8px] font-black uppercase tracking-widest text-gray-400 shadow-sm">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />

            System Fully Synchronized
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;