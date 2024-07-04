import React, { useState, useEffect } from 'react';
import { StyleSheet, View, FlatList, Alert, TextInput, Text } from 'react-native';
import { Button, ListItem, Icon, Switch } from 'react-native-elements';
import { db } from './config';
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot } from 'firebase/firestore';

const TaskManager = ({ initialTasks = [] }) => {
  const [taskList, setTaskList] = useState(initialTasks);
  const [newTask, setNewTask] = useState('');

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'tasks'), (snapshot) => {
      const newTasks = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setTaskList(newTasks);
    });
    return unsubscribe;
  }, []);

  const handleAddTask = async () => {
    if (newTask.trim() === '') {
      Alert.alert('Error', 'Task title cannot be empty');
      return;
    }
    try {
      await addDoc(collection(db, 'tasks'), { title: newTask, completed: false });
      setNewTask('');
    } catch (error) {
      console.error('Error adding task: ', error);
    }
  };

  const handleToggleTask = async (id, completed) => {
    try {
      const taskDoc = doc(db, 'tasks', id);
      await updateDoc(taskDoc, { completed: !completed });
    } catch (error) {
      console.error('Error updating task: ', error);
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      await deleteDoc(doc(db, 'tasks', id));
    } catch (error) {
      console.error('Error deleting task: ', error);
    }
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
              onValueChange={() => handleToggleTask(item.id, item.completed)}
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