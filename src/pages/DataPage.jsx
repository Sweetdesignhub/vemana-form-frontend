import { useState, useEffect } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import {
  Download,
  RefreshCw,
  AlertCircle,
  Users,
  Sparkles,
} from "lucide-react";

function DataPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.get(
        "https://vemana-form-backend-gqdxbfeugnckexbm.eastasia-01.azurewebsites.net/api/data"
      );
      setData(response.data);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to fetch participant data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const exportToExcel = () => {
    if (data.length === 0) {
      alert("No participant data to export");
      return;
    }

    const exportData = data.map((item) => ({
      ID: item.id,
      Name: item.name,
      Email: item.email,
      Phone: item.phone,
      Message: item.message,
      "Registration Date": new Date(item.created_at).toLocaleString(),
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Participants");

    // Set column widths
    const colWidths = [
      { wch: 5 }, // ID
      { wch: 20 }, // Name
      { wch: 30 }, // Email
      { wch: 15 }, // Phone
      { wch: 40 }, // Message
      { wch: 20 }, // Date
    ];
    worksheet["!cols"] = colWidths;

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    const timestamp = new Date().toISOString().split("T")[0];
    saveAs(blob, `yogi_vemana_jayanti_participants_${timestamp}.xlsx`);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div>
      {/* Spiritual Quote */}
      <div className="mb-8 bg-gradient-to-r from-orange-100 to-amber-100 rounded-2xl p-6 shadow-lg border-2 border-orange-200">
        <div className="flex items-start">
          <div>
            <p className="text-sm text-gray-600">
              "For those who have acquired knowledge, the world is bright as
              day"
            </p>
          </div>
        </div>
      </div>

      {/* Header Card */}
      <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-8 mb-8 border-t-4 border-orange-500 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-orange-200 to-transparent rounded-bl-full opacity-30"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-orange-500 to-amber-600 rounded-full mr-4 shadow-lg">
              <Users className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                Registered Participants
              </h1>
              <p className="text-gray-600 mt-1">
                Souls gathered for spiritual enlightenment
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={fetchData}
              disabled={loading}
              className="bg-gradient-to-r from-gray-600 to-gray-700 text-white px-5 py-3 rounded-xl hover:from-gray-700 hover:to-gray-800 transition-all duration-300 flex items-center justify-center disabled:from-gray-400 disabled:to-gray-500 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-medium"
            >
              <RefreshCw
                className={`w-5 h-5 mr-2 ${loading ? "animate-spin" : ""}`}
              />
              Refresh
            </button>
            <button
              onClick={exportToExcel}
              disabled={data.length === 0}
              className="bg-gradient-to-r from-green-600 to-emerald-700 text-white px-5 py-3 rounded-xl hover:from-green-700 hover:to-emerald-800 transition-all duration-300 flex items-center justify-center disabled:from-gray-400 disabled:to-gray-500 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-medium"
            >
              <Download className="w-5 h-5 mr-2" />
              Export to Excel
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-gradient-to-r from-red-50 to-rose-50 text-red-800 p-5 rounded-xl flex items-start mb-6 shadow-md border-l-4 border-red-500">
          <AlertCircle className="w-6 h-6 mr-3 flex-shrink-0 mt-0.5" />
          <span className="font-medium">{error}</span>
        </div>
      )}

      {loading ? (
        <div className="bg-white rounded-3xl shadow-2xl p-16 text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-orange-200 border-t-orange-600 mb-4"></div>
          <p className="text-xl text-gray-600 font-medium">
            Loading participant data...
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Please wait while we gather the information
          </p>
        </div>
      ) : data.length === 0 ? (
        <div className="bg-white rounded-3xl shadow-2xl p-16 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-50 to-amber-50 opacity-50"></div>
          <div className="relative z-10">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-orange-200 to-amber-300 rounded-full mb-6">
              <Users className="w-10 h-10 text-orange-700" />
            </div>
            <p className="text-gray-600 text-xl font-medium mb-2">
              No participants registered yet
            </p>
            <p className="text-gray-500">
              Be the first to register for this spiritual gathering!
            </p>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border-t-4 border-orange-500">
          {/* Stats Bar */}
          <div className="bg-gradient-to-r from-orange-50 to-amber-50 px-6 py-4 border-b-2 border-orange-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <p className="text-sm font-semibold text-gray-700">
                  Total Registered Participants:{" "}
                  <span className="text-orange-600 text-lg ml-1">
                    {data.length}
                  </span>
                </p>
              </div>
              <p className="text-xs text-gray-600 hidden sm:block">
                Last updated: {new Date().toLocaleString("en-IN")}
              </p>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-orange-200">
              <thead className="bg-gradient-to-r from-orange-600 to-amber-600">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                    Phone
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                    Message
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                    Registration Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-orange-100">
                {data.map((row, index) => (
                  <tr
                    key={row.id}
                    className="hover:bg-orange-50 transition-colors duration-200"
                    style={{
                      backgroundColor:
                        index % 2 === 0 ? "white" : "rgba(255, 247, 237, 0.3)",
                    }}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-orange-600">
                      #{row.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {row.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {row.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {row.phone}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700 max-w-xs">
                      <div className="line-clamp-2" title={row.message}>
                        {row.message}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {formatDate(row.created_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Bottom Quote */}
      {data.length > 0 && (
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500 italic">
            "Together we walk the path of enlightenment - {data.length} seekers
            united"
          </p>
        </div>
      )}
    </div>
  );
}

export default DataPage;
