import React, { useState } from 'react';
import { StyleSheet, View, FlatList, Alert, TextInput, Text } from 'react-native';
import { Button, ListItem, Icon, Switch } from 'react-native-elements';

const TaskManager = ({ initialTasks = [] }) => {
  const [taskList, setTaskList] = useState(initialTasks);
  const [newTask, setNewTask] = useState('');

  const handleAddTask = () => {
    if (newTask.trim() === '') {
      Alert.alert('Error', 'Task title cannot be empty');
      return;
    }
    const task = { id: Date.now().toString(), title: newTask, completed: false };
    setTaskList([task, ...taskList.filter(task => !task.completed), ...taskList.filter(task => task.completed)]);
    setNewTask('');
  };

  const handleToggleTask = (id) => {
    const updatedTasks = taskList.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ).sort((a, b) => a.completed - b.completed);
    setTaskList(updatedTasks);
  };

  const handleDeleteTask = (id) => {
    setTaskList(taskList.filter(task => task.id !== id));
  };

  return (
    <View style={styles.mainContainer}>
      <View style={styles.inputSection}>
        <TextInput
          style={styles.textInput}
          placeholder="Enter task title..."
          value={newTask}
          onChangeText={setNewTask}
        />
        <Button title="Save Task" onPress={handleAddTask} disabled={newTask.trim() === ''} />
      </View>

      <FlatList
        data={taskList}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <ListItem bottomDivider>
            <Switch
              value={item.completed}
              onValueChange={() => handleToggleTask(item.id)}
            />
            <ListItem.Content>
              <ListItem.Title style={item.completed ? styles.taskCompleted : styles.taskPending}>
                {item.title}
              </ListItem.Title>
              <Text style={styles.statusText}>
                {item.completed ? 'done/true' : 'due/false'}
              </Text>
            </ListItem.Content>
            <Icon name="delete" onPress={() => handleDeleteTask(item.id)} />
          </ListItem>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  inputSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  textInput: {
    flex: 1,
    borderBottomWidth: 1,
    padding: 10,
    marginRight: 10,
  },
  taskCompleted: {
    color: 'gray',
  },
  taskPending: {
    color: 'black',
  },
  statusText: {
    fontSize: 12,
    color: 'gray',
  },
});

export default TaskManager;