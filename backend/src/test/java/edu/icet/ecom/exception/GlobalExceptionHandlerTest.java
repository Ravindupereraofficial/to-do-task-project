package edu.icet.ecom.exception;

import edu.icet.ecom.controller.TaskController;
import edu.icet.ecom.dto.CreateTaskRequest;
import edu.icet.ecom.service.TaskService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.dao.DataAccessException;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(TaskController.class)
class GlobalExceptionHandlerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private TaskService taskService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void shouldHandleTaskNotFoundException() throws Exception {

        Long taskId = 999L;
        when(taskService.completeTask(eq(taskId)))
                .thenThrow(new TaskNotFoundException(taskId));


        mockMvc.perform(put("/api/tasks/{id}/complete", taskId))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.error").value("Task Not Found"))
                .andExpect(jsonPath("$.message").value("Task not found with id: " + taskId))
                .andExpect(jsonPath("$.status").value(404))
                .andExpect(jsonPath("$.timestamp").exists())
                .andExpect(jsonPath("$.path").value("/api/tasks/" + taskId + "/complete"));
    }

    @Test
    void shouldHandleTaskCreationException() throws Exception {

        CreateTaskRequest request = new CreateTaskRequest("Test Task", "Test Description");
        when(taskService.createTask(any(CreateTaskRequest.class)))
                .thenThrow(new TaskCreationException("Database connection failed"));


        mockMvc.perform(post("/api/tasks")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("Task Creation Failed"))
                .andExpect(jsonPath("$.message").value("Database connection failed"))
                .andExpect(jsonPath("$.status").value(400))
                .andExpect(jsonPath("$.timestamp").exists())
                .andExpect(jsonPath("$.path").value("/api/tasks"));
    }

    @Test
    void shouldHandleValidationException() throws Exception {

        CreateTaskRequest request = new CreateTaskRequest("", "Test Description");


        mockMvc.perform(post("/api/tasks")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("Validation Failed"))
                .andExpect(jsonPath("$.message").exists())
                .andExpect(jsonPath("$.status").value(400))
                .andExpect(jsonPath("$.timestamp").exists())
                .andExpect(jsonPath("$.path").value("/api/tasks"));
    }

    @Test
    void shouldHandleDataAccessException() throws Exception {

        when(taskService.getRecentUncompletedTasks())
                .thenThrow(new DataAccessException("Database connection lost") {});


        mockMvc.perform(get("/api/tasks/recent"))
                .andExpect(status().isInternalServerError())
                .andExpect(jsonPath("$.error").value("Database Error"))
                .andExpect(jsonPath("$.message").value("An error occurred while accessing the database"))
                .andExpect(jsonPath("$.status").value(500))
                .andExpect(jsonPath("$.timestamp").exists())
                .andExpect(jsonPath("$.path").value("/api/tasks/recent"));
    }

    @Test
    void shouldHandleIllegalArgumentException() throws Exception {

        Long invalidId = -1L;
        when(taskService.completeTask(eq(invalidId)))
                .thenThrow(new IllegalArgumentException("Task ID must be a positive number"));


        mockMvc.perform(put("/api/tasks/{id}/complete", invalidId))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("Invalid Argument"))
                .andExpect(jsonPath("$.message").value("Task ID must be a positive number"))
                .andExpect(jsonPath("$.status").value(400))
                .andExpect(jsonPath("$.timestamp").exists())
                .andExpect(jsonPath("$.path").value("/api/tasks/" + invalidId + "/complete"));
    }

    @Test
    void shouldHandleGenericException() throws Exception {

        when(taskService.getRecentUncompletedTasks())
                .thenThrow(new RuntimeException("Unexpected error occurred"));


        mockMvc.perform(get("/api/tasks/recent"))
                .andExpect(status().isInternalServerError())
                .andExpect(jsonPath("$.error").value("Internal Server Error"))
                .andExpect(jsonPath("$.message").value("An unexpected error occurred. Please try again later."))
                .andExpect(jsonPath("$.status").value(500))
                .andExpect(jsonPath("$.timestamp").exists())
                .andExpect(jsonPath("$.path").value("/api/tasks/recent"));
    }
}
