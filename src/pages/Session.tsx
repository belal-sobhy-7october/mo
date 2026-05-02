import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Save, Camera, Check } from "lucide-react";
import type { Session } from "../types";

const Session: React.FC = () => {
  const { clientId } = useParams<{ clientId: string }>();

  const [currentStep, setCurrentStep] = useState(1);
  const [sessionData, setSessionData] = useState<Partial<Session>>({
    id: Date.now().toString(),
    clientId: clientId || "",
    date: new Date(),
    quickCheckIn: {
      painLevel: 1,
      sleepQuality: 5,
      generalCondition: "",
    },
    bodyComposition: {
      weight: 0,
      bodyFat: 0,
      muscleMass: 0,
    },
    measurements: {
      waist: 0,
      hips: 0,
      chest: 0,
      thigh: 0,
      arm: 0,
    },
    mobility: {
      hip: [],
      shoulder: [],
      ankle: [],
      thoracic: [],
    },
    stability: [],
    strength: [],
    benchmarks: [],
    photos: {
      front: "",
      side: "",
      back: "",
    },
  });

  const mobilityExercises = {
    hip: [
      {
        name: "Hip Flexor Test",
        description: "Thomas test - measure hip extension range",
      },
      {
        name: "Hip Internal Rotation",
        description: "Seated hip IR measurement",
      },
      {
        name: "Hip External Rotation",
        description: "Seated hip ER measurement",
      },
    ],
    shoulder: [
      { name: "Shoulder Flexion", description: "Overhead reach test" },
      {
        name: "Shoulder External Rotation",
        description: "Rotator cuff ER test",
      },
      {
        name: "Shoulder Internal Rotation",
        description: "Rotator cuff IR test",
      },
    ],
    ankle: [
      { name: "Ankle Dorsiflexion", description: "Knee to wall test" },
      { name: "Ankle Plantarflexion", description: "Standing calf raise test" },
    ],
    thoracic: [
      { name: "Thoracic Extension", description: "Seated thoracic extension" },
      { name: "Thoracic Rotation", description: "Quadruped rotation test" },
    ],
  };

  const stabilityExercises = [
    { name: "Front Plank", description: "Hold maximum time with good form" },
    { name: "Side Plank", description: "Hold maximum time each side" },
    { name: "Bird Dog", description: "Hold for 30 seconds each side" },
    { name: "Single Leg Stand", description: "Hold maximum time each side" },
  ];

  const strengthExercises = {
    push: [
      { name: "Bench Press", description: "1RM or 3-5RM test" },
      { name: "Push-ups", description: "Maximum reps with good form" },
      { name: "Dumbbell Press", description: "1RM or 3-5RM test" },
    ],
    pull: [
      { name: "Pull-ups", description: "Maximum reps or weighted test" },
      { name: "Bent Over Row", description: "1RM or 3-5RM test" },
      { name: "Lat Pulldown", description: "1RM or 3-5RM test" },
    ],
    lower: [
      { name: "Squat", description: "1RM or 3-5RM test" },
      { name: "Deadlift", description: "1RM or 3-5RM test" },
      { name: "Leg Press", description: "1RM or 3-5RM test" },
    ],
    core: [
      { name: "Cable Crunch", description: "Weight test for 10-12 reps" },
      { name: "Russian Twist", description: "Weight test for 10-12 reps" },
      { name: "Hanging Leg Raise", description: "Maximum reps" },
    ],
  };

  const benchmarkExercises = [
    "push-up",
    "pull-up",
    "bench-press",
    "squat",
    "deadlift",
    "military-press",
  ];

  const handleNext = () => {
    if (currentStep < 8) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSave = () => {
    // Save session to localStorage
    const sessions = JSON.parse(localStorage.getItem("sessions") || "[]");
    sessions.push(sessionData);
    localStorage.setItem("sessions", JSON.stringify(sessions));
    alert("Session saved successfully!");
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="card">
            <h2 className="text-2xl font-bold text-white mb-6">
              Quick Check-in
            </h2>
            <div className="space-y-6">
              <div>
                <label className="block text-white mb-2">
                  Pain Level (1-10)
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={sessionData.quickCheckIn?.painLevel}
                  onChange={(e) =>
                    setSessionData({
                      ...sessionData,
                      quickCheckIn: {
                        ...sessionData.quickCheckIn!,
                        painLevel: parseInt(e.target.value),
                      },
                    })
                  }
                  className="w-full"
                />
                <div className="flex justify-between text-gray-400 text-sm mt-1">
                  <span>1 (No Pain)</span>
                  <span>{sessionData.quickCheckIn?.painLevel}</span>
                  <span>10 (Severe Pain)</span>
                </div>
              </div>

              <div>
                <label className="block text-white mb-2">
                  Sleep Quality (1-10)
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={sessionData.quickCheckIn?.sleepQuality}
                  onChange={(e) =>
                    setSessionData({
                      ...sessionData,
                      quickCheckIn: {
                        ...sessionData.quickCheckIn!,
                        sleepQuality: parseInt(e.target.value),
                      },
                    })
                  }
                  className="w-full"
                />
                <div className="flex justify-between text-gray-400 text-sm mt-1">
                  <span>1 (Poor)</span>
                  <span>{sessionData.quickCheckIn?.sleepQuality}</span>
                  <span>10 (Excellent)</span>
                </div>
              </div>

              <div>
                <label className="block text-white mb-2">
                  General Condition
                </label>
                <textarea
                  placeholder="How are you feeling today?"
                  value={sessionData.quickCheckIn?.generalCondition}
                  onChange={(e) =>
                    setSessionData({
                      ...sessionData,
                      quickCheckIn: {
                        ...sessionData.quickCheckIn!,
                        generalCondition: e.target.value,
                      },
                    })
                  }
                  className="input-field w-full h-24 resize-none"
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="card">
            <h2 className="text-2xl font-bold text-white mb-6">
              Body Composition
            </h2>
            <div className="space-y-6">
              <div>
                <label className="block text-white mb-2">Weight (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  value={sessionData.bodyComposition?.weight || ""}
                  onChange={(e) =>
                    setSessionData({
                      ...sessionData,
                      bodyComposition: {
                        ...sessionData.bodyComposition!,
                        weight: parseFloat(e.target.value),
                      },
                    })
                  }
                  className="input-field w-full"
                />
              </div>

              <div>
                <label className="block text-white mb-2">Body Fat %</label>
                <input
                  type="number"
                  step="0.1"
                  value={sessionData.bodyComposition?.bodyFat || ""}
                  onChange={(e) =>
                    setSessionData({
                      ...sessionData,
                      bodyComposition: {
                        ...sessionData.bodyComposition!,
                        bodyFat: parseFloat(e.target.value),
                      },
                    })
                  }
                  className="input-field w-full"
                />
              </div>

              <div>
                <label className="block text-white mb-2">Muscle Mass %</label>
                <input
                  type="number"
                  step="0.1"
                  value={sessionData.bodyComposition?.muscleMass || ""}
                  onChange={(e) =>
                    setSessionData({
                      ...sessionData,
                      bodyComposition: {
                        ...sessionData.bodyComposition!,
                        muscleMass: parseFloat(e.target.value),
                      },
                    })
                  }
                  className="input-field w-full"
                />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="card">
            <h2 className="text-2xl font-bold text-white mb-6">
              Body Measurements (cm)
            </h2>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-white mb-2">Waist</label>
                <input
                  type="number"
                  step="0.1"
                  value={sessionData.measurements?.waist || ""}
                  onChange={(e) =>
                    setSessionData({
                      ...sessionData,
                      measurements: {
                        ...sessionData.measurements!,
                        waist: parseFloat(e.target.value),
                      },
                    })
                  }
                  className="input-field w-full"
                />
              </div>

              <div>
                <label className="block text-white mb-2">Hips</label>
                <input
                  type="number"
                  step="0.1"
                  value={sessionData.measurements?.hips || ""}
                  onChange={(e) =>
                    setSessionData({
                      ...sessionData,
                      measurements: {
                        ...sessionData.measurements!,
                        hips: parseFloat(e.target.value),
                      },
                    })
                  }
                  className="input-field w-full"
                />
              </div>

              <div>
                <label className="block text-white mb-2">Chest</label>
                <input
                  type="number"
                  step="0.1"
                  value={sessionData.measurements?.chest || ""}
                  onChange={(e) =>
                    setSessionData({
                      ...sessionData,
                      measurements: {
                        ...sessionData.measurements!,
                        chest: parseFloat(e.target.value),
                      },
                    })
                  }
                  className="input-field w-full"
                />
              </div>

              <div>
                <label className="block text-white mb-2">Thigh</label>
                <input
                  type="number"
                  step="0.1"
                  value={sessionData.measurements?.thigh || ""}
                  onChange={(e) =>
                    setSessionData({
                      ...sessionData,
                      measurements: {
                        ...sessionData.measurements!,
                        thigh: parseFloat(e.target.value),
                      },
                    })
                  }
                  className="input-field w-full"
                />
              </div>

              <div>
                <label className="block text-white mb-2">Arm</label>
                <input
                  type="number"
                  step="0.1"
                  value={sessionData.measurements?.arm || ""}
                  onChange={(e) =>
                    setSessionData({
                      ...sessionData,
                      measurements: {
                        ...sessionData.measurements!,
                        arm: parseFloat(e.target.value),
                      },
                    })
                  }
                  className="input-field w-full"
                />
              </div>

              <div>
                <label className="block text-white mb-2">Calf (Optional)</label>
                <input
                  type="number"
                  step="0.1"
                  value={sessionData.measurements?.calf || ""}
                  onChange={(e) =>
                    setSessionData({
                      ...sessionData,
                      measurements: {
                        ...sessionData.measurements!,
                        calf: parseFloat(e.target.value) || undefined,
                      },
                    })
                  }
                  className="input-field w-full"
                />
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white">
              Mobility Assessment
            </h2>
            {Object.entries(mobilityExercises).map(([category, exercises]) => (
              <div key={category} className="card">
                <h3 className="text-xl font-semibold text-white mb-4 capitalize">
                  {category} Mobility
                </h3>
                <div className="space-y-4">
                  {exercises.map((exercise, index) => (
                    <div
                      key={index}
                      className="border border-dark-border rounded-lg p-4"
                    >
                      <h4 className="text-white font-medium mb-2">
                        {exercise.name}
                      </h4>
                      <p className="text-gray-400 text-sm mb-3">
                        {exercise.description}
                      </p>
                      <input
                        type="number"
                        step="0.1"
                        placeholder="Result (cm or degrees)"
                        className="input-field w-full"
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        );

      case 5:
        return (
          <div className="card">
            <h2 className="text-2xl font-bold text-white mb-6">
              Stability & Core
            </h2>
            <div className="space-y-4">
              {stabilityExercises.map((exercise, index) => (
                <div
                  key={index}
                  className="border border-dark-border rounded-lg p-4"
                >
                  <h4 className="text-white font-medium mb-2">
                    {exercise.name}
                  </h4>
                  <p className="text-gray-400 text-sm mb-3">
                    {exercise.description}
                  </p>
                  <input
                    type="text"
                    placeholder="Result (time or rating)"
                    className="input-field w-full"
                  />
                </div>
              ))}
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white">
              Strength Assessment
            </h2>
            {Object.entries(strengthExercises).map(([category, exercises]) => (
              <div key={category} className="card">
                <h3 className="text-xl font-semibold text-white mb-4 capitalize">
                  {category}
                </h3>
                <div className="space-y-4">
                  {exercises.map((exercise, index) => (
                    <div
                      key={index}
                      className="border border-dark-border rounded-lg p-4"
                    >
                      <h4 className="text-white font-medium mb-2">
                        {exercise.name}
                      </h4>
                      <p className="text-gray-400 text-sm mb-3">
                        {exercise.description}
                      </p>
                      <div className="grid grid-cols-2 gap-4">
                        <input
                          type="number"
                          placeholder="Weight (kg)"
                          className="input-field"
                        />
                        <input
                          type="number"
                          placeholder="Reps"
                          className="input-field"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        );

      case 7:
        return (
          <div className="card">
            <h2 className="text-2xl font-bold text-white mb-6">
              Strength Benchmarks
            </h2>
            <div className="space-y-4">
              {benchmarkExercises.map((exercise, index) => (
                <div
                  key={index}
                  className="border border-dark-border rounded-lg p-4"
                >
                  <h4 className="text-white font-medium mb-3 capitalize">
                    {exercise.replace("-", " ")}
                  </h4>
                  <div className="grid grid-cols-3 gap-4">
                    <input
                      type="number"
                      placeholder="Weight (kg)"
                      className="input-field"
                    />
                    <input
                      type="number"
                      placeholder="Reps"
                      className="input-field"
                    />
                    <input
                      type="number"
                      placeholder="Score"
                      className="input-field"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 8:
        return (
          <div className="card">
            <h2 className="text-2xl font-bold text-white mb-6">
              Progress Photos
            </h2>
            <div className="grid grid-cols-3 gap-6">
              <div>
                <label className="block text-white mb-2">Front Photo</label>
                <button className="w-full h-64 border-2 border-dashed border-dark-border rounded-lg flex flex-col items-center justify-center hover:border-neon-yellow transition-colors">
                  <Camera size={32} className="text-gray-400 mb-2" />
                  <span className="text-gray-400">Capture Front</span>
                </button>
              </div>

              <div>
                <label className="block text-white mb-2">Side Photo</label>
                <button className="w-full h-64 border-2 border-dashed border-dark-border rounded-lg flex flex-col items-center justify-center hover:border-neon-yellow transition-colors">
                  <Camera size={32} className="text-gray-400 mb-2" />
                  <span className="text-gray-400">Capture Side</span>
                </button>
              </div>

              <div>
                <label className="block text-white mb-2">Back Photo</label>
                <button className="w-full h-64 border-2 border-dashed border-dark-border rounded-lg flex flex-col items-center justify-center hover:border-neon-yellow transition-colors">
                  <Camera size={32} className="text-gray-400 mb-2" />
                  <span className="text-gray-400">Capture Back</span>
                </button>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const stepTitles = [
    "Quick Check-in",
    "Body Composition",
    "Measurements",
    "Mobility",
    "Stability",
    "Strength",
    "Benchmarks",
    "Photos",
  ];

  return (
    <div className="min-h-screen bg-dark-bg p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link to="/clients" className="text-gray-400 hover:text-white">
              <ArrowLeft size={24} />
            </Link>
            <h1 className="text-3xl font-bold text-white">
              Assessment Session
            </h1>
          </div>
          <button
            onClick={handleSave}
            className="btn-primary flex items-center space-x-2"
          >
            <Save size={20} />
            <span>Save Session</span>
          </button>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-8">
          {stepTitles.map((_, index) => (
            <div key={index} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  index + 1 < currentStep
                    ? "bg-neon-yellow text-black"
                    : index + 1 === currentStep
                      ? "bg-neon-yellow text-black"
                      : "bg-dark-border text-gray-400"
                }`}
              >
                {index + 1 < currentStep ? <Check size={16} /> : index + 1}
              </div>
              {index < stepTitles.length - 1 && (
                <div
                  className={`w-16 h-1 mx-2 ${
                    index + 1 < currentStep
                      ? "bg-neon-yellow"
                      : "bg-dark-border"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Current Step Content */}
        <div className="mb-8">{renderStep()}</div>

        {/* Navigation */}
        <div className="flex justify-between">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className={`btn-secondary ${currentStep === 1 ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            Previous
          </button>
          <button
            onClick={handleNext}
            disabled={currentStep === 8}
            className={`btn-primary ${currentStep === 8 ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {currentStep === 8 ? "Complete" : "Next"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Session;
