package edu.icet.ecom.controller;

import edu.icet.ecom.dto.CreateTaskRequest;
import edu.icet.ecom.dto.TaskResponse;
import edu.icet.ecom.service.TaskService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(TaskController.class)
class TaskControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private TaskService taskService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void createTask_ShouldReturn201_WhenValidRequest() throws Exception {

        CreateTaskRequest request = new CreateTaskRequest("Test Task", "Test Description");
        TaskResponse response = TaskResponse.builder()
                .id(1L)
                .title("Test Task")
                .description("Test Description")
                .createdAt(LocalDateTime.now())
                .completed(false)
                .build();

        when(taskService.createTask(any(CreateTaskRequest.class))).thenReturn(response);


        mockMvc.perform(post("/api/tasks")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.title").value("Test Task"))
                .andExpect(jsonPath("$.description").value("Test Description"))
                .andExpect(jsonPath("$.completed").value(false));
    }

    @Test
    void createTask_ShouldReturn400_WhenTitleIsBlank() throws Exception {

        CreateTaskRequest request = new CreateTaskRequest("", "Test Description");


        mockMvc.perform(post("/api/tasks")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void getRecentTasks_ShouldReturnTasks() throws Exception {

        List<TaskResponse> tasks = Arrays.asList(
                TaskResponse.builder()
                        .id(1L)
                        .title("Task 1")
                        .description("Description 1")
                        .createdAt(LocalDateTime.now())
                        .completed(false)
                        .build(),
                TaskResponse.builder()
                        .id(2L)
                        .title("Task 2")
                        .description("Description 2")
                        .createdAt(LocalDateTime.now())
                        .completed(false)
                        .build()
        );

        when(taskService.getRecentUncompletedTasks()).thenReturn(tasks);


        mockMvc.perform(get("/api/tasks/recent"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].title").value("Task 1"))
                .andExpect(jsonPath("$[1].title").value("Task 2"));
    }

    @Test
    void completeTask_ShouldReturn200_WhenTaskExists() throws Exception {

        Long taskId = 1L;
        TaskResponse response = TaskResponse.builder()
                .id(taskId)
                .title("Test Task")
                .description("Test Description")
                .createdAt(LocalDateTime.now())
                .completed(true)
                .build();

        when(taskService.completeTask(eq(taskId))).thenReturn(response);


        mockMvc.perform(put("/api/tasks/{id}/complete", taskId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.completed").value(true));
    }

    @Test
    void completeTask_ShouldReturn404_WhenTaskNotFound() throws Exception {

        Long taskId = 999L;
        when(taskService.completeTask(eq(taskId))).thenThrow(new RuntimeException("Task not found"));


        mockMvc.perform(put("/api/tasks/{id}/complete", taskId))
                .andExpect(status().isNotFound());
    }
}
