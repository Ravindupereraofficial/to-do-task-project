package edu.icet.ecom.service;

import edu.icet.ecom.dto.CreateTaskRequest;
import edu.icet.ecom.dto.TaskResponse;
import edu.icet.ecom.entity.Task;
import edu.icet.ecom.exception.TaskCreationException;
import edu.icet.ecom.exception.TaskNotFoundException;
import edu.icet.ecom.repository.TaskRepository;
import edu.icet.ecom.service.impl.TaskServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.modelmapper.ModelMapper;
import org.springframework.dao.DataAccessException;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TaskServiceTest {

    @Mock
    private TaskRepository taskRepository;

    @Mock
    private ModelMapper modelMapper;

    private TaskService taskService;

    @BeforeEach
    void setUp() {
        taskService = new TaskServiceImpl(taskRepository, modelMapper);
    }

    @Test
    void createTask_ShouldReturnTaskResponse() {

        CreateTaskRequest request = new CreateTaskRequest("Test Task", "Test Description");
        Task task = Task.builder()
                .title("Test Task")
                .description("Test Description")
                .build();
        Task savedTask = Task.builder()
                .id(1L)
                .title("Test Task")
                .description("Test Description")
                .createdAt(LocalDateTime.now())
                .completed(false)
                .build();
        TaskResponse expectedResponse = TaskResponse.builder()
                .id(1L)
                .title("Test Task")
                .description("Test Description")
                .completed(false)
                .build();

        when(modelMapper.map(request, Task.class)).thenReturn(task);
        when(taskRepository.save(task)).thenReturn(savedTask);
        when(modelMapper.map(savedTask, TaskResponse.class)).thenReturn(expectedResponse);


        TaskResponse response = taskService.createTask(request);


        assertNotNull(response);
        assertEquals(1L, response.getId());
        assertEquals("Test Task", response.getTitle());
        assertEquals("Test Description", response.getDescription());
        assertFalse(response.getCompleted());

        verify(modelMapper).map(request, Task.class);
        verify(taskRepository).save(task);
        verify(modelMapper).map(savedTask, TaskResponse.class);
    }

    @Test
    void createTask_ShouldThrowIllegalArgumentException_WhenTitleIsNull() {

        CreateTaskRequest request = new CreateTaskRequest(null, "Test Description");


        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class,
            () -> taskService.createTask(request));

        assertEquals("Task title cannot be null or empty", exception.getMessage());
        verifyNoInteractions(taskRepository);
    }

    @Test
    void createTask_ShouldThrowIllegalArgumentException_WhenTitleIsEmpty() {

        CreateTaskRequest request = new CreateTaskRequest("   ", "Test Description");


        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class,
            () -> taskService.createTask(request));

        assertEquals("Task title cannot be null or empty", exception.getMessage());
        verifyNoInteractions(taskRepository);
    }

    @Test
    void createTask_ShouldThrowTaskCreationException_WhenDatabaseError() {

        CreateTaskRequest request = new CreateTaskRequest("Test Task", "Test Description");
        Task task = Task.builder().title("Test Task").description("Test Description").build();

        when(modelMapper.map(request, Task.class)).thenReturn(task);
        when(taskRepository.save(task)).thenThrow(new DataAccessException("Database error") {});


        TaskCreationException exception = assertThrows(TaskCreationException.class,
            () -> taskService.createTask(request));

        assertEquals("Failed to create task due to database error", exception.getMessage());
        verify(taskRepository).save(task);
    }

    @Test
    void getRecentUncompletedTasks_ShouldReturnTop5Tasks() {

        Task task1 = Task.builder()
                .id(1L)
                .title("Task 1")
                .description("Description 1")
                .createdAt(LocalDateTime.now())
                .completed(false)
                .build();

        Task task2 = Task.builder()
                .id(2L)
                .title("Task 2")
                .description("Description 2")
                .createdAt(LocalDateTime.now())
                .completed(false)
                .build();

        List<Task> tasks = Arrays.asList(task1, task2);

        TaskResponse response1 = TaskResponse.builder()
                .id(1L)
                .title("Task 1")
                .description("Description 1")
                .completed(false)
                .build();

        TaskResponse response2 = TaskResponse.builder()
                .id(2L)
                .title("Task 2")
                .description("Description 2")
                .completed(false)
                .build();

        when(taskRepository.findTop5UncompletedTasksOrderByCreatedAtDesc()).thenReturn(tasks);
        when(modelMapper.map(task1, TaskResponse.class)).thenReturn(response1);
        when(modelMapper.map(task2, TaskResponse.class)).thenReturn(response2);


        List<TaskResponse> responses = taskService.getRecentUncompletedTasks();


        assertEquals(2, responses.size());
        assertEquals("Task 1", responses.get(0).getTitle());
        assertEquals("Task 2", responses.get(1).getTitle());

        verify(taskRepository).findTop5UncompletedTasksOrderByCreatedAtDesc();
        verify(modelMapper).map(task1, TaskResponse.class);
        verify(modelMapper).map(task2, TaskResponse.class);
    }

    @Test
    void completeTask_ShouldMarkTaskAsCompleted() {

        Long taskId = 1L;
        Task task = Task.builder()
                .id(taskId)
                .title("Test Task")
                .description("Test Description")
                .completed(false)
                .build();

        Task completedTask = Task.builder()
                .id(taskId)
                .title("Test Task")
                .description("Test Description")
                .completed(true)
                .build();

        TaskResponse expectedResponse = TaskResponse.builder()
                .id(taskId)
                .title("Test Task")
                .description("Test Description")
                .completed(true)
                .build();

        when(taskRepository.findById(taskId)).thenReturn(Optional.of(task));
        when(taskRepository.save(task)).thenReturn(completedTask);
        when(modelMapper.map(completedTask, TaskResponse.class)).thenReturn(expectedResponse);


        TaskResponse response = taskService.completeTask(taskId);


        assertTrue(response.getCompleted());
        verify(taskRepository).findById(taskId);
        verify(taskRepository).save(task);
        verify(modelMapper).map(completedTask, TaskResponse.class);
    }

    @Test
    void completeTask_ShouldThrowTaskNotFoundException_WhenTaskNotFound() {

        Long taskId = 1L;
        when(taskRepository.findById(taskId)).thenReturn(Optional.empty());


        TaskNotFoundException exception = assertThrows(TaskNotFoundException.class,
            () -> taskService.completeTask(taskId));

        assertEquals("Task not found with id: " + taskId, exception.getMessage());
        verify(taskRepository).findById(taskId);
        verify(taskRepository, never()).save(any());
        verify(modelMapper, never()).map(any(), eq(TaskResponse.class));
    }

    @Test
    void completeTask_ShouldThrowIllegalArgumentException_WhenIdIsNull() {

        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class,
            () -> taskService.completeTask(null));

        assertEquals("Task ID must be a positive number", exception.getMessage());
        verifyNoInteractions(taskRepository);
    }

    @Test
    void completeTask_ShouldThrowIllegalArgumentException_WhenIdIsNegative() {

        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class,
            () -> taskService.completeTask(-1L));

        assertEquals("Task ID must be a positive number", exception.getMessage());
        verifyNoInteractions(taskRepository);
    }

    @Test
    void completeTask_ShouldReturnSameResponse_WhenTaskAlreadyCompleted() {

        Long taskId = 1L;
        Task alreadyCompletedTask = Task.builder()
                .id(taskId)
                .title("Test Task")
                .description("Test Description")
                .completed(true)
                .build();

        TaskResponse expectedResponse = TaskResponse.builder()
                .id(taskId)
                .title("Test Task")
                .description("Test Description")
                .completed(true)
                .build();

        when(taskRepository.findById(taskId)).thenReturn(Optional.of(alreadyCompletedTask));
        when(modelMapper.map(alreadyCompletedTask, TaskResponse.class)).thenReturn(expectedResponse);


        TaskResponse response = taskService.completeTask(taskId);


        assertTrue(response.getCompleted());
        verify(taskRepository).findById(taskId);
        verify(taskRepository, never()).save(any()); // Should not save since already completed
        verify(modelMapper).map(alreadyCompletedTask, TaskResponse.class);
    }
}
