import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";

import { Pie, Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

const API = import.meta.env.VITE_API_URL;

export default function Dashboard() {
  const [records, setRecords] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [summary, setSummary] = useState(null);

  const [type, setType] = useState("");
  const [category, setCategory] = useState("");

  const [form, setForm] = useState({
    amount: "",
    type: "expense",
    category: "",
    note: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [records, type, category]);

  const token = localStorage.getItem("token");
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };

  const fetchData = async () => {
    try {
      const recRes = await axios.get(`${API}/records`, config);
      const sumRes = await axios.get(`${API}/dashboard/summary`, config);

      setRecords(recRes.data.data);
      setSummary(sumRes.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const applyFilters = () => {
    let data = [...records];

    if (type) data = data.filter((r) => r.type === type);
    if (category) data = data.filter((r) => r.category === category);

    setFiltered(data);
  };

  const createRecord = async () => {
    try {
      await axios.post(`${API}/records`, form, config);
      alert("Record added ✅");
      fetchData();
    } catch (err) {
      alert("Error ❌");
    }
  };

  if (!summary) return <h2>Loading...</h2>;

  // Charts
  const categoryMap = {};
  records.forEach((r) => {
    if (r.type === "expense") {
      categoryMap[r.category] =
        (categoryMap[r.category] || 0) + r.amount;
    }
  });

  const categories = Object.keys(categoryMap);
  const values = Object.values(categoryMap);

  const pieData = {
    labels: categories,
    datasets: [
      {
        data: values,
        backgroundColor: ["#3b82f6", "#22c55e", "#f59e0b", "#ef4444","#ec82ee"],
      },
    ],
  };
  // BAR + LINE DATA (Income vs Expense totals by type)
const barData = {
  labels: ["Income", "Expense"],
  datasets: [
    {
      label: "Amount",
      data: [
        summary.income,
        summary.expense
      ],
      backgroundColor: ["#22c55e", "#ef4444"],
    },
  ],
};

// LINE DATA (trend based on records order)
const lineData = {
  labels: records.map((_, i) => `Txn ${i + 1}`),
  datasets: [
    {
      label: "Transactions Trend",
      data: records.map((r) =>
        r.type === "income" ? r.amount : -r.amount
      ),
      borderColor: "#3b82f6",
      backgroundColor: "rgba(59,130,246,0.2)",
      tension: 0.3,
    },
  ],
};

  return (
    <div className="app">
      <Sidebar />

      <div className="main">
        <h1>Dashboard</h1>

        {/* Stats */}
        <div className="cards">
          <div className="stat">
            <h4>Income</h4>
            <p>₹ {summary.income}</p>
          </div>
          <div className="stat">
            <h4>Expense</h4>
            <p>₹ {summary.expense}</p>
          </div>
          <div className="stat">
            <h4>Balance</h4>
            <p>₹ {summary.balance}</p>
          </div>
        </div>

        {/* Charts */}
        {/* Charts */}
<div className="charts">

  {/* Pie Chart */}
  <div className="card">
    <h3>Expense Breakdown</h3>
    <Pie data={pieData} />
  </div>

  {/* Bar Chart */}
  <div className="card">
    <h3>Income vs Expense</h3>
    <Bar data={barData} />
  </div>
  <br></br>

  {/* Line Chart */}
  <div className="card">
    <h3>Transaction Trend</h3>
    <Line data={lineData} />
  </div>

</div>

        {/* Filters */}
        <div className="card">
          <h3>Filters</h3>

          <select onChange={(e) => setType(e.target.value)}>
            <option value="">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>

          <input
            placeholder="Category"
            onChange={(e) => setCategory(e.target.value)}
          />
        </div>

        {/* Create Record */}
        <div className="card">
          <h3>Add Record</h3>

          <input
            placeholder="Amount"
            onChange={(e) =>
              setForm({ ...form, amount: e.target.value })
            }
          />

          <select
            onChange={(e) =>
              setForm({ ...form, type: e.target.value })
            }
          >
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>

          <input
            placeholder="Category"
            onChange={(e) =>
              setForm({ ...form, category: e.target.value })
            }
          />

          <input
            placeholder="Note"
            onChange={(e) =>
              setForm({ ...form, note: e.target.value })
            }
          />

          <button onClick={createRecord}>Add</button>
        </div>

        {/* Records Table */}
        <div className="card">
          <h3>Records</h3>

          <table width="100%">
            <thead>
              <tr>
                <th>Amount</th>
                <th>Type</th>
                <th>Category</th>
                <th>Note</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((r, i) => (
                <tr key={i}>
                  <td>₹ {r.amount}</td>
                  <td>{r.type}</td>
                  <td>{r.category}</td>
                  <td>{r.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}