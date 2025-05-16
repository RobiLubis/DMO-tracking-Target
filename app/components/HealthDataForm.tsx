import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { FileText } from "lucide-react-native";

interface HealthDataFormProps {
  onSubmit?: (data: HealthData) => void;
  onGeneratePDF?: (data: HealthData) => void;
  initialData?: HealthData;
}

interface HealthData {
  name: string;
  gender: string;
  age: string;
  height: string;
  weight: string;
  healthComplaints: string;
  totalFat: string;
  bmi: string;
  visceralFat: string;
  cellAge: string;
  waterContent: string;
  boneDensity: string;
  healthExpectations: string;
}

export default function HealthDataForm({
  onSubmit = () => {},
  onGeneratePDF = () => {},
  initialData = {
    name: "",
    gender: "male",
    age: "",
    height: "",
    weight: "",
    healthComplaints: "",
    totalFat: "",
    bmi: "",
    visceralFat: "",
    cellAge: "",
    waterContent: "",
    boneDensity: "",
    healthExpectations: "",
  },
}: HealthDataFormProps) {
  const [formData, setFormData] = useState<HealthData>(initialData);
  const [calculatedBMI, setCalculatedBMI] = useState<string>("");
  const [idealWeightDiff, setIdealWeightDiff] = useState<string>("");
  const [dailyWaterNeeds, setDailyWaterNeeds] = useState<string>("");

  const handleInputChange = (field: keyof HealthData, value: string) => {
    const newData = { ...formData, [field]: value };
    setFormData(newData);

    // Calculate BMI when height and weight are available
    if (
      (field === "height" || field === "weight") &&
      newData.height &&
      newData.weight
    ) {
      calculateBMI(parseFloat(newData.height), parseFloat(newData.weight));
    }

    // Calculate water needs when weight is available
    if (field === "weight" && newData.weight) {
      calculateWaterNeeds(parseFloat(newData.weight));
    }
  };

  const calculateBMI = (height: number, weight: number) => {
    if (height > 0 && weight > 0) {
      // Convert height from cm to m
      const heightInMeters = height / 100;
      const bmi = weight / (heightInMeters * heightInMeters);
      const roundedBMI = bmi.toFixed(1);
      setCalculatedBMI(roundedBMI);
      setFormData((prev) => ({ ...prev, bmi: roundedBMI }));

      // Calculate ideal weight difference
      // Using Broca's Index for ideal weight: (height in cm - 100) - 10%
      const idealWeight = (height - 100) * 0.9;
      const difference = weight - idealWeight;
      setIdealWeightDiff(difference.toFixed(1));
    }
  };

  const calculateWaterNeeds = (weight: number) => {
    // Standard calculation: 30ml per kg of body weight
    const waterNeeds = weight * 30;
    setDailyWaterNeeds(`${(waterNeeds / 1000).toFixed(1)} liters`);
  };

  const handleSubmit = () => {
    onSubmit(formData);
  };

  const handleGeneratePDF = () => {
    onGeneratePDF(formData);
  };

  return (
    <ScrollView className="bg-white">
      <View className="p-4 bg-white rounded-lg shadow-sm">
        <Text className="text-2xl font-bold text-center mb-6 text-blue-600">
          Health Data Form
        </Text>

        {/* Personal Information Section */}
        <View className="mb-6">
          <Text className="text-lg font-semibold mb-3 text-gray-800">
            Personal Information
          </Text>

          <View className="mb-4">
            <Text className="text-gray-700 mb-1">Full Name</Text>
            <TextInput
              className="border border-gray-300 rounded-md p-2 bg-gray-50"
              value={formData.name}
              onChangeText={(value) => handleInputChange("name", value)}
              placeholder="Enter your full name"
            />
          </View>

          <View className="mb-4">
            <Text className="text-gray-700 mb-1">Gender</Text>
            <View className="border border-gray-300 rounded-md bg-gray-50">
              <Picker
                selectedValue={formData.gender}
                onValueChange={(value) => handleInputChange("gender", value)}
              >
                <Picker.Item label="Male" value="male" />
                <Picker.Item label="Female" value="female" />
              </Picker>
            </View>
          </View>

          <View className="mb-4">
            <Text className="text-gray-700 mb-1">Age</Text>
            <TextInput
              className="border border-gray-300 rounded-md p-2 bg-gray-50"
              value={formData.age}
              onChangeText={(value) => handleInputChange("age", value)}
              placeholder="Enter your age"
              keyboardType="numeric"
            />
          </View>
        </View>

        {/* Physical Measurements Section */}
        <View className="mb-6">
          <Text className="text-lg font-semibold mb-3 text-gray-800">
            Physical Measurements
          </Text>

          <View className="mb-4">
            <Text className="text-gray-700 mb-1">Height (cm)</Text>
            <TextInput
              className="border border-gray-300 rounded-md p-2 bg-gray-50"
              value={formData.height}
              onChangeText={(value) => handleInputChange("height", value)}
              placeholder="Enter your height in cm"
              keyboardType="numeric"
            />
          </View>

          <View className="mb-4">
            <Text className="text-gray-700 mb-1">Weight (kg)</Text>
            <TextInput
              className="border border-gray-300 rounded-md p-2 bg-gray-50"
              value={formData.weight}
              onChangeText={(value) => handleInputChange("weight", value)}
              placeholder="Enter your weight in kg"
              keyboardType="numeric"
            />
          </View>

          <View className="mb-4">
            <Text className="text-gray-700 mb-1">Total Fat (%)</Text>
            <TextInput
              className="border border-gray-300 rounded-md p-2 bg-gray-50"
              value={formData.totalFat}
              onChangeText={(value) => handleInputChange("totalFat", value)}
              placeholder="Enter your total fat percentage"
              keyboardType="numeric"
            />
          </View>

          <View className="mb-4">
            <Text className="text-gray-700 mb-1">Visceral Fat (scale)</Text>
            <TextInput
              className="border border-gray-300 rounded-md p-2 bg-gray-50"
              value={formData.visceralFat}
              onChangeText={(value) => handleInputChange("visceralFat", value)}
              placeholder="Enter your visceral fat scale"
              keyboardType="numeric"
            />
          </View>

          <View className="mb-4">
            <Text className="text-gray-700 mb-1">Cell Age (years)</Text>
            <TextInput
              className="border border-gray-300 rounded-md p-2 bg-gray-50"
              value={formData.cellAge}
              onChangeText={(value) => handleInputChange("cellAge", value)}
              placeholder="Enter your cell age"
              keyboardType="numeric"
            />
          </View>

          <View className="mb-4">
            <Text className="text-gray-700 mb-1">Water Content (%)</Text>
            <TextInput
              className="border border-gray-300 rounded-md p-2 bg-gray-50"
              value={formData.waterContent}
              onChangeText={(value) => handleInputChange("waterContent", value)}
              placeholder="Enter your water content percentage"
              keyboardType="numeric"
            />
          </View>

          <View className="mb-4">
            <Text className="text-gray-700 mb-1">Bone Density (scale)</Text>
            <TextInput
              className="border border-gray-300 rounded-md p-2 bg-gray-50"
              value={formData.boneDensity}
              onChangeText={(value) => handleInputChange("boneDensity", value)}
              placeholder="Enter your bone density scale"
              keyboardType="numeric"
            />
          </View>
        </View>

        {/* Health Information Section */}
        <View className="mb-6">
          <Text className="text-lg font-semibold mb-3 text-gray-800">
            Health Information
          </Text>

          <View className="mb-4">
            <Text className="text-gray-700 mb-1">
              Health Complaints (optional)
            </Text>
            <TextInput
              className="border border-gray-300 rounded-md p-2 bg-gray-50"
              value={formData.healthComplaints}
              onChangeText={(value) =>
                handleInputChange("healthComplaints", value)
              }
              placeholder="Describe any health complaints"
              multiline
              numberOfLines={3}
            />
          </View>

          <View className="mb-4">
            <Text className="text-gray-700 mb-1">Health Expectations</Text>
            <TextInput
              className="border border-gray-300 rounded-md p-2 bg-gray-50"
              value={formData.healthExpectations}
              onChangeText={(value) =>
                handleInputChange("healthExpectations", value)
              }
              placeholder="Describe your health expectations"
              multiline
              numberOfLines={3}
            />
          </View>
        </View>

        {/* Calculated Health Information */}
        {calculatedBMI && (
          <View className="mb-6 p-4 bg-blue-50 rounded-lg">
            <Text className="text-lg font-semibold mb-3 text-gray-800">
              Health Analysis
            </Text>

            <View className="mb-2">
              <Text className="text-gray-700 font-medium">
                Body Mass Index (BMI):
              </Text>
              <Text className="text-gray-800">{calculatedBMI}</Text>
              <Text className="text-gray-600 text-sm mt-1">
                {parseFloat(calculatedBMI) < 18.5
                  ? "Underweight"
                  : parseFloat(calculatedBMI) < 25
                    ? "Normal weight"
                    : parseFloat(calculatedBMI) < 30
                      ? "Overweight"
                      : "Obese"}
              </Text>
            </View>

            {idealWeightDiff && (
              <View className="mb-2">
                <Text className="text-gray-700 font-medium">
                  Ideal Weight Difference:
                </Text>
                <Text className="text-gray-800">
                  {parseFloat(idealWeightDiff) > 0
                    ? `+${idealWeightDiff} kg (above ideal)`
                    : parseFloat(idealWeightDiff) < 0
                      ? `${idealWeightDiff} kg (below ideal)`
                      : "At ideal weight"}
                </Text>
              </View>
            )}

            {dailyWaterNeeds && (
              <View className="mb-2">
                <Text className="text-gray-700 font-medium">
                  Daily Water Needs:
                </Text>
                <Text className="text-gray-800">{dailyWaterNeeds}</Text>
              </View>
            )}

            <View className="mt-3">
              <Text className="text-gray-700 font-medium">
                Daily Nutritional Needs:
              </Text>
              <Text className="text-gray-600 text-sm mt-1">
                • Protein: 0.8-1.0g per kg of body weight
              </Text>
              <Text className="text-gray-600 text-sm">
                • Carbohydrates: 45-65% of daily calories
              </Text>
              <Text className="text-gray-600 text-sm">
                • Fats: 20-35% of daily calories
              </Text>
              <Text className="text-gray-600 text-sm">
                • Fiber: 25-30g per day
              </Text>
            </View>
          </View>
        )}

        {/* Action Buttons */}
        <View className="flex-row justify-between mt-4">
          <TouchableOpacity
            className="bg-blue-500 py-3 px-6 rounded-md flex-1 mr-2 flex-row justify-center items-center"
            onPress={handleSubmit}
          >
            <Text className="text-white font-semibold text-center">
              Save Data
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="bg-green-500 py-3 px-6 rounded-md flex-1 ml-2 flex-row justify-center items-center"
            onPress={handleGeneratePDF}
          >
            <FileText size={18} color="white" />
            <Text className="text-white font-semibold text-center ml-2">
              Generate PDF
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
