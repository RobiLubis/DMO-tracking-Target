import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from "react-native";
import {
  ChevronDown,
  ChevronUp,
  Check,
  AlertCircle,
  Calendar,
  TrendingUp,
} from "lucide-react-native";

interface HealthMetric {
  day: number;
  weight: string;
  waterIntake: string;
  sleepHours: string;
  energyLevel: string;
  symptoms: string;
}

interface HealthTrackingSystemProps {
  userName?: string;
  initialData?: HealthMetric[];
  targetWeight?: string;
  targetWaterIntake?: string;
  targetSleepHours?: string;
  onSaveData?: (data: HealthMetric[]) => void;
}

export default function HealthTrackingSystem({
  userName = "John Doe",
  initialData,
  targetWeight = "65",
  targetWaterIntake = "2.5",
  targetSleepHours = "8",
  onSaveData = () => {},
}: HealthTrackingSystemProps) {
  // Initialize with default data if none provided
  const defaultData = Array.from({ length: 10 }, (_, i) => ({
    day: i + 1,
    weight: "",
    waterIntake: "",
    sleepHours: "",
    energyLevel: "",
    symptoms: "",
  }));

  const [healthData, setHealthData] = useState<HealthMetric[]>(
    initialData || defaultData,
  );
  const [expandedDay, setExpandedDay] = useState<number | null>(1); // First day expanded by default
  const [expandedSection, setExpandedSection] = useState<string>("tracking"); // Default to tracking form

  const handleInputChange = (
    day: number,
    field: keyof HealthMetric,
    value: string,
  ) => {
    const updatedData = healthData.map((item) =>
      item.day === day ? { ...item, [field]: value } : item,
    );
    setHealthData(updatedData);
    onSaveData(updatedData);
  };

  const toggleDay = (day: number) => {
    setExpandedDay(expandedDay === day ? null : day);
  };

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? "" : section);
  };

  // Calculate progress percentage for visualization
  const calculateProgress = () => {
    const filledFields = healthData.reduce((count, day) => {
      const dayFields = [
        day.weight,
        day.waterIntake,
        day.sleepHours,
        day.energyLevel,
      ].filter(Boolean).length;
      return count + dayFields;
    }, 0);
    const totalFields = healthData.length * 4; // 4 main metrics per day
    return Math.round((filledFields / totalFields) * 100);
  };

  const progressPercentage = calculateProgress();

  return (
    <ScrollView className="bg-white">
      <View className="p-4 bg-white">
        <Text className="text-2xl font-bold text-blue-800 mb-4">
          Health Tracking System
        </Text>
        <Text className="text-lg text-gray-700 mb-6">
          Welcome back, {userName}!
        </Text>

        {/* Progress Overview */}
        <View className="mb-6 bg-blue-50 p-4 rounded-lg">
          <Text className="text-lg font-semibold text-blue-800 mb-2">
            Your 10-Day Progress
          </Text>
          <View className="h-4 bg-gray-200 rounded-full overflow-hidden mb-2">
            <View
              className="h-full bg-green-500 rounded-full"
              style={{ width: `${progressPercentage}%` }}
            />
          </View>
          <Text className="text-gray-600">{progressPercentage}% Complete</Text>

          <View className="flex-row justify-between mt-4">
            <View className="items-center">
              <Text className="font-semibold text-blue-800">Target Weight</Text>
              <Text>{targetWeight} kg</Text>
            </View>
            <View className="items-center">
              <Text className="font-semibold text-blue-800">Target Water</Text>
              <Text>{targetWaterIntake} L/day</Text>
            </View>
            <View className="items-center">
              <Text className="font-semibold text-blue-800">Target Sleep</Text>
              <Text>{targetSleepHours} hrs/day</Text>
            </View>
          </View>
        </View>

        {/* Section Toggles */}
        <View className="mb-6 flex-row justify-between">
          <TouchableOpacity
            className={`flex-1 py-3 px-4 rounded-lg mr-2 ${expandedSection === "tracking" ? "bg-blue-600" : "bg-gray-200"}`}
            onPress={() => toggleSection("tracking")}
          >
            <Text
              className={`text-center font-semibold ${expandedSection === "tracking" ? "text-white" : "text-gray-800"}`}
            >
              Tracking Form
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className={`flex-1 py-3 px-4 rounded-lg mr-2 ${expandedSection === "detox" ? "bg-blue-600" : "bg-gray-200"}`}
            onPress={() => toggleSection("detox")}
          >
            <Text
              className={`text-center font-semibold ${expandedSection === "detox" ? "text-white" : "text-gray-800"}`}
            >
              Detoxification
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className={`flex-1 py-3 px-4 rounded-lg ${expandedSection === "targets" ? "bg-blue-600" : "bg-gray-200"}`}
            onPress={() => toggleSection("targets")}
          >
            <Text
              className={`text-center font-semibold ${expandedSection === "targets" ? "text-white" : "text-gray-800"}`}
            >
              Targets
            </Text>
          </TouchableOpacity>
        </View>

        {/* 10-Day Tracking Form */}
        {expandedSection === "tracking" && (
          <View className="mb-6">
            <Text className="text-xl font-semibold text-blue-800 mb-4 flex-row items-center">
              <Calendar size={20} color="#1e40af" className="mr-2" /> 10-Day
              Health Monitoring
            </Text>

            {healthData.map((day) => (
              <View
                key={day.day}
                className="mb-3 border border-gray-200 rounded-lg overflow-hidden"
              >
                <TouchableOpacity
                  className="flex-row justify-between items-center p-4 bg-gray-50"
                  onPress={() => toggleDay(day.day)}
                >
                  <Text className="font-semibold text-gray-800">
                    Day {day.day}
                  </Text>
                  {expandedDay === day.day ? (
                    <ChevronUp size={20} color="#4b5563" />
                  ) : (
                    <ChevronDown size={20} color="#4b5563" />
                  )}
                </TouchableOpacity>

                {expandedDay === day.day && (
                  <View className="p-4">
                    <View className="mb-3">
                      <Text className="text-gray-700 mb-1">Weight (kg)</Text>
                      <TextInput
                        className="border border-gray-300 rounded-md p-2"
                        value={day.weight}
                        onChangeText={(value) =>
                          handleInputChange(day.day, "weight", value)
                        }
                        keyboardType="numeric"
                        placeholder="Enter your weight"
                      />
                    </View>

                    <View className="mb-3">
                      <Text className="text-gray-700 mb-1">
                        Water Intake (liters)
                      </Text>
                      <TextInput
                        className="border border-gray-300 rounded-md p-2"
                        value={day.waterIntake}
                        onChangeText={(value) =>
                          handleInputChange(day.day, "waterIntake", value)
                        }
                        keyboardType="numeric"
                        placeholder="Enter water intake"
                      />
                    </View>

                    <View className="mb-3">
                      <Text className="text-gray-700 mb-1">Sleep Hours</Text>
                      <TextInput
                        className="border border-gray-300 rounded-md p-2"
                        value={day.sleepHours}
                        onChangeText={(value) =>
                          handleInputChange(day.day, "sleepHours", value)
                        }
                        keyboardType="numeric"
                        placeholder="Enter sleep hours"
                      />
                    </View>

                    <View className="mb-3">
                      <Text className="text-gray-700 mb-1">
                        Energy Level (1-10)
                      </Text>
                      <TextInput
                        className="border border-gray-300 rounded-md p-2"
                        value={day.energyLevel}
                        onChangeText={(value) =>
                          handleInputChange(day.day, "energyLevel", value)
                        }
                        keyboardType="numeric"
                        placeholder="Rate your energy level"
                      />
                    </View>

                    <View className="mb-3">
                      <Text className="text-gray-700 mb-1">
                        Symptoms or Notes
                      </Text>
                      <TextInput
                        className="border border-gray-300 rounded-md p-2"
                        value={day.symptoms}
                        onChangeText={(value) =>
                          handleInputChange(day.day, "symptoms", value)
                        }
                        placeholder="Any symptoms or notes"
                        multiline
                        numberOfLines={3}
                      />
                    </View>
                  </View>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Detoxification Explanation */}
        {expandedSection === "detox" && (
          <View className="mb-6 bg-blue-50 p-4 rounded-lg">
            <Text className="text-xl font-semibold text-blue-800 mb-4 flex-row items-center">
              <AlertCircle size={20} color="#1e40af" className="mr-2" />
              <Text>Detoxification Process</Text>
            </Text>

            <View className="mb-4">
              <Text className="font-semibold text-gray-800 mb-2">
                Phase 1: Initial Cleansing (Days 1-3)
              </Text>
              <Text className="text-gray-600 mb-2">
                During this phase, your body begins to eliminate toxins. You may
                experience:
              </Text>
              <View className="ml-4">
                <Text className="text-gray-600 mb-1">• Mild headaches</Text>
                <Text className="text-gray-600 mb-1">• Fatigue</Text>
                <Text className="text-gray-600 mb-1">
                  • Changes in digestion
                </Text>
              </View>
              <Text className="text-gray-600 mt-2">
                These are normal signs that your body is beginning the
                detoxification process.
              </Text>
            </View>

            <View className="mb-4">
              <Text className="font-semibold text-gray-800 mb-2">
                Phase 2: Deep Detoxification (Days 4-7)
              </Text>
              <Text className="text-gray-600 mb-2">
                Your body is now actively removing stored toxins. You may
                notice:
              </Text>
              <View className="ml-4">
                <Text className="text-gray-600 mb-1">
                  • Improved energy levels
                </Text>
                <Text className="text-gray-600 mb-1">
                  • Better sleep quality
                </Text>
                <Text className="text-gray-600 mb-1">• Clearer skin</Text>
                <Text className="text-gray-600 mb-1">
                  • Enhanced mental clarity
                </Text>
              </View>
            </View>

            <View className="mb-4">
              <Text className="font-semibold text-gray-800 mb-2">
                Phase 3: Stabilization (Days 8-10)
              </Text>
              <Text className="text-gray-600 mb-2">
                Your body begins to adjust to its cleaner state. Benefits
                include:
              </Text>
              <View className="ml-4">
                <Text className="text-gray-600 mb-1">
                  • Consistent energy throughout the day
                </Text>
                <Text className="text-gray-600 mb-1">
                  • Reduced cravings for unhealthy foods
                </Text>
                <Text className="text-gray-600 mb-1">
                  • Improved digestive function
                </Text>
                <Text className="text-gray-600 mb-1">
                  • Enhanced immune response
                </Text>
              </View>
            </View>

            <View className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
              <Text className="text-yellow-800 font-semibold">
                Important Note:
              </Text>
              <Text className="text-yellow-700">
                Stay hydrated throughout the process. Aim to drink at least 2.5
                liters of water daily to help flush toxins from your system.
              </Text>
            </View>
          </View>
        )}

        {/* Target Achievement Charts */}
        {expandedSection === "targets" && (
          <View className="mb-6">
            <Text className="text-xl font-semibold text-blue-800 mb-4 flex-row items-center">
              <TrendingUp size={20} color="#1e40af" className="mr-2" /> Target
              Achievement
            </Text>

            <View className="mb-5 bg-white border border-gray-200 rounded-lg p-4">
              <Text className="font-semibold text-gray-800 mb-3">
                Weight Management Target
              </Text>
              <View className="mb-2">
                <Text className="text-gray-600 mb-1">
                  Target: {targetWeight} kg
                </Text>
                <Text className="text-gray-600 mb-2">
                  Current:{" "}
                  {healthData.find((d) => d.weight)?.weight || "Not recorded"}{" "}
                  kg
                </Text>
                <View className="h-3 bg-gray-200 rounded-full overflow-hidden">
                  <View
                    className="h-full bg-blue-500 rounded-full"
                    style={{
                      width: healthData.find((d) => d.weight) ? "60%" : "0%",
                    }}
                  />
                </View>
              </View>
              <Text className="text-sm text-gray-500 mt-2">
                Track your weight daily to see your progress towards your
                target.
              </Text>
            </View>

            <View className="mb-5 bg-white border border-gray-200 rounded-lg p-4">
              <Text className="font-semibold text-gray-800 mb-3">
                Hydration Target
              </Text>
              <View className="mb-2">
                <Text className="text-gray-600 mb-1">
                  Target: {targetWaterIntake} liters daily
                </Text>
                <Text className="text-gray-600 mb-2">
                  Average:{" "}
                  {healthData.some((d) => d.waterIntake)
                    ? "2.1"
                    : "Not recorded"}{" "}
                  liters
                </Text>
                <View className="h-3 bg-gray-200 rounded-full overflow-hidden">
                  <View
                    className="h-full bg-cyan-500 rounded-full"
                    style={{
                      width: healthData.some((d) => d.waterIntake)
                        ? "75%"
                        : "0%",
                    }}
                  />
                </View>
              </View>
              <Text className="text-sm text-gray-500 mt-2">
                Proper hydration is essential for detoxification and overall
                health.
              </Text>
            </View>

            <View className="mb-5 bg-white border border-gray-200 rounded-lg p-4">
              <Text className="font-semibold text-gray-800 mb-3">
                Sleep Quality Target
              </Text>
              <View className="mb-2">
                <Text className="text-gray-600 mb-1">
                  Target: {targetSleepHours} hours daily
                </Text>
                <Text className="text-gray-600 mb-2">
                  Average:{" "}
                  {healthData.some((d) => d.sleepHours)
                    ? "7.2"
                    : "Not recorded"}{" "}
                  hours
                </Text>
                <View className="h-3 bg-gray-200 rounded-full overflow-hidden">
                  <View
                    className="h-full bg-purple-500 rounded-full"
                    style={{
                      width: healthData.some((d) => d.sleepHours)
                        ? "85%"
                        : "0%",
                    }}
                  />
                </View>
              </View>
              <Text className="text-sm text-gray-500 mt-2">
                Quality sleep supports your body's natural healing processes.
              </Text>
            </View>

            <View className="bg-green-50 border border-green-200 rounded-lg p-4">
              <Text className="font-semibold text-green-800 mb-2">
                Product Consumption Offer
              </Text>
              <Text className="text-green-700 mb-3">
                Enhance your health journey with our premium health products at
                discounted member prices.
              </Text>
              <TouchableOpacity className="bg-green-600 py-3 rounded-md">
                <Text className="text-white text-center font-semibold">
                  View Special Offers
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    </ScrollView>
  );
}
