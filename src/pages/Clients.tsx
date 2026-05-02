import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Edit, Trash2, User, ArrowLeft } from "lucide-react";
import { Client } from "../types";
import TabletLayout from "../components/TabletLayout";
import Navigation from "../components/Navigation";

const Clients: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    age: "",
    height: "",
    startingWeight: "",
    gender: "male" as "male" | "female",
    maritalStatus: "single" as "single" | "married" | "divorced",
    trainingLevel: "beginner" as "beginner" | "intermediate" | "advanced",
    goal: "",
    injuryHistory: "",
    smoking: false,
    alcohol: false,
    sleepHours: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const clientData: Client = {
      id: editingClient?.id || Date.now().toString(),
      name: formData.name,
      age: parseInt(formData.age),
      height: parseFloat(formData.height),
      startingWeight: parseFloat(formData.startingWeight),
      gender: formData.gender,
      maritalStatus: formData.maritalStatus,
      trainingLevel: formData.trainingLevel,
      goal: formData.goal,
      injuryHistory: formData.injuryHistory,
      smoking: formData.smoking,
      alcohol: formData.alcohol,
      sleepHours: parseFloat(formData.sleepHours),
      createdAt: editingClient?.createdAt || new Date(),
    };

    if (editingClient) {
      setClients(
        clients.map((c) => (c.id === editingClient.id ? clientData : c)),
      );
      setEditingClient(null);
    } else {
      setClients([...clients, clientData]);
    }

    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: "",
      age: "",
      height: "",
      startingWeight: "",
      gender: "male",
      maritalStatus: "single",
      trainingLevel: "beginner",
      goal: "",
      injuryHistory: "",
      smoking: false,
      alcohol: false,
      sleepHours: "",
    });
    setShowAddForm(false);
    setEditingClient(null);
  };

  const handleEdit = (client: Client) => {
    setFormData({
      name: client.name,
      age: client.age.toString(),
      height: client.height.toString(),
      startingWeight: client.startingWeight.toString(),
      gender: client.gender,
      maritalStatus: client.maritalStatus,
      trainingLevel: client.trainingLevel,
      goal: client.goal,
      injuryHistory: client.injuryHistory,
      smoking: client.smoking,
      alcohol: client.alcohol,
      sleepHours: client.sleepHours.toString(),
    });
    setEditingClient(client);
    setShowAddForm(true);
  };

  const handleDelete = (id: string) => {
    setClients(clients.filter((c) => c.id !== id));
  };

  if (showAddForm) {
    return (
      <div className="min-h-screen bg-dark-bg p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={resetForm}
              className="flex items-center space-x-2 text-gray-400 hover:text-white"
            >
              <ArrowLeft size={20} />
              <span>Back to Clients</span>
            </button>
            <h1 className="text-3xl font-bold text-white">
              {editingClient ? "Edit Client" : "Add New Client"}
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Basic Info */}
              <div className="card">
                <h2 className="text-xl font-semibold text-white mb-4">
                  Basic Information
                </h2>
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="input-field w-full"
                    required
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="number"
                      placeholder="Age"
                      value={formData.age}
                      onChange={(e) =>
                        setFormData({ ...formData, age: e.target.value })
                      }
                      className="input-field"
                      required
                    />
                    <input
                      type="number"
                      placeholder="Height (cm)"
                      value={formData.height}
                      onChange={(e) =>
                        setFormData({ ...formData, height: e.target.value })
                      }
                      className="input-field"
                      required
                    />
                  </div>
                  <input
                    type="number"
                    placeholder="Starting Weight (kg)"
                    value={formData.startingWeight}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        startingWeight: e.target.value,
                      })
                    }
                    className="input-field w-full"
                    required
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <select
                      value={formData.gender}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          gender: e.target.value as "male" | "female",
                        })
                      }
                      className="input-field"
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                    <select
                      value={formData.maritalStatus}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          maritalStatus: e.target.value as any,
                        })
                      }
                      className="input-field"
                    >
                      <option value="single">Single</option>
                      <option value="married">Married</option>
                      <option value="divorced">Divorced</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Fitness Info */}
              <div className="card">
                <h2 className="text-xl font-semibold text-white mb-4">
                  Fitness Information
                </h2>
                <div className="space-y-4">
                  <select
                    value={formData.trainingLevel}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        trainingLevel: e.target.value as any,
                      })
                    }
                    className="input-field w-full"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                  <textarea
                    placeholder="Goals"
                    value={formData.goal}
                    onChange={(e) =>
                      setFormData({ ...formData, goal: e.target.value })
                    }
                    className="input-field w-full h-24 resize-none"
                    required
                  />
                  <textarea
                    placeholder="Injury History"
                    value={formData.injuryHistory}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        injuryHistory: e.target.value,
                      })
                    }
                    className="input-field w-full h-24 resize-none"
                  />
                </div>
              </div>

              {/* Lifestyle */}
              <div className="card">
                <h2 className="text-xl font-semibold text-white mb-4">
                  Lifestyle
                </h2>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <label className="flex items-center space-x-2 text-white">
                      <input
                        type="checkbox"
                        checked={formData.smoking}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            smoking: e.target.checked,
                          })
                        }
                        className="w-4 h-4"
                      />
                      <span>Smoking</span>
                    </label>
                    <label className="flex items-center space-x-2 text-white">
                      <input
                        type="checkbox"
                        checked={formData.alcohol}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            alcohol: e.target.checked,
                          })
                        }
                        className="w-4 h-4"
                      />
                      <span>Alcohol</span>
                    </label>
                  </div>
                  <input
                    type="number"
                    placeholder="Sleep Hours"
                    value={formData.sleepHours}
                    onChange={(e) =>
                      setFormData({ ...formData, sleepHours: e.target.value })
                    }
                    className="input-field w-full"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="flex space-x-4">
              <button type="submit" className="btn-primary">
                {editingClient ? "Update Client" : "Add Client"}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="btn-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  if (showAddForm) {
    return (
      <TabletLayout sidebar={<Navigation />}>
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={resetForm}
            className="flex items-center space-x-2 text-gray-400 hover:text-white"
          >
            <ArrowLeft size={20} />
            <span>Back to Clients</span>
          </button>
          <h1 className="text-3xl font-bold text-white">
            {editingClient ? "Edit Client" : "Add New Client"}
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Info */}
            <div className="card">
              <h2 className="text-xl font-semibold text-white mb-4">
                Basic Information
              </h2>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="input-field w-full"
                  required
                />
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="number"
                    placeholder="Age"
                    value={formData.age}
                    onChange={(e) =>
                      setFormData({ ...formData, age: e.target.value })
                    }
                    className="input-field"
                    required
                  />
                  <input
                    type="number"
                    placeholder="Height (cm)"
                    value={formData.height}
                    onChange={(e) =>
                      setFormData({ ...formData, height: e.target.value })
                    }
                    className="input-field"
                    required
                  />
                </div>
                <input
                  type="number"
                  placeholder="Starting Weight (kg)"
                  value={formData.startingWeight}
                  onChange={(e) =>
                    setFormData({ ...formData, startingWeight: e.target.value })
                  }
                  className="input-field w-full"
                  required
                />
                <div className="grid grid-cols-2 gap-4">
                  <select
                    value={formData.gender}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        gender: e.target.value as "male" | "female",
                      })
                    }
                    className="input-field"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                  <select
                    value={formData.maritalStatus}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        maritalStatus: e.target.value as any,
                      })
                    }
                    className="input-field"
                  >
                    <option value="single">Single</option>
                    <option value="married">Married</option>
                    <option value="divorced">Divorced</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Fitness Info */}
            <div className="card">
              <h2 className="text-xl font-semibold text-white mb-4">
                Fitness Information
              </h2>
              <div className="space-y-4">
                <select
                  value={formData.trainingLevel}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      trainingLevel: e.target.value as any,
                    })
                  }
                  className="input-field w-full"
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
                <textarea
                  placeholder="Goals"
                  value={formData.goal}
                  onChange={(e) =>
                    setFormData({ ...formData, goal: e.target.value })
                  }
                  className="input-field w-full h-24 resize-none"
                  required
                />
                <textarea
                  placeholder="Injury History"
                  value={formData.injuryHistory}
                  onChange={(e) =>
                    setFormData({ ...formData, injuryHistory: e.target.value })
                  }
                  className="input-field w-full h-24 resize-none"
                />
              </div>
            </div>

            {/* Lifestyle */}
            <div className="card">
              <h2 className="text-xl font-semibold text-white mb-4">
                Lifestyle
              </h2>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <label className="flex items-center space-x-2 text-white">
                    <input
                      type="checkbox"
                      checked={formData.smoking}
                      onChange={(e) =>
                        setFormData({ ...formData, smoking: e.target.checked })
                      }
                      className="w-4 h-4"
                    />
                    <span>Smoking</span>
                  </label>
                  <label className="flex items-center space-x-2 text-white">
                    <input
                      type="checkbox"
                      checked={formData.alcohol}
                      onChange={(e) =>
                        setFormData({ ...formData, alcohol: e.target.checked })
                      }
                      className="w-4 h-4"
                    />
                    <span>Alcohol</span>
                  </label>
                </div>
                <input
                  type="number"
                  placeholder="Sleep Hours"
                  value={formData.sleepHours}
                  onChange={(e) =>
                    setFormData({ ...formData, sleepHours: e.target.value })
                  }
                  className="input-field w-full"
                  required
                />
              </div>
            </div>
          </div>

          <div className="flex space-x-4">
            <button type="submit" className="btn-primary">
              {editingClient ? "Update Client" : "Add Client"}
            </button>
            <button type="button" onClick={resetForm} className="btn-secondary">
              Cancel
            </button>
          </div>
        </form>
      </TabletLayout>
    );
  }

  return (
    <TabletLayout sidebar={<Navigation />}>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-white">Clients</h1>
        <button
          onClick={() => setShowAddForm(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus size={20} />
          <span>Add Client</span>
        </button>
      </div>

      {clients.length === 0 ? (
        <div className="text-center py-16">
          <User size={64} className="mx-auto text-gray-600 mb-4" />
          <p className="text-gray-400 text-lg">No clients yet</p>
          <p className="text-gray-500 mt-2">
            Add your first client to get started
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {clients.map((client) => (
            <div key={client.id} className="card">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-neon-yellow rounded-full flex items-center justify-center">
                    <User size={24} className="text-black" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">
                      {client.name}
                    </h3>
                    <p className="text-gray-400 text-sm">
                      {client.age} years • {client.gender}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(client)}
                    className="text-gray-400 hover:text-white"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(client.id)}
                    className="text-gray-400 hover:text-red-500"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Height:</span>
                  <span className="text-white">{client.height} cm</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Weight:</span>
                  <span className="text-white">{client.startingWeight} kg</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Level:</span>
                  <span className="text-white capitalize">
                    {client.trainingLevel}
                  </span>
                </div>
              </div>

              <Link
                to={`/session/${client.id}`}
                className="btn-secondary w-full mt-4 text-center"
              >
                Start Assessment
              </Link>
            </div>
          ))}
        </div>
      )}
    </TabletLayout>
  );
};

export default Clients;
