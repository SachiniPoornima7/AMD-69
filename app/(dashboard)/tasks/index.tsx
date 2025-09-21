import { useLoader } from "@/context/LoaderContext";
import { deleteTask, getAllTask, taskRef } from "@/services/taskService";
import { Task } from "@/types/task";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter, useSegments } from "expo-router";
import { onSnapshot } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const TaskScreen = () => {
  const [task, setTask] = useState<Task[]>([]);

  const router = useRouter();

  const segment = useSegments();

  const { showLoader, hideLoader } = useLoader();

  const handleFetchData = async () => {
    // await getTask()
    //   .then((data) => {
    //     console.log(data);
    //     setTask(data);
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //   });
    try {
      showLoader();
      const data = await getAllTask();
      console.log("Fetched tasks: ", data);
      setTask(data);
    } catch (error) {
      console.log("Error fetching tasks: ", error);
    } finally {
      hideLoader();
    }
  };

  useEffect(() => {
    const unsubscribe = onSnapshot(taskRef, (snap) => {
      const taskList = snap.docs.map((task) => {
        const data = task.data();
        // Prefer root fields, fallback to nested taskData if present
        return {
          id: task.id,
          title:
            data.title || (data.taskData && data.taskData.title) || "Untitled",
          description:
            data.description ||
            (data.taskData && data.taskData.description) ||
            "",
        };
      });
      setTask(taskList);
    });
    return () => unsubscribe();
  }, []);

  const handelDelete = async (id: string) => {
    Alert.alert("Are you sure you want to delete this task?", "", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Delete",
        onPress: async () => {
          try {
            showLoader();
            await deleteTask(id);
            Alert.alert("Task deleted successfully");
            handleFetchData();
          } catch (error) {
            console.error("Error deleting task:", error);
            Alert.alert("Failed to delete task");
          } finally {
            hideLoader();
          }
        },
      },
    ]);
  };

  return (
    <View className="flex-1 w-full p-5">
      <Text className="text-center">Task Screen</Text>
      <ScrollView className="mt-4">
        {task.map((task) => {
          return (
            <View key={task.id} className="p-4 mb-2 bg-gray-100 rounded-md">
              <Text className="text-lg font-semibold">{task.title}</Text>
              <Text className="py-1 text-sm text-gray-700 ">
                {task.description}
              </Text>
              <View className="flex-row ">
                <TouchableOpacity
                  className="px-4 py-2 bg-blue-500 rounded-md"
                  onPress={() => router.push(`/(dashboard)/tasks/${task.id}`)}
                >
                  <Text>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className="px-4 py-2 ml-3 bg-red-500 rounded-md"
                  onPress={() => handelDelete(task.id || "")}
                >
                  <Text>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        })}
      </ScrollView>
      <Pressable
        className="absolute p-5 m-5 bg-blue-500 rounded-full bottom-5 right-5"
        style={{ elevation: 5 }}
        onPress={() => {
          router.push("/(dashboard)/tasks/new");
        }}
      >
        <MaterialIcons name="add" size={28} color={"#fff"} />
      </Pressable>
    </View>
  );
};

export default TaskScreen;
