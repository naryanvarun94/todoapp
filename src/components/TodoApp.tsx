import {
    Box, Button, Typography, TextField, Dialog, DialogTitle,
    DialogContent, DialogActions, List, ListItem, ListItemText,
    IconButton, Checkbox, Stack, ToggleButtonGroup, ToggleButton,
    Divider
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import { useState } from 'react';
import clsx from 'clsx';
import styles from './TodoApp.module.css';


type Task = {
    id: number;
    text: string;
    completed: boolean;
};

const TodoApp: React.FC = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [open, setOpen] = useState(false);
    const [newTask, setNewTask] = useState('');
    const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
    const [editTaskId, setEditTaskId] = useState<number | null>(null);


    const handleSaveTask = () => {
        if (!newTask.trim()) return;

        if (editTaskId !== null) {
            setTasks(prev =>
                prev.map(task =>
                    task.id === editTaskId ? { ...task, text: newTask } : task
                )
            );
        } else {
            setTasks(prev => [
                ...prev,
                { id: Date.now(), text: newTask, completed: false }
            ]);
        }

        setNewTask('');
        setEditTaskId(null);
        setOpen(false);
    };


    const handleDelete = (id: number) => setTasks(tasks.filter(task => task.id !== id));
    const handleToggle = (id: number) =>
        setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
    const handleFilterChange = (_: any, value: any) => value && setFilter(value);

    const filteredTasks = tasks.filter(task =>
        filter === 'all' ? true : filter === 'active' ? !task.completed : task.completed
    );

    const handleEdit = (task: Task) => {
        setNewTask(task.text);
        setEditTaskId(task.id);
        setOpen(true);
    };


    const itemsLeft = tasks.filter(task => !task.completed).length;

    return (
        <Box className={styles.todoContainer}>
            <Box><Typography variant="h4" className={styles.headerTitle} gutterBottom>
                Todo List App
            </Typography>
                <Typography textAlign="center" color="gray" mb={2}>
                    Organize your day, beautifully.
                </Typography>

                <Button
                    fullWidth
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => setOpen(true)}
                    sx={{ mb: 2, backgroundColor: '#2196f3' }}
                >
                    Add New Task
                </Button>

                <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                    <Typography>{itemsLeft} items left</Typography>
                    <ToggleButtonGroup
                        value={filter}
                        exclusive
                        onChange={handleFilterChange}
                        size="small"
                        sx={{
                            bgcolor: '#374151',
                            borderRadius: 1,
                            '& .MuiToggleButton-root': {
                                color: 'white',
                                '&.Mui-selected': {
                                    bgcolor: '#2196f3',
                                    color: 'white',
                                    borderRadius: '5px'
                                },
                                '&:not(.Mui-selected)': {
                                    bgcolor: '#4b5563',
                                    color: 'white',
                                }
                            }
                        }}
                    >
                        <ToggleButton value="all" >All</ToggleButton>
                        <ToggleButton value="active">Active</ToggleButton>
                        <ToggleButton value="completed">Completed</ToggleButton>
                    </ToggleButtonGroup>
                </Stack>

                {filteredTasks.length === 0 ? (
                    <Box textAlign="center" py={5} borderRadius={2} bgcolor="#374151">
                        <Typography>No tasks yet. Add one to get started!</Typography>
                    </Box>
                ) : (
                    <List>
                        {filteredTasks.map(task => (
                            <ListItem
                                key={task.id}
                                secondaryAction={
                                    <Stack direction="row" spacing={1}>
                                        <IconButton edge="end" onClick={() => handleEdit(task)}>
                                            <EditIcon sx={{ color: 'gray' }} />
                                        </IconButton>
                                        <IconButton edge="end" onClick={() => handleDelete(task.id)}>
                                            <DeleteIcon sx={{ color: 'gray' }} />
                                        </IconButton>
                                    </Stack>
                                }

                                disablePadding
                                className={styles.taskItem}
                            >
                                <Checkbox
                                    checked={task.completed}
                                    onChange={() => handleToggle(task.id)}
                                    sx={{ color: '#2196f3' }}
                                />
                                <ListItemText
                                    primary={task.text}
                                    className={clsx({
                                        [styles.taskCompleted]: task.completed,
                                        [styles.taskText]: !task.completed,
                                    })}
                                />
                            </ListItem>
                        ))}
                    </List>
                )}

                <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
                    <DialogTitle>Add New Task</DialogTitle>
                    <DialogContent>
                        <TextField
                            label="Task Description"
                            fullWidth
                            value={newTask}
                            onChange={(e) => setNewTask(e.target.value)}
                            placeholder="What needs to be done?"
                            multiline
                            rows={3}
                            margin="normal"
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpen(false)} color="inherit">Cancel</Button>
                        <Button onClick={handleSaveTask} variant="contained" startIcon={<AddIcon />}>
                            {editTaskId !== null ? 'Update Task' : 'Save Task'}
                        </Button>
                    </DialogActions>
                </Dialog></Box>
            <Box>
                <Divider sx={{ mt: 4, mb: 2, borderColor: 'gray' }} />
                <Typography textAlign="center" fontSize={12} color="gray">
                    Crafted with ❤️ <br />
                    Powered by React, TypeScript & MUI
                </Typography>
            </Box>
        </Box>
    );
};

export default TodoApp;
