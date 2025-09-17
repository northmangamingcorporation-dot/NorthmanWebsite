import React from "react";  

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md flex flex-col p-6">
        <h2 className="text-2xl font-bold text-teal-600 mb-8">
          Northman Gaming
        </h2>
        <nav className="flex-1">
          <ul className="space-y-4 font-medium">
            <li>
              <a href="#overview" className="block hover:text-teal-600">
                📊 Overview
              </a>
            </li>
            <li>
              <a href="#games" className="block hover:text-teal-600">
                🎮 Games
              </a>
            </li>
            <li>
              <a href="#clients" className="block hover:text-teal-600">
                👥 Clients
              </a>
            </li>
            <li>
              <a href="#settings" className="block hover:text-teal-600">
                ⚙️ Settings
              </a>
            </li>
          </ul>
        </nav>
        <button className="mt-8 px-4 py-2 bg-teal-600 text-white rounded-xl shadow hover:bg-teal-700">
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        {/* Header */}
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <div className="flex items-center space-x-4">
            <span className="text-gray-600">Welcome, User 👋</span>
            <img
              src="https://i.pravatar.cc/40"
              alt="user avatar"
              className="w-10 h-10 rounded-full border border-gray-300"
            />
          </div>
        </header>

        {/* Stats Section */}
        <section
          id="overview"
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition">
            <h3 className="text-gray-500">Active Games</h3>
            <p className="text-3xl font-bold text-teal-600">12</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition">
            <h3 className="text-gray-500">Clients</h3>
            <p className="text-3xl font-bold text-teal-600">58</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition">
            <h3 className="text-gray-500">Revenue</h3>
            <p className="text-3xl font-bold text-teal-600">$24,500</p>
          </div>
        </section>

        {/* Table Section */}
        <section
          id="clients"
          className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition"
        >
          <h2 className="text-xl font-semibold mb-4 text-gray-900">
            Recent Clients
          </h2>
          <table className="w-full text-left text-gray-700">
            <thead>
              <tr>
                <th className="py-2">Name</th>
                <th className="py-2">Email</th>
                <th className="py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t">
                <td className="py-2">Alice Johnson</td>
                <td className="py-2">alice@example.com</td>
                <td className="py-2 text-teal-600">Active</td>
              </tr>
              <tr className="border-t">
                <td className="py-2">Mark Smith</td>
                <td className="py-2">mark@example.com</td>
                <td className="py-2 text-gray-500">Inactive</td>
              </tr>
              <tr className="border-t">
                <td className="py-2">Sophie Lee</td>
                <td className="py-2">sophie@example.com</td>
                <td className="py-2 text-teal-600">Active</td>
              </tr>
            </tbody>
          </table>
        </section>
      </main>
    </div>
  );
}
