package edu.icet.ecom.service.impl;

import edu.icet.ecom.dto.CreateTaskRequest;
import edu.icet.ecom.dto.TaskResponse;
import edu.icet.ecom.entity.Task;
import edu.icet.ecom.exception.TaskCreationException;
import edu.icet.ecom.exception.TaskNotFoundException;
import edu.icet.ecom.repository.TaskRepository;
import edu.icet.ecom.service.TaskService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.dao.DataAccessException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class TaskServiceImpl implements TaskService {

    private final TaskRepository taskRepository;
    private final ModelMapper modelMapper;

    @Override
    public TaskResponse createTask(CreateTaskRequest request) {
        try {
            log.info("Creating new task with title: {}", request.getTitle());

            if (request.getTitle() == null || request.getTitle().trim().isEmpty()) {
                throw new IllegalArgumentException("Task title cannot be null or empty");
            }

            Task task = modelMapper.map(request, Task.class);
            Task savedTask = taskRepository.save(task);

            log.info("Successfully created task with id: {}", savedTask.getId());
            return modelMapper.map(savedTask, TaskResponse.class);

        } catch (DataAccessException ex) {
            log.error("Database error while creating task: {}", ex.getMessage(), ex);
            throw new TaskCreationException("Failed to create task due to database error", ex);
        } catch (Exception ex) {
            log.error("Unexpected error while creating task: {}", ex.getMessage(), ex);
            throw new TaskCreationException("Failed to create task: " + ex.getMessage(), ex);
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<TaskResponse> getRecentUncompletedTasks() {
        try {
            log.info("Fetching recent uncompleted tasks");

            List<Task> tasks = taskRepository.findTop5UncompletedTasksOrderByCreatedAtDesc();
            List<TaskResponse> responses = tasks.stream()
                    .limit(5)
                    .map(task -> modelMapper.map(task, TaskResponse.class))
                    .toList();

            log.info("Successfully fetched {} uncompleted tasks", responses.size());
            return responses;

        } catch (DataAccessException ex) {
            log.error("Database error while fetching tasks: {}", ex.getMessage(), ex);
            throw ex; // Let global handler catch this
        } catch (Exception ex) {
            log.error("Unexpected error while fetching tasks: {}", ex.getMessage(), ex);
            throw new RuntimeException("Failed to fetch tasks", ex);
        }
    }

    @Override
    public TaskResponse completeTask(Long id) {
        try {
            log.info("Completing task with id: {}", id);

            if (id == null || id <= 0) {
                throw new IllegalArgumentException("Task ID must be a positive number");
            }

            Task task = taskRepository.findById(id)
                    .orElseThrow(() -> new TaskNotFoundException(id));

            if (task.getCompleted()) {
                log.warn("Task with id {} is already completed", id);
                return modelMapper.map(task, TaskResponse.class);
            }

            task.setCompleted(true);
            Task savedTask = taskRepository.save(task);

            log.info("Successfully completed task with id: {}", id);
            return modelMapper.map(savedTask, TaskResponse.class);

        } catch (TaskNotFoundException ex) {
            log.error("Task not found with id: {}", id);
            throw ex; // Re-throw to be handled by global exception handler
        } catch (DataAccessException ex) {
            log.error("Database error while completing task: {}", ex.getMessage(), ex);
            throw ex; // Let global handler catch this
        } catch (Exception ex) {
            log.error("Unexpected error while completing task: {}", ex.getMessage(), ex);
            throw new RuntimeException("Failed to complete task with id: " + id, ex);
        }
    }

    @Override
    public TaskResponse updateTask(Long id, CreateTaskRequest request) {
        try {
            log.info("Updating task with id: {}", id);

            if (id == null || id <= 0) {
                throw new IllegalArgumentException("Task ID must be a positive number");
            }

            if (request.getTitle() == null || request.getTitle().trim().isEmpty()) {
                throw new IllegalArgumentException("Task title cannot be null or empty");
            }

            Task task = taskRepository.findById(id)
                    .orElseThrow(() -> new TaskNotFoundException(id));


            task.setTitle(request.getTitle().trim());
            task.setDescription(request.getDescription() != null ? request.getDescription().trim() : null);

            Task savedTask = taskRepository.save(task);

            log.info("Successfully updated task with id: {}", id);
            return modelMapper.map(savedTask, TaskResponse.class);

        } catch (TaskNotFoundException ex) {
            log.error("Task not found with id: {}", id);
            throw ex;
        } catch (DataAccessException ex) {
            log.error("Database error while updating task: {}", ex.getMessage(), ex);
            throw ex;
        } catch (Exception ex) {
            log.error("Unexpected error while updating task: {}", ex.getMessage(), ex);
            throw new RuntimeException("Failed to update task with id: " + id, ex);
        }
    }
}
