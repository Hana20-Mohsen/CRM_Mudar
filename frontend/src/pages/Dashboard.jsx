import React, { useContext, useEffect } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { dumyData } from "../dumyData";
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid
} from "recharts";
import { AuthContext } from "../context/AuthContext";
import { useOutletContext } from "react-router-dom";
import { BoardContext } from "../context/BoardContext";
import styles from './styles.module.css'
const COLORS = ["#4d215d", "#8B8589", "#FF8911", "#FF8042", "#FF3366"];

export default function Dashboard() {
  const queryClient = useQueryClient();
  const { user } = useContext(AuthContext);
  const { getDashboardData } = useContext(BoardContext)
  const { toggleSidebar } = useOutletContext();

  const { data, error, isLoading } = useQuery({
    queryKey: ["dashboardData"],
    queryFn: () => getDashboardData(),
    placeholderData: (prev) => prev,
    staleTime: 30_000,
  });

  useEffect(() => {
    console.log(data);
    // let role = getUserRole();
    // if (role) {
    //   setUserRole(role)
    // }


  }, [data]);
  const tasksData = data?.tasks?.map(item => ({
    name: item._id,
    value: item.count
  }));

  const usersChartData = data?.users?.map(item => ({
    name: item._id,
    value: item.count
  }));
  // --- Leads by Status ---
  const leadsData = data?.leads?.map(item => ({
  name: item._id,
  value: item.count
}));              
  // const leadsStatus = dumyData.leads.reduce((acc, lead) => {
  //   acc[lead.status] = (acc[lead.status] || 0) + 1;
  //   return acc;
  // }, {});
  // const leadsData = Object.keys(leadsStatus).map(key => ({
  //   name: key,
  //   value: leadsStatus[key]
  // }));

  // --- Deals by Stage ---
  const dealsData = data?.deals?.map(item => ({
  name: item._id,
  value: item.count
}));
  // const dealsStage = dumyData.deals.reduce((acc, deal) => {
  //   acc[deal.stage] = (acc[deal.stage] || 0) + 1;
  //   return acc;
  // }, {});
  // const dealsData = Object.keys(dealsStage).map(key => ({
  //   name: key,
  //   value: dealsStage[key]
  // }));


  return (
    <div className="container-fluid ">
      <div className="d-flex justify-content-between p-2">
        <i className={`${styles.toggle_btn} fa-solid fa-bars me-3 fs-2 text-white mb-3`}
          onClick={toggleSidebar}
        ></i>
        <h2 className="mb-4 text-white">Dashboard</h2>
      </div>
      <div className="row g-4">
        {/* Leads Pie */}
        <div className="col-md-6 col-lg-4">
          <div className="card p-3 h-100">
            <h5>Leads by Status</h5>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={leadsData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80}>
                  {leadsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Tasks Pie */}
        <div className="col-md-6 col-lg-4">
          <div className="card p-3 h-100">
            <h5>Tasks by Priority</h5>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={tasksData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80}>
                  {tasksData?.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Deals Bar */}
        <div className="col-md-6 col-lg-4">
          <div className="card p-3 h-100">
            <h5>Deals by Stage</h5>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={dealsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#4d215d" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Users Pie (Admin only) */}
        {user.role === "admin" && (
          <div className="col-md-6 col-lg-4">
            <div className="card p-3 h-100">
              <h5>Users by Role</h5>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={usersChartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80}>
                    {usersChartData?.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
